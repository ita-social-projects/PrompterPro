app.service("dateFormater", [
    function () {
        var self = this;

        self.formateDate = function (date) {
            //only for string date like:
            //2015-03-20T01:35:18.167 
            var year = date.substr(0, 4);
            var month = date.substr(5, 2);
            var day = date.substr(8, 2);
            var hour = date.substr(11, 2);
            var minute = date.substr(14, 2);
            var second = date.substr(17, 2);

            var formattedDate = day + "/" + month + "/" + year 
                + " - "
                + hour + ":" + minute + ":" + second;

            return formattedDate;
        };

        return self;
    }
]);