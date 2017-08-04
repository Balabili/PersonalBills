requirejs.config({
    baseUrl: '/js/common'
});
require(['utility'], function (utility) {
    let app = new Vue({
        el: '#home',
        delimiters: ['${', '}'],
        data: {
            tabIndex: 1,
            modalTitle: '支出',
            showNoItemMsg: true,
            monthBillItems: [],
            dayBillItems: [],
            billItems: [],
            currentDate: null,
            isInput: true,
            title: '2017年',
            months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        },
        mounted: function () {
            this.getItems();
        },
        methods: {
            getItems: function () {
                this.getMonthBills();
            },
            changeTab: function (index) {
                this.tabIndex = index;
                switch (index) {
                    case 1:
                        this.getMonthBills();
                        break;
                    case 2:
                        this.getMonthDetail(utility.dateHelper.formatMonth(new Date()));
                        break;
                    case 3:
                        this.getDayBillDetails(utility.dateHelper.formatDate(new Date()));
                        break;
                    default:
                        break;
                }
            },
            getMonthBills: function () {
                let self = this;
                utility.ajax('/home/getBillOverviews', 'post', {}).then(function (result) {
                    if (result.length) {
                        let monthBillItems = [];
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
                            monthBillItems.push(monthItem);
                        }
                        app.$set(self, 'monthBillItems', monthBillItems);
                    }
                });
            },
            getMonthDetail: function (month) {
                let self = this;
                self.tabIndex = 2;
                self.currentDate = month;
                $('#monthDetails').tab('show');
                utility.ajax('/home/getMonthBillDetails', 'post', { month: month }).then(function (result) {
                    if (result && result.length) {
                        for (let i = 0; i < result.length; i++) {
                            result[i].overviewAmount = result[i].inputAmount - result[i].outputAmount;
                        }
                        self.dayBillItems = result;
                        app.$set(self, 'dayBillItems', self.dayBillItems);
                    } else {
                        self.dayBillItems = [];
                    }
                }).fail(function (err) { console.log(err); });
            },
            getDayBillDetails: function (date) {
                let self = this;
                self.tabIndex = 3;
                self.currentDate = date;
                $('#dateDetails').tab('show');
                utility.ajax('/home/getBillDetails', 'post', { date: date }).then(function (result) {
                    if (result && result.length) {
                        for (let i = 0; i < result.length; i++) {
                            result[i].text = result[i].isInput ? '收入' : '支出';
                        }
                        self.billItems = result;
                    } else {
                        self.billItems = [];
                    }
                }).fail(function (err) { console.log(err); });
            },
            viewMonthBillDetails: function (e) {
                e.stopPropagation();
                let month = e.target.id;
                this.getMonthDetail(month);
            },
            viewDayBillDetails: function (e) {
                e.stopPropagation();
                let date = e.target.id;
                this.getDayBillDetails(date);
            },
            getCurrentMonthBills: function (thisMonth) {
                this.getMonthDetail(thisMonth);
            },
            getCurrentDayBills: function (thisDate) {
                this.getDayBillDetails(thisDate);
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
                utility.ajax('/home/addBill', 'post', { billItems: this.billItems }).then(function () {
                    alert('保存成功');
                }).fail(function (err) { console.log(err); });
            },
            editBillItem: function (e) {
                e.stopPropagation();
                let itemId = e.target.parentNode.id, billItems = this.billItems;
                for (let i = 0; i < billItems.length; i++) {
                    if (billItems[i]._id === itemId) {
                        this.modalTitle = billItems[i].isInput ? '收入' : '支出';
                        document.getElementById('billItem').value = billItems[i].item;
                        document.getElementById('acount').value = billItems[i].acount;
                        $('#myModal').modal('show');
                        break;
                    }
                }
            },
            deleteBillItem: function (e) {
                e.stopPropagation();
                if (confirm('你确定要删除当前记录？')) {
                    let itemId = e.target.parentNode.id, billItems = this.billItems;
                    for (let i = 0; i < billItems.length; i++) {
                        if (billItems[i]._id === itemId) {
                            this.billItems.splice(i, 1);
                            break;
                        }
                    }
                }
            },
            logout: function () {
                window.location.href = '/logout';
            }
        },
        watch: {
            monthBillItems: function () {
                this.showNoItemMsg = this.monthBillItems.length === 0;
            },
            dayBillItems: function () {
                this.showNoItemMsg = this.dayBillItems.length === 0;
            },
            billItems: function () {
                this.showNoItemMsg = this.billItems.length === 0;
            }
        }
    });
});