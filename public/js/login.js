import utility from './common/utility';
let app = new Vue({
    el: '#login',
    delimiters: ['${', '}'],
    data: {
        errorMessage: ''
    },
    created: function () {

    },
    methods: {
        login: function () {
            let username = document.getElementById('username').value, password = document.getElementById('password').value,
                rememberMe = document.getElementById('rememberMe').checked, self = this, data = {};
            if (utility.strHelper.trim(username) === '') {
                self.errorMessage = '用户名不能为空';
                document.getElementById('username').focus();
                return;
            }
            if (password === '') {
                self.errorMessage = '密码不能为空';
                document.getElementById('password').focus();
                return;
            }
            data = { username: username, password: password, rememberMe: rememberMe };
            utility.ajax('/login', 'post', data).then(function (result) {
                if (result) {
                    self.errorMessage = result;
                } else {
                    window.location.href = '/home';
                }
            }).fail(function (err) { console.log(err); });
        },
        register: function () {
            window.open('/register');
        }
    }
});