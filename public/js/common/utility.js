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
    };

    let cookieHelper = {};

    return {
        ajax: ajax,
        cookieHelper: cookieHelper
    };
});