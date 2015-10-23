(function() {
    var getCurrentDateTime = function () {
        var currentdate = new Date();
        var dateTime = currentdate.getFullYear() + "-"
                    + (currentdate.getMonth() + 1) + "-"
                     + currentdate.getDate() + " "
                     + currentdate.getHours() + ":"
                     + currentdate.getMinutes() + ":"
                     + currentdate.getSeconds();
        return dateTime;
    }

    var logError = function (error) {
        $.ajax({
            type: 'POST',
            url: '/api/diagnostics',
            contentType: 'application/json; charset=UTF-8',
            data: angular.toJson({
                ExceptionName: error.name || error,
                Message: error.stack || "",
                Date: getCurrentDateTime()
            })
        });
    }

    window.onerror = function (error) {
        logError(error);
    }
})();