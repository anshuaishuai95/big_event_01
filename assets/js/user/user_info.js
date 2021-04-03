$(function () {
    let form = layui.form
    //  校验规则
    form.verify({
        nickname: function (value) {
            if (value.trim().length < 1 || value.trim().length > 6) {
                return '昵称长度为1~6位之间'
            }
        }
    })
    //展示用户信息 （后面需要多次调用 所有封装成函数）
    // 导出layer
    let layer = layui.layer
    inituserInfo()
    function inituserInfo() {
        $.ajax({
            method: 'get',
            url: '/my/userinfo',
            success: (res) => {
                // console.log(123, res);
                if (res.status != 0) {
                    return layer.msg(res.mseeage, { icon: 5 })
                }
                //成功后 渲染
                form.val('formUserInfo', res.data)
            }
        })
    }

    // 重置按钮 
    $('#btnReset').click(function (e) {
        // 阻止默认提交
        e.preventDefault()
        //   重置之后用ajax 发送过来的数据信息
        inituserInfo()
    })
    // 修改用户信息
    $('.layui-form').on('submit', function (e) {
        e.preventDefault();
        // 发送ajax
        $.ajax({
            method: 'post',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: (res) => {
                // console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.mseeage, { icon: 5 });
                }
                layer.msg('用户信息修改成功')
                //调用父页面中的更新通话信息 和头像
                window.parent.getUserInfo();

            }


        })
    })

})