$(function() {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage;

    // 定义美化时间的过滤器
    template.default.imports.dataFormat = function(date) {
        const dt = new Date(date)
        var y = dt.getFullYear()
        var m = PadZero(dt.getMonth() + 1)
        var d = PadZero(dt.getDate())

        var hh = PadZero(dt.getHours())
        var mm = PadZero(dt.getMinutes())
        var ss = PadZero(dt.getSeconds())

        return y + '-' + m + '-' + d + '' + hh + ':' + mm + ':' + ss
    }
    // 定义补零的函数
    function PadZero(n) {
        return n > 9 ? n : '0' + n
    }

    // 定义一个查询的参数对象，将来请求数据的时候
    // 需要将请求参数对象提交到服务器
    var q = {
        pagenum:1,
        pagesize:2,
        cate_id: '',
        state: ''
    }

    initTable()

    // 获取文章列表的数据方法
    function initTable() {
        $.ajax({
            method:'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if(res.status!==0) {
                    return layer.msg('获取文章列表失败')
                }
                // 使用模板引擎渲染页面的数据
                var htmlStr = template('tpl-table',res)
                $('tbody').html(htmlStr)
                renderPage(res.total)
            }
        })
    }

    // 初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/artical/cates',
            success: function(res) {
                if (res.status!==0) {
                    return layer.msg('获取分类失败！')
                }
                // 调用模板引擎渲染分类的可选项
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                // 通过layui重新渲染表单区域的UI结构
                form.render()
            }
        })
    }

    // 为筛选的表单绑定submit事件
    $('#form-search').on('submit', function(e) {
        e.preventDefault();
        // 
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()

        q.cate_id = cate_id
        q.state = state
        initTable()
    })

    // 定义渲染分页的方法
    function renderPage(total) {
        // 调用laypage.render()方法来渲染分页的结构
        laypage.render({
            elem: 'PageBox', //注意，这里的 test1 是 ID，不用加 # 号
            count: total ,//数据总数，从服务端得到
            limit: q.pagesize, //每页显示几条数据
            curr: q.pagenum ,//设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next','skip'],
            limits: [2, 3, 5, 10],
            jump: function(obj, first) {
                q.pagenum = obj.curr

                q.pagesize = obj.limit
                // 根据最新的q获取对应的数据列表，并渲染表格
                if (!first) {
                    initTable()
                }
            }
        });
    }

    // 通过代理的形式，为删除按钮绑定点击事件处理函数
    $('tbody').on('click', '.btn-delete', function() {
        // 获取到文章的id
        var id = $(this).attr('data-id')
        // 询问用户是否要删除数据
        layer.confirm('确认删除?', {icon: 3, title:'提示'}, function(index){
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！')
                    }
                    layer.msg('删除文章成功！')
                    initTable()
                }
            })
            layer.close(index);
          });
    })
})