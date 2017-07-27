requirejs.config({
    baseUrl: '/js/common'
});
require(['utility'], function (utility) {
    let app = new Vue({
        el: '#home',
        delimiters: ['${', '}'],
        data: {
            isAddBills: true,
            modalTitle: '支出',
            showNoItemMsg: true,
            billItems: [],
            isInput: true
        },
        methods: {
            logout: function () {
                window.location.href = '/logout';
            },
            addBill: function (isInput) {
                this.isInput = isInput;
                $('#myModal').modal('show');
            },
            saveItem: function () {
                let billItem = document.getElementById('billItem'), acount = document.getElementById('acount'),
                    data = {};
                if (!/^\d+(\.\d+)?$/.test(acount.value)) {
                    alert('数组格式错误');
                    acount.focus();
                    return;
                }
                data.isInput = this.isInput;
                data.text = data.isInput ? '收入' : '支出';
                data.item = billItem.value;
                data.acount = acount.value;
                this.billItems.push(data);
                app.$set(this, 'billItems', this.billItems);
                $('#myModal').modal('hide');
                billItem.value = ''; acount.value = '';
            },
            saveBill: function () {
                utility.ajax('/home/addBill', 'post', { billItems: this.billItems }).then(function (result) {
                    debugger;
                }).fail(function (err) { console.log(err); });
            }
        },
        watch: {
            billItems: function () {
                this.showNoItemMsg = this.billItems.length === 0;
            }
        }
    });
});