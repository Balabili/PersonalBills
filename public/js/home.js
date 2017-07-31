requirejs.config({
    baseUrl: '/js/common'
});
require(['utility'], function (utility) {
    let app = new Vue({
        el: '#home',
        delimiters: ['${', '}'],
        data: {
            isOverview: true,
            isMonthDetails: false,
            isAddBills: false,
            modalTitle: '支出',
            showNoItemMsg: true,
            monthBillItems: [],
            dayBillItems: [],
            billItems: [],
            isInput: true
        },
        created: function () {

        },
        mounted: function () {
            this.getItems();
        },
        methods: {
            getItems: function () {
                let self = this;
                utility.ajax('/home/getBillOverviews', 'post', {}).then(function (result) {
                    if (result.length) {
                        for (let i = 0; i < result.length; i++) {
                            let monthItem = {}, items = result[i].Daybills, inputAmount = 0, outputAmount = 0;
                            monthItem.billMonth = result[i].billMonth;
                            for (let j = 0; j < items.length; j++) {
                                inputAmount += items[j].inputAmount;
                                outputAmount += items[j].outputAmount;
                            }
                            monthItem.inputAmount = inputAmount;
                            monthItem.outputAmount = outputAmount;
                            monthItem.overviewAmount = inputAmount - outputAmount;
                            self.monthBillItems.push(monthItem);
                        }
                        app.$set(self, 'billItems', self.monthBillItems);
                    }
                });
            },
            viewMonthBillDetails: function (e) {
                e.stopPropagation();
                let self = this, month = e.target.id;
                self.isMonthDetails = true;
                self.isOverview = false;
                self.isAddBills = false;
                utility.ajax('/home/getMonthBillDetails', 'post', { month: month }).then(function (result) {
                    if (result && result.length) {
                        for (let i = 0; i < result.length; i++) {
                            result[i].overviewAmount = result[i].inputAmount - result[i].outputAmount;
                        }
                        self.dayBillItems = result;
                        app.$set(self, 'billItems', self.dayBillItems);
                    }
                }).fail(function (err) { console.log(err); });
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