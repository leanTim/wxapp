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
        checked: 'true',
        searchParams: 'q',
        count: 20,
        page: 1,
        movieList: [],
        shouldLoad: true,
        sort: ''
    },
    radioChange: function (e) {
        this.setData({ 
            checked: !this.data.checked,
            searchParams: e.detail.value
        })
        console.log(this.data, e.detail.value)

    },
    handleBlur: function (e) {
        var sort = `search?${this.data.searchParams}=${e.detail.value}`
        this.setData({sort: sort})
        if(!e.detail.value) return
        if (!this.data.shouldLoad) return;
        this.loadMore()       
    },
    loadMore: function () {           
        wx.showLoading({ title: '拼命加载中...' })
        fetch(this.data.sort, { count: 20, start: (this.data.page - 1) * this.data.count })
            .then(res => {
                console.log(res)
                if (res.data.subjects.length === this.data.count) {
                    var currentPage = ++this.data.page                   
                    this.setData({ page: currentPage, movieList: this.data.movieList.concat(res.data.subjects) })
                } else {
                    this.setData({movieList: this.data.movieList.concat(res.data.subjects), shouldLoad: false})
                }   
                wx.hideLoading();
            }).catch(
                e => {
                    this.setData({ subTitle: '加载异常，请重试' })
                    console.log(e)
                    wx.hideLoading();
                }
            )
    },
    onReachBottom: function () {
        if (!this.data.shouldLoad) return;
        this.loadMore()
    }
})