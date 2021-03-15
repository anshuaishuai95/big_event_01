$(function () {
    //定义密码规则
    let form = layui.form
    form.verify({
        //密码
        pwd: [
            /^[\S]{6,12}$/,
            '密码必须6到12位，且不能出现空格'
        ],
        //新密码
        smaePwd: function (value) {
            //旧密码不能和新密码重复
            if (value == $('[name=oldPwd]').val()) {
                return '旧密码不能和新密码重复'
            }
        },
        //重复新密码
        rePwd: function (value) {
            //新密码 和重复新密码 必须保持一致
            if (value != $('[name=newPwd]').val()) {
                return '新密码 和重复新密码 必须保持一致'
            }
        }
    })

    //修改密码
    $('form').on('submit', function (e) {
        //阻止默认提交
        e.preventDefault();
        // 发送ajax
        $.ajax({
            type: 'post',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: (res) => {
                //    console.log(res);
                if (res.status != 0) {
                    return layui.layer.msg(res.message, { icon: 5 })

                }
                //修改密码成功提示
                layui.layer.msg(res.message);
                $('form')[0].reset()
            }
        })

    })
})