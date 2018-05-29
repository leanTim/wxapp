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
        searchParams: 'q', //豆瓣电影搜索api的key值 q tag
        searchText: '',  //搜索关键字
        count: 20,  //每次返回结果条数
        noResult: '',
        page: 1,
        movieList: [], 
        shouldLoad: true, 
        sort: '',
        promiseArr: []
    },
    radioChange: function (e) {
        this.setData({ 
            checked: !this.data.checked,
            searchParams: e.detail.value,
            sort: `search?${e.detail.value}=${this.data.searchText}`
        })
        console.log(this.data)
        if(this.data.searchText == '') return
        this.setData({page: 1, movieList: []})
        this.loadMore()
    },
    handleBlur: function (e) {
        var sort = `search?${this.data.searchParams}=${e.detail.value}`
        this.setData({sort: sort, searchText: e.detail.value})       
        if(!e.detail.value) return
        if (!this.data.shouldLoad) return;
        this.loadMore()       
    },
    loadMore: function () {           
        wx.showLoading({ title: '拼命加载中...' })
        var sort = this.data.sort
        fetch(sort, { count: 20, start: (this.data.page - 1) * this.data.count })
            .then(res => {
                if (res.data.subjects.length == 0) {
                    this.setData({noResult: '没有找到结果，换个词在搜一次吧~~'})
                }
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