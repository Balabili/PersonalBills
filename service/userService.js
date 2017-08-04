const moment = require('moment');

function changeUserBills(res, data) {
    let monthBillItems = res.monthBills, existMonthBill = false, existDayBills = false;
    for (let i = 0; i < monthBillItems.length; i++) {
        if (monthBillItems[i].billMonth === data.billDate.substring(0, 7)) {
            let bills = monthBillItems[i].Daybills;
            existMonthBill = true;
            for (let j = 0; j < bills.length; j++) {
                if (bills[j].billDate === data.billDate) {
                    existDayBills = true;
                    res.monthBills[i].Daybills[j].inputAmount = data.inputAmount;
                    res.monthBills[i].Daybills[j].outputAmount = data.outputAmount;
                    res.monthBills[i].Daybills[j].billDetails = data.billDetails;
                    break;
                }
            }
            if (!existDayBills) {
                res.monthBills[i].Daybills.push(data);
            }
            break;
        }
    }
    if (!existMonthBill) {
        res.monthBills.push({ billMonth: data.billDate.substring(0, 7), Daybills: [data] });
    }
}

function addBills(items, data, user) {
    let input = 0, output = 0, details = [];
    for (let i = 0; i < items.length; i++) {
        if (items[i].isInput === 'true') {
            input += Number.parseFloat(items[i].acount);
        } else {
            output += Number.parseFloat(items[i].acount);
        }
        details.push({ item: items[i].item, acount: items[i].acount, isInput: items[i].isInput });
    }
    data.name = user;
    data.inputAmount = input;
    data.outputAmount = output;
    data.billDate = moment().format('YYYY-MM-DD');
    data.billDetails = details;
}

function getDayBills(user, month) {
    let monthBills = user.monthBills;
    for (let i = 0; i < monthBills.length; i++) {
        if (monthBills[i].billMonth === month) {
            return monthBills[i].Daybills;
        }
    }
    return null;
}

function getBillDetails(user, date) {
    let monthBills = user.monthBills;
    for (let i = 0; i < monthBills.length; i++) {
        if (monthBills[i].billMonth === date.substring(0, 7)) {
            let daybills = monthBills[i].Daybills;
            for (let j = 0; j < daybills.length; j++) {
                if (daybills[j].billDate === date) {
                    return daybills[j].billDetails;
                }
            }
            break;
        }
    }
    return null;
}

module.exports = {
    changeUserBills: changeUserBills,
    addBills: addBills,
    getDayBills: getDayBills,
    getBillDetails: getBillDetails
};