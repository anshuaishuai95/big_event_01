//入口函数
$(function () {
    //获取用户信息
    getUserInfo()

    //退出登录，其他地方用不到 所以不用封装成函数
    let layer = layui.layer
    //点击退出。弹出一个提示框
    $('#btnLogout').click(function () {
        //eg1
        layer.confirm('确定要退出登录?', { icon: 3, title: '提示' }, function (index) {
            //do something
            //弹窗 销毁token  跳转到登录页面
            localStorage.removeItem('token')
            // 跳转到登录页面
            location.href = '/login.html'


            //关闭弹出的提示框
            layer.close(index);
        });
    })
})

// 获取用户信息 封装一个函数在全局 
// 因为后面的其他页面需要调用
function getUserInfo() {
    //发送ajax
    $.ajax({
        url: '/my/userinfo',
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: (res) => {
            // console.log(res);

            if (res.status != 0) {
                // console.log(11);
                return layui.layer.msg(res.message, { icon: 5 })
            }
            //头像和文字渲染
            renderAvatar(res.data)
        }
    })
}
// 头像和文字渲染 封装
function renderAvatar(user) {
    //渲染用户名。如果有昵称 以昵称为准
    let name = user.nickname || user.username;
    $('#welcome').html('欢迎&nbsp&nbsp' + name);
    if (user.user_pic == null) {
        //隐藏图片头像  渲染文字头像
        $('.layui-nav-img').hide()
        $('.text-avatar').show().html(name[0].toUpperCase())

    } else {
        //渲染图片头像  隐藏文字头像
        $('.layui-nav-img').show().attr('src', user.user_pic);
        $('.text-avatar').hide()
    }

}