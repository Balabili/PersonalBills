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

module.exports = {
    changeUserBills: changeUserBills
};