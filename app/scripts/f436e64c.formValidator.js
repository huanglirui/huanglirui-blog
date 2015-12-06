$(function () {
    //获取表单inpuit元素
    var errHint = $('.errHint');
    var regForm = $('.regForm');
    var submit = $('.submit');
    var $reset = $('.reset');
    var $username = $('#username');
    var $email = $('#email');
    var $password = $('#password');
    var $repassword = $('#repassword');
    var $title = $('#title');
    var $content = $('#content');
    /**
     * 验证的工具方法
     *      返回值是true或者false。代表是否符合特定的要求
     * @type {{isNull: Function, isEmail: Function}}
     */
    var inputValidate = {
        isNull: function (val) {
            return val == '';
        },
        isEmail: function (val) {
            var regexp = /^([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/g;
            return regexp.test(val);
        }
    };
    /**
     *  验证表单的合法性
     *  每一个input对应一个验证规则
     *      验证对象的键是input的'#'+id
     *      验证对象的键的值是一个函数，函数返回true或者false，true代表验证通过，false代表验证失败，
     *      而函数接收的参数就是input的'#'+id
     *
     * */
    var formValidator = {
        '#username': function (input) {
            var ele = $(input);
            if (!ele.get(0)) {
                return true;
            }
            var val = ele.val();
            if (inputValidate.isNull(val)) {
                errHint.show().html('用户名不能为空');
                return false;
            }
            if (errHint.is(':visible')) {
                errHint.hide();
            }
            return true;
        },
        '#email': function (input) {
            var ele = $(input);
            if (!ele.get(0)) {
                return true;
            }
            var val = ele.val();

            if (inputValidate.isNull(val)) {
                errHint.show().html('邮箱不能为空');
                return false;
            }
            if (!inputValidate.isEmail(val)) {
                errHint.show().html('邮箱不合法');
                return false;
            }
            if (errHint.is(':visible')) {
                errHint.hide();
            }
            return true;
        },
        '#password': function (input) {
            var ele = $(input);
            if (!ele.get(0)) {
                return true;
            }
            var val = ele.val();
            if (inputValidate.isNull(val)) {
                errHint.show().html('密码不能为空');
                return false;
            }
            if (errHint.is(':visible')) {
                errHint.hide();
            }
            return true;
        },
        '#repassword': function (input) {
            var ele = $(input);
            if (!ele.get(0)) {
                return true;
            }
            var val = ele.val().trim();
            if (inputValidate.isNull(val)) {
                errHint.show().html('重复密码不能为空');
                return false;
            }
            console.log($password.val().trim() != val);
            if ($password.val().trim() != val) {
                errHint.show().html('重复密码不等于密码');
                return false;
            }
            if (errHint.is(':visible')) {
                errHint.hide();
            }
            return true;
        },
        '#title': function (input) {
            var ele = $(input);
            if (!ele.get(0)) {
                return true;
            }
            var val = ele.val();
            if (inputValidate.isNull(val)) {
                errHint.show().html('标题不能为空');
                return false;
            }
            if (errHint.is(':visible')) {
                errHint.hide();
            }
            return true;
        },
        '#content': function (input) {
            var ele = $(input);
            if (!ele.get(0)) {
                return true;
            }
            var val = ele.val();
            console.log('blur');
            console.log(val);
            if (inputValidate.isNull(val)) {
                errHint.show().html('文字内容不能为空');
                return false;
            }
            if (errHint.is(':visible')) {
                errHint.hide();
            }
            return true;
        }
    }
//  为input添加失去焦点的事件
    $username.blur(function () {
        formValidator['#username']('#username');
    });
    $email.blur(function () {
        formValidator['#email']('#email');
    });
    $password.blur(function () {
        formValidator['#password']('#password');
    });
    $repassword.blur(function () {
        formValidator['#repassword']('#repassword');
    });
    $title.blur(function () {
        formValidator['#title']('#title');
    });
    $content.blur(function () {
        formValidator['#content']('#content');
    });

//  提交表单按钮
    submit.click(function () {
        for (var attr in formValidator) {
            if (!formValidator[attr](attr)) {
                return;
            }
        }
        regForm.submit();
    });
//  重置按钮
    $reset.click(function () {
        errHint.hide();
    });

});