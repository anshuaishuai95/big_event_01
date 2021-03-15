$(function () {
    //需求1： 点击去注册账号，隐藏登录区域， 显示注册区域
    $('#link_reg').click(function () {
        $('.login-box').hide();
        $('.reg-box').show();
    })
    //点击去登录账号，隐藏注册区域， 显示登录区域
    $('#link_login').click(function () {
        $('.reg-box').hide();
        $('.login-box').show();
    })

    //需求2： layui 校验规则
    let form = layui.form;
    form.verify({
        // 密码规则
        pwd: [
            /^[\S]{6,12}$/,
            '密码必须6到12位，且不能出现空格'
        ],
        repwd: function (value, item) {
            // console.log(value);
            //判断两次的密码是否相等 如果不等 结束函数 并提示
            if (value !== ($('.reg-box input[name=password]')).val()) return '两次输入的密码不一样，请重新输入'
        }
    })

    //需求3 ： 用户注册
    let layer = layui.layer;
    $('#form_reg').on('submit', function (e) {
        //阻止表单提交
        e.preventDefault();
        //发送ajax
        $.ajax({
            type: 'POST',
            url: '/api/reguser',

            data: {
                username: $('.reg-box input[name=username]').val(),
                password: $('.reg-box input[name=password]').val(),
            },
            success: (res) => {
                // console.log(res);
                //返回状态判断
                if (res.status != 0) {
                    // return alert(res.message)
                    return layer.msg(res.message, { icon: 5 });
                }
                //提示成功
                layer.msg(res.message, { icon: 6 });
                // 手动切换到整理课表单
                $('#link_login').click();
                //重置form 表单 
                $('#form_reg')[0].reset()
            }
        })
    })

    //需求4：用户登录
    $('#form_login').on('submit', function (e) {
        //阻止表单的默认提交
        e.preventDefault();
        //发送ajax
        $.ajax({
            type: 'POST',
            url: '/api/login',

            data: $(this).serialize(),
            success: function (res) {
                //返回状态判断
                console.log(res);
                if (res.status !== 0) {
                    // return alert(res.message)
                    return layer.msg(res.message);
                }
                //提示成功
                layer.msg(res.message);
                //保存token  未来接口使用的token
                localStorage.setItem('token', res.token);
                //登录成功 跳转页面
                location.href = '/index.html';

            }
        })
    })
})