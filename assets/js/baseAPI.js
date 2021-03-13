//开发环境服务器地址
let baseURL = 'http://ajax.frontend.itheima.net';
// 测试环境服务器地址
// let baseURL = 'http://ajax.frontend.itheima.net';
//生产环境服务器地址
// let baseURL = 'http://ajax.frontend.itheima.net';
$.ajaxPrefilter(function (options) {
    options.url = baseURL + options.url
})