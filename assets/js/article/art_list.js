$(function () {
    // 向模板引擎中导入 变量/函数
    template.defaults.imports.dataFormat = function (dateStr) {
        let dt = new Date(dateStr);
        let y = dt.getFullYear();
        let m = padZero(dt.getMonth() + 1);
        let d = padZero(dt.getDate());

        let hh = padZero(dt.getHours());
        let mm = padZero(dt.getMinutes());
        let ss = padZero(dt.getSeconds());

        return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
    }
    function padZero(num) {
        return num < 10 ? '0' + num : num

    }

    //定义查询参数
    let q = {
        pagenum: 1,    //是	int	页码值
        pagesize: 2,	//是	int	每页显示多少条数据
        cate_id: '',    //否	string	文章分类的 Id
        state: ''            //否	string	文章的状态，可选值有：已发布、草稿
    }
    //2:
    let layer = layui.layer
    initTable();
    function initTable() {
        $.ajax({
            method: 'get',
            url: '/my/article/list',
            data: q,
            success: (res) => {
                // console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message)
                }
                let htmlStr = template('tpl-table', { data: res.data })
                $('tbody').html(htmlStr)
                //调永分页
                renderPage(res.total)
            }
        })
    }
    // 3.初始化分类
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

    //筛选
    $('#form_search').on('submit', function (e) {
        e.preventDefault()
        //获取
        let state = $('[name=state]').val();
        let cate_id = $('[name=cate_id]').val();
        //赋值
        q.state = state;
        q.cate_id = cate_id;
        initTable()
    })


    //分页
    let laypage = layui.laypage;
    function renderPage(total) {
        layui.use('laypage', function () {
            //执行一个laypage实例
            laypage.render({
                elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
                count: total, //数据总数，从服务端得到
                limit: q.pagesize,//每页几条
                curr: q.pagenum, //第几页
                //页面切换触发这个方法
                //分页模块设置，显示哪些模块
                layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
                limits: [2, 3, 5],
                jump: function (obj, first) {
                    if (!first) {
                        q.pagenum = obj.curr;
                        q.pagesize = obj.limit;
                        initTable()
                    }


                }
            });
        });
    }

    //删除
    // let layer = layui.layer
    $('tbody').on('click', '.btn-delete', function () {
        // 先获取 Id  进入到函数中的this代指就改变了
        let Id = $(this).attr('data-id');
        //显示对话框
        //eg1
        layer.confirm('是否确定要删除?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                url: '/my/article/delete/' + Id,
                success: (res) => {
                    //    console.log(res);
                    if (res.status != 0) {
                        return layer.msg(res.message)
                    }
                    //删除成功，重新渲染页面数据

                    layer.msg('删除成功')
                    //页面汇总 删除按钮个数等于1 页码大于1
                    if ($('.btn-delete').length == 1 && q.pagenum > 1) {
                        q.pagenum--;
                    }
                    initTable();
                }
            })

            layer.close(index);
        });


    })
})