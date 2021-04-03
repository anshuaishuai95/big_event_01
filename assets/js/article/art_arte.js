$(function () {
    //渲染文章分类列表 （后面 添加，修改 还有调用。所以封装成函数）
    let layer = layui.layer
    initArtCateList();

    //1：  封装函数
    function initArtCateList() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: (res) => {
                // console.log(res);
                //状态判断
                if (res.status != 0) {
                    return layer.msg(res.mseeage)
                }
                let htmlStr = template('tt', { data: res.data })
                $('tbody').html(htmlStr)
            }
        })
    }


    //2： 添加文章分类列表 结构 
    let indexAdd = null
    $('#btnAdd').on('click', function () {
        //框架
        indexAdd = layer.open({
            type: 1,
            title: '添加文章分类',
            area: ['500px', '260px'],
            content: $('#dialog-add').html()
        });

    })
    //3： 事件委托  因为form表单是在script标签模板引擎里面，所有父元素是body
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'post',
            url: '/my/article/addcates',
            data: {
                name: $('[name=name]').val(),
                alias: $('[name=alias]').val()
            },
            success: (res) => {
                console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message)
                }
                //添加成功 重新渲染页面
                initArtCateList();
                //关闭对胡框
                layer.close(indexAdd)
            }
        })
    })
    //4：修改文章类别，（html结构） 事件委托
    let indexEdit = null
    let form = layui.form
    let id = ''
    $('tbody').on('click', '.btn-edit', function () {
        // 显示修改的 form
        id = $(this).attr('data-id');
        // console.log(id);
        indexEdit = layer.open({
            type: 1,
            title: '修改文章分类',
            area: ['500px', '260px'],
            content: $('#dialog-edit').html()
        });
        //发送ajax 把数据渲染到 form 中
        $.ajax({
            method: 'get',
            url: '/my/article/cates/',
            success: (res) => {
                console.log(6666, res);
                if (res.status != 0) {
                    return layer.msg(res.message)
                }
                //渲染到页面
                form.val('form-edit', res.data)
            }
        })
    })

    // 5   修改 提交
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault();
        console.log(id);
        $.ajax({
            method: 'post',
            url: '/my/article/updatecate',
            data: {
                id: id,
                name: $('[name=name]').val(),
                alias: $('[name=alias]').val(),
            },
            success: (res) => {
                console.log(123, res);
                if (res.status != 0) {
                    return layer.msg(res.message)
                }
                //更新成功 重新渲染页面
                initArtCateList();
                layer.msg('文章类别更新成功')
                layer.close(indexEdit)
            }
        })
    })
    // //6 删除
    $('tbody').on('click', '.btn-delete', function () {
        //先获取 Id 进入到函数中this代指就改变了
        let Id = JSON.parse($(this).attr('data-id'))
        console.log(123, Id);
        //eg1
        layer.confirm('是否确定要删除?', { icon: 3, title: '提示' }, function (index) {
            //do something
            // 发送ajax
            $.ajax({
                method: 'get',
                url: '/my/article/deletecate/',
                data: {
                    id: Id
                },
                success: (res) => {
                    // console.log(res);
                    if (res.status != 0) {
                        return layer.msg(res.message)
                    }
                    //删除成功
                    layer.msg(res.message);
                    //删除成功后重新渲染页面
                    initArtCateList()
                    layer.close(index);
                }
            })


        });
    })
})