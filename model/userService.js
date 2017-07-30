function changeMonthBills(res, data, isChange, billIndex) {
    let monthBills = res.monthBills, existMonth = false,
        inputDifference = 0,
        outputDifference = 0;
    if (isChange) {
        inputDifference = data.inputAmount - res.bills[billIndex].inputAmount;
        outputDifference = data.outputAmount - res.bills[billIndex].outputAmount;
    } else {
        inputDifference = data.inputAmount; outputDifference = data.outputAmount;
    }
    for (let j = 0; j < monthBills.length; j++) {
        if (monthBills[j] === data.billDate.substring(0, 7)) {
            existMonth = true;
            res.monthBills[j].inputAmount = res.monthBills[j].inputAmount + inputDifference;
            res.monthBills[j].outputAmount = res.monthBills[j].outputAmount + outputDifference;
            break;
        }
    }
    if (!existMonth) {
        res.monthBills.push({ inputAmount: data.inputAmount, outputAmount: data.outputAmount, billMonth: data.billDate.substring(0, 7) });
    }
}

module.exports = {
    changeMonthBills: changeMonthBills
};