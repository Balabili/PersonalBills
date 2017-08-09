import utility from './common/utility';
let app = new Vue({
    el: '#login',
    delimiters: ['${', '}'],
    data: {
        errorMessage: ''
    },
    methods: {
        login: async () => {
            let username = document.getElementById('username').value, password = document.getElementById('password').value,
                rememberMe = document.getElementById('rememberMe').checked, self = this, data = {}, loginCallBack = null;
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
            loginCallBack = await utility.ajax('/login', 'post', data);
            if (loginCallBack) {
                self.errorMessage = loginCallBack;
            } else {
                window.location.href = '/home';
            }
        },
        register() {
            window.open('/register');
        }
    }
});