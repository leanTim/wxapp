
var baseURL = 'https://api.douban.com/v2/movies/'

/**
 * 
 * @param {*} sort 电影分类
 * @param {*} data 参数
 */
module.exports = function fetch (sort, data) {
    return new Promise((resolve, reject) => {
        wx.request({
            url: baseURL + sort,
            data: data,
            success: resolve,
            fail: reject
        })
    })
}