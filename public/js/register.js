
import utility from './common/utility';
let app = new Vue({
    el: '#register',
    delimiters: ['${', '}'],
    data: {
        validationFailedMsg: '',
        registerSuccess: ''
    },
    methods: {
        register: async () => {
            let username = document.getElementById('username').value, password = utility.strHelper.trim(document.getElementById('password').value),
                passwordAgain = document.getElementById('passwordAgain'), email = utility.strHelper.trim(document.getElementById('email').value),
                data = {}, self = this, registerCallBack = null;
            self.validationFailedMsg = '';
            if (!(/^[a-zA-Z0-9\u4e00-\u9fa5]+$/.test(username)) || username.length < 6 || username.length > 12) {
                self.validationFailedMsg = '用户名不合法';
                document.getElementById('username').focus();
                return;
            }
            if (password === '' || password.length < 6 || password.length > 12) {
                self.validationFailedMsg = '密码不合法';
                password.focus();
                return;
            } else if (password !== passwordAgain.value) {
                self.validationFailedMsg = '两次输入的密码不一致';
                passwordAgain.focus();
                return;
            }
            if (email === null || !(/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/.test(email))) {
                self.validationFailedMsg = '邮箱格式不正确';
                document.getElementById('email').focus();
                return;
            }
            data = { username: username, password: password, email: email };
            registerCallBack = await utility.ajax('/register', 'post', data);
            if (registerCallBack) {
                self.validationFailedMsg = '';
                self.registerSuccess = '注册成功';
            } else {
                self.validationFailedMsg = '用户名已经存在';
                document.getElementById('username').focus();
            }
        }
    }
});