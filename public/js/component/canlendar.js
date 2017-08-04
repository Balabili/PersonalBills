Vue.component('bill-canlendar', {
    template: `<div class="row">
                <div v-if="showSelectedForm" class="row">
                    <div v-if="isMonth" class="form-group col-md-6 col-md-offset-3">
                        <input type="number" class="form-control" id="selectYear" @blur="selectYearDone" placeholder="年">
                    </div>
                    <div v-if="!isMonth" class="form-group col-md-6 col-md-offset-3">
                        <input type="month" class="form-control" id="selectMonth" @blur="selectMonthDone" placeholder="月">
                    </div>
                </div>
                <b v-else class="col-md-12 bill-canlendar-title" @click="showSelectedFormFun(true)">{{title}}</b>
                <div style="margin-top:5px;" class="row">
                    <span class="col-md-1 bill-canlendar-cell" @click="before"><</span>
                    <span class="col-md-1 bill-canlendar-cell" v-bind="{id:list}" @click="changeCanlendar" :class="{'bill-canlendar-cell-selected':thisMonthOrDate==list}" v-for="list in lists">{{list}}</span>
                    <span class="col-md-1 bill-canlendar-cell" @click="next">></span>
                </div>
            </div>`,
    props: {
        isMonth: { type: Boolean, default: true },
        billDate: { type: String }
    },
    data: function () {
        return {
            showSelectedForm: false,
            lists: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            monthDayCounts: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
            currentDay: '',
            hasChangeCanlendar: false,
            changeCanlendarDate: ''
        };
    },
    methods: {
        showSelectedFormFun: function (isShow) {
            let self = this, doc = document, timer = setInterval(function () {
                if (self.isMonth) {
                    let yearBox = doc.getElementById('selectYear');
                    if (yearBox) {
                        yearBox.focus();
                        yearBox.value = self.currentDay.split('-')[0];
                        clearInterval(timer);
                    }
                } else {
                    let monthBox = doc.getElementById('selectMonth');
                    if (monthBox) {
                        monthBox.value = self.currentDay.substring(0, 7);
                        monthBox.focus();
                        clearInterval(timer);
                    }
                }
            }, 100);
            self.showSelectedForm = isShow;
        },
        selectYearDone: function () {
            this.showSelectedForm = false;
            this.currentDay = document.getElementById('selectYear').value.toString();
        },
        selectMonthDone: function () {
            let self = this, monthBox = document.getElementById('selectMonth'), month = monthBox.value;
            if (month) {
                self.currentDay = month;
                if (month.split('-')[1] === '02') {
                    self.monthDayCounts[1] = self.isLeapMonth(month.split('-')[0]) ? 29 : 28;
                    self.$set(self, 'monthDayCounts', self.monthDayCounts);
                }
                self.showSelectedForm = false;
            } else {
                monthBox.focus();
            }
            self.lists = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        },
        before: function () {
            if (this.isMonth) {
                if (this.lists[0] === 1) {
                    this.currentDay = `${this.currentDay.split('-')[0] - 1}`;
                }
                this.lists = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
            } else if (this.lists[0] === 1) {
                this.reduceMonth(true);
                return;
            } else if (this.lists[0] < 5) {
                this.lists = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
            } else {
                let lists = this.lists, len = lists.length, list = [];
                for (let i = 0; i < len; i++) {
                    list[i] = lists[i] - 5;
                }
                this.lists = list;
            }
        },
        next: function () {
            if (this.isMonth) {
                if (this.lists[9] === 12) {
                    this.currentDay = `${parseInt(this.currentDay.split('-')[0], 10) + 1}`;
                    this.lists = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
                } else {
                    this.lists = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
                }
            } else {
                let lists = this.lists, len = lists.length, list = [],
                    momth = this.currentDay.split('-')[1] - 1, momthDayCount = this.monthDayCounts[momth];
                if (lists[9] + 5 >= momthDayCount) {
                    if (lists[9] === momthDayCount) {
                        this.reduceMonth(false);
                        return;
                    } else {
                        list = [momthDayCount - 9, momthDayCount - 8, momthDayCount - 7, momthDayCount - 6, momthDayCount - 5,
                        momthDayCount - 4, momthDayCount - 3, momthDayCount - 2, momthDayCount - 1, momthDayCount];
                    }
                } else {
                    for (let i = 0; i < len; i++) {
                        list[i] = lists[i] + 5;
                    }
                }
                this.lists = list;
            }
        },
        changeCanlendar: function (e) {
            let day = e.target.id < 10 ? `0${e.target.id}` : e.target.id,
                date = this.isMonth ? `${this.currentDay.substring(0, 4)}-${day}` : `${this.currentDay.substring(0, 7)}-${day}`;
            this.hasChangeCanlendar = true;
            this.changeCanlendarDate = date;
            this.$emit('datechanged', date);
        },
        isLeapMonth: function (year) {
            if (year % 100) { return year % 4 === 0; } else { return year % 400 === 0; }
        },
        reduceMonth: function (isReduce) {
            let arr = this.currentDay.split('-'), year = parseInt(arr[0], 10), month = parseInt(arr[1], 10), leapMonth = false;
            if (isReduce) {
                if (month === 1) {
                    year = year - 1;
                    month = 12;
                } else {
                    month = month - 1;
                    month = month < 10 ? `0${month}` : month;
                }
            } else if (month === 12) {
                year = year + 1;
                month = '01';
            } else {
                month = month + 1;
                month = month < 10 ? `0${month}` : month;
            }
            leapMonth = this.isLeapMonth(year);
            this.monthDayCounts[1] = leapMonth ? 29 : 28;
            this.$set(this, 'monthDayCounts', this.monthDayCounts);
            this.currentDay = `${year}-${month}`;
            this.lists = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        }
    },
    mounted: function () {
        this.currentDay = this.billDate;
    },
    watch: {
        billDate: function () {
            this.currentDay = this.billDate;
            if (this.isMonth) {
                let month = this.billDate.split('-')[1];
                this.lists = month > 10 ? [month - 9, month - 8, month - 7, month - 6, month - 5, month - 4, month - 3, month - 2, month - 1, month] : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
            } else {
                let date = this.billDate.split('-')[2];
                this.lists = date > 10 ? [date - 9, date - 8, date - 7, date - 6, date - 5, date - 4, date - 3, date - 2, date - 1, date] : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
            }
        }
    },
    computed: {
        title: function () {
            return this.isMonth ? this.currentDay.substring(0, 4) : this.currentDay.substring(0, 7);
        },
        thisMonthOrDate: function () {
            let date = this.billDate;
            if (this.hasChangeCanlendar) {
                date = this.changeCanlendarDate;
                this.hasChangeCanlendar = false;
            }
            if (this.isMonth) {
                return this.title === date.split('-')[0] ? date.split('-')[1] : 0;
            } else {
                return this.title === date.substring(0, 7) ? date.split('-')[2] : 0;
            }
        }
    }
});