'user strict';

let ajax = (actionUrl, type, data) => {
    return new Promise(function (resolve, reject) {
        let ajaxSetting = {
            url: actionUrl,
            type: type,
            data: data,
            success: function (result) {
                resolve(result);
            },
            error: function (error) {
                console.log(error);
                reject(error);
            }
        };
        $.ajax(ajaxSetting);
    });
},
    strHelper = {},
    dateHelper = {};

// -----------------strHelper-----------------
strHelper.trim = (str) => {
    return str.replace(/(^\s*)|(\s*$)/g, '');
};

// ----------------dateHelper-----------------
function completionNumber(number) {
    return number < 10 ? '0' + number : number;
}

dateHelper.formatDate = (date) => {
    let year = date.getFullYear(), month = completionNumber(date.getMonth() + 1), day = completionNumber(date.getDate());
    return `${year}-${month}-${day}`;
};

dateHelper.formatMonth = (date) => {
    let year = date.getFullYear(), month = completionNumber(date.getMonth() + 1);
    return `${year}-${month}`;
};

module.exports = {
    ajax: ajax,
    strHelper: strHelper,
    dateHelper: dateHelper
};