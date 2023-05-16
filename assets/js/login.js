$(function() {
    // 点击“去注册账号”的链接
    $('#link_reg').on('click', function() {
        $('.login_box').hide();
        $('.reg_box').show();
    })
    // 点击“登录”的链接
    $('#link_login').on('click', function() {
        $('.login_box').show();
        $('.reg_box').hide();
    })

    // 从layui里面获取form对象
    var form = layui.form
    var layer = layui.layer
    // 通过form.verify()函数自定义校验规则
    form.verify({
        // 自定义了一个叫pwd的校验规则
        pwd:[/^[\S]{6,12}$/ ,'密码必须6到12位，且不能出现空格'] ,
        // 校验两次代码是否一致的规则
        repwd: function(value) {
            var pwd = $('.reg_box [name=password]').val();
            if (pwd !== value) {
                return '两次密码不一致！'
            }
        }
    })

    // 监听注册表单的提交事件
    $('#form_reg').on('submit', function(e) {
        // 1.阻止默认的提交行为
        e.preventDefault();
        // 2.发起ajax的post请求
        var data = {username: $('#form_reg [name=username]').val(), password: $('#form_reg [name=password]').val()};
        $.post('/api/reguser', data, function(res) {
            console.log(res)
            if (res.status !== 0) {
                return layer.msg(res.message);
            }
            layer.msg('注册成功，请登录')
            // 拟人的点击行为
            $('#link_login').click();
        })
    })

    // 监听登录表单的提交事件
    $('#form_log').on('submit', function(e) {
        // 1.
        e.preventDefault();
        // 发起ajax请求
        $.ajax({
            url:'/api/login',
            method: 'POST',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('登录失败')
                }
                layer.msg('登录成功')
                // 将登录成功得到的 token字符串，保存到localStorage中
                localStorage.setItem('token', res.token)
                // 跳转到后台主页
                location.href = '/index.html'
            }
        })
    })
})