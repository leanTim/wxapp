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
        sort: 'in_theaters',
        count: 20,
        page: 1,
        shouldLoad: true,
        title: '',
        subTitle: '加载中...',
        movieList: []
    },
    loadMore: function () {        
        
        wx.showLoading({ title: '拼命加载中...' })
        fetch(this.data.sort, { count: 20, start: (this.data.page - 1) * this.data.count })
            .then(res => {
                
                if (res.data.subjects.length === this.data.count) {
                    var currentPage = ++this.data.page                   
                    this.setData({ page: currentPage, subTitle: res.data.title, movieList: this.data.movieList.concat(res.data.subjects) })
                } else {
                    this.setData({subTitle: res.data.title, movieList: this.data.movieList.concat(res.data.subjects), shouldLoad: false})
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
    onLoad: function (params) {


        this.data.sort = params.sort || this.data.sort
        this.data.title = params.title || this.data.title
        if (!this.data.shouldLoad) return;
        this.loadMore()
    },
    onReady: function () {
        wx.setNavigationBarTitle({ title: this.data.title + ' « 电影 « 豆瓣' })
    },
    onPullDownRefresh: function () {
        
    },
    onReachBottom: function () {
        if (!this.data.shouldLoad) return;
        this.loadMore()
    }
})