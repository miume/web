<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <link rel="stylesheet" type="text/css"
          href="./css/signup.css">
</head>
<body style=" background-image: url(./dist/images/login/bg.jpg); ackground-attachment: inherit">
<div id="logo" style="">
    <div>
        <div id="logo-img" style="float: left">
            <img src="./dist/images/login/logo.png"/>
        </div>
        <div style="position: relative; top: 0px;">
            <span class="cn">长远锂科MES系统</span><br>
            <span class="eng">CHANGYUAN LICO CO., LTD.</span>
        </div>
    </div>
</div>
<div class="box">
    <div class="thehead">
        <span id="staff" class="touch">员工登陆</span>
        <span id="client" class="touch">客户登陆</span>
    </div>
    <div id="staff_login">
        <span id="error_box" class="tip1"></span>
        <div class="users">
            <input id="code" class="thestyle" type="text" value tabindex="0" placeholder="请输入工号"/>
            <img class="theicon" src="./dist/images/login/user.png"/>
        </div>
        <div class="pass">
            <input id="password" class="thestyle" type="password" value maxlength="12" placeholder="请输入密码"/>
            <img class="theicon" src="./dist/images/login/pass.png"/>
        </div>
        <div class="tip2">
            <span>忘记密码？</span>
        </div>
        <input id="register1" class="button" type="submit" value="登录"/>
    </div>
    <div id="client_login">
        <span id="error_box2" class="tip1"></span>
        <div class="users">
            <input id="code2" class="thestyle" type="text" value tabindex="0" placeholder="请输入用户名"/>
            <img class="theicon" src="./dist/images/login/user.png"/>
        </div>
        <div class="pass">
            <input id="password2" class="thestyle" type="password" value maxlength="12" placeholder="请输入密码"/>
            <img class="theicon" src="./dist/images/login/pass.png"/>
        </div>
        <div class="tip2">
            <span>忘记密码？</span>
        </div>
        <input id="register2" class="button" type="submit" value="登录"/>
    </div>
</div>
<script src="js/jquery.js"></script>
<script type="text/javascript" src="js/jquery.cookie.js"></script>
<script type="text/javascript" src="js/jquerysession.js"></script>
<script src="./js/servers.js"></script>

<script type="text/javascript">
    $(function () {
        /** 登录组件的一些逻辑 */
        $('#staff').addClass('selected');
        $('#client_login').hide();
        $('#staff_login').show();

        $('#staff').click(function () {
            $('#client').removeClass('selected');
            $('#staff').addClass('selected');
            $('#client_login').hide();
            $('#staff_login').show();
        });

        $('#client').click(function () {
            $('#staff').removeClass('selected');
            $('#client').addClass('selected');
            $('#staff_login').hide();
            $('#client_login').show();
        })

        $("#register1").on('click', function () {
            var username = $("#code").val()
            var password = $("#password").val()
            $.post(servers.backup() + "user/login", {code: username, password: password}, function (result) {
                var resCode = result.code
                if (resCode == 0) {
                    console.log(result)
                    $.session.set('user', JSON.stringify(result.data));
                    document.location = './jsp/home.jsp';
                }
            })
        })
    })
</script>
</body>
</html>