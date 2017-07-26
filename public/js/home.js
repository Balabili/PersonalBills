requirejs.config({
    baseUrl: '/js/common'
});
require(['utility'], function (utility) {
    let app = new Vue({
        el: '#home',
        delimiters: ['${', '}'],
        data: {

        },
        methods: {
            logout: function () {
                window.location.href = '/logout';
            }
        }
    });
});