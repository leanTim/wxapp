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
        meta: {}
    },
    onLoad: function (params) {
        var id = params.id

        fetch(`subject/${ id }`)
        .then(res => {
            this.setData({meta: res})
            console.log(this.data)
        })
    }
})