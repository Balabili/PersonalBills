'user strict';

define(function () {
    let ajax = function (actionUrl, type, data) {
        let dtd = $.Deferred();
        $.ajax({
            url: actionUrl,
            type: type,
            data: data,
            success: function (result) {
                dtd.resolve(result);
            },
            error: function (error) {
                dtd.reject(error);
            }
        });
        return dtd.promise();
    },
        strHelper = {},
        dateHelper = {};

    strHelper.trim = function (str) {
        return str.replace(/(^\s*)|(\s*$)/g, '');
    };

    function completionNumber(number) {
        return number < 10 ? '0' + number : number;
    }

    dateHelper.formatDate = function (date) {
        let year = date.getFullYear(), month = completionNumber(date.getMonth() + 1), day = date.getDate();
        return `${year}-${month}-${day}`;
    };

    return {
        ajax: ajax,
        strHelper: strHelper,
        dateHelper: dateHelper
    };
});