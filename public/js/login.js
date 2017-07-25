requirejs.config({
    baseUrl: '/js/common'
});
require(['utility'], function (utility) {
    let app = new Vue({
        el: '#login',
        delimiters: ['${', '}'],
        data: {

        },
        methods: {
            login: function () {
                let username = document.getElementById('username').value, password = document.getElementById('password').value,
                    rememberMe = document.getElementById('rememberMe').checked,
                    data = { username: username, password: password, rememberMe: rememberMe };
                utility.ajax('/login', 'post', data).then(function (result) {
                    if (!result[0]) {
                        alert(result[1]);
                    }
                }).fail(function (err) { console.log(err); });
            }
        }
    });
});