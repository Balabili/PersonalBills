Vue.component('bill-canlendar', {
    template: `<div>
                <b class="col-md-12 bill-canlendar-title">{{title}}</b>
                <div>
                    <span class="col-md-1 bill-canlendar-cell" @click="before"><</span>
                    <span class="col-md-1 bill-canlendar-cell" v-bind="{id:list}" :class="{'bill-canlendar-cell-selected':thisMonthOrDate==list}" v-for="list in lists">{{list}}</span>
                    <span class="col-md-1 bill-canlendar-cell" @click="next">></span>
                </div>
            </div>`,
    props: {
        isMonth: { type: Boolean, default: true },
        billDate: { type: String }
    },
    data: function () {
        return {
            lists: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            monthDayCounts: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
            currentDay: ''
        };
    },
    methods: {
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
    computed: {
        title: function () {
            return this.isMonth ? this.currentDay.substring(0, 4) : this.currentDay.substring(0, 7);
        },
        thisMonthOrDate: function () {
            if (this.isMonth) {
                return this.title === this.billDate.split('-')[0] ? this.billDate.split('-')[1] : 0;
            } else {
                return this.title === this.billDate.substring(0, 7) ? this.billDate.split('-')[2] : 0;
            }
        }
    }
});