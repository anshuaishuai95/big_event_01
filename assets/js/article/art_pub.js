$(function () {
    initCate()
    function initCate() {
        $.ajax({
            msthod: 'get',
            url: '/my/article/cates',

            success: (res) => {
                // console.log(res);
                let htmlSte = template('tpl-cate', { data: res.data })
                $('[name=cate_id]').html(htmlSte)
                layui.form.render()
            }
        })
    }


    // 2。 初始化富文本编辑器
    initEditor()

    // 3.
    // 1. 初始化图片裁剪器
    let $image = $('#image')

    // 2. 裁剪选项
    let options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    //4. 点击按钮，选择图片
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click()
    })
    //5. 选择文件 同步修改图片预览区
    $('#coverFile').on('change', function (e) {
        let file = e.target.files[0]
        //非空效验
        if (file == undefined) {
            return
        }
        //根据选择的文件，创建一个对应的URL 地址
        let newImgURL = URL.createObjectURL(file)
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    //6. 状态参数定义  
    let state = '已发布';
    //  一开始设置了默认值 
    // $('#btnSave1').on('click',function () {
    //     state ='已发布'
    // })
    $('#btnSave2').on('click', function () {
        state = '草稿'
    })
    // 添加文章
    $('#form-pub').on('submit', function (e) {
        e.preventDefault()
        //创建 FormData对象,收集数据
        let fd = new FormData(this);
        //放入状态
        fd.append('state', state);
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob)
                // console.log(...fd);
                //发送ajax
                publishArticle(fd)
            });
    })

    //封装函数
    function publishArticle(fd) {
        $.ajax({
            method: 'post',
            url: '/my/article/add',
            data: fd,
            contentType: false,
            processData: false,
            success: (res) => {
                // console.log(res);
                if (res.status != 0) {
                    return layui.layer.msg(res.message)
                }
                //成功提示 页面跳转
                layui.layer.msg(res.message)
                setTimeout(function () {
                    window.parent.document.querySelector('#art_list').click()
                }, 1000)
            }
        })
    }
})