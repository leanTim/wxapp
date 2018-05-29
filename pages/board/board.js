const app = getApp()

const baseURL = 'https://douban.uieee.com/v2/movie/'
function fetch(sort, data) {
    return new Promise((resolve, reject) => {
        wx.request({
            url: baseURL + sort,
            data: data,
            header: { 'content-type': 'json' },
            success: resolve,
            fail: reject
        })
    })
}

Page({
    data: {
        sorts: [
            { key: 'in_theaters' },
            { key: 'coming_soon' },
            { key: 'weekly' },
            { key: 'new_movies' },
            { key: 'top250' },
            { key: 'us_box' }
        ],
        text: 'why not show'
    },
    onLoad: function () {
        const tasks = this.data.sorts.map((sort) => {
            return fetch(sort.key, { count: 8 }).then((res) => {
                sort.title = res.data.title;
                sort.dataArr = res.data.subjects;
                return sort;
            })
        })

        Promise.all(tasks).then(sorts => {
            this.setData({ sorts: sorts })
        })
    }
})