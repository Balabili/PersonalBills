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
        mounted: function () {
            this.getItems();
        },
        methods: {
            getItems: function () {
                let self = this, date = document.getElementById('currentDate').value;
                utility.ajax('/getBillDetails', 'post', { date: date }).then(function (result) {
                    if (result) {
                        self.billItems = result;
                        app.$set(self, 'billItems', self.billItems);
                    }
                });
            },
            logout: function () {
                window.location.href = '/logout';
            },
            addBill: function (isInput) {
                this.isInput = isInput;
                this.modalTitle = isInput ? '收入' : '支出';
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
                utility.ajax('/home/addBill', 'post', { currentDate: '2017-7-28', billItems: this.billItems }).then(function (result) {
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