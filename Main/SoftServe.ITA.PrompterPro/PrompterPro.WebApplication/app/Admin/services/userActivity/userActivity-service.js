app.service("userActivityService", [
    "dateFormater",
    "notify",
    "notifyType",
    "icons",
    function (
        dateFormater,
        notify,
        notifyType,
        icons) {

        var self = this;

        self.dateFormatter = dateFormater.formateDate;

        self.getUserActivityStatus = function(activityStatus) {
            if (activityStatus) {
                return "on";
            }
            return "off";
        }

        self.errorNotification = function (message) {
            notify(
                notifyType.danger,
                message,
                icons.warning);
        }

        self.handleNewLogs = function(newLogs) {
            _.each(newLogs, function (log) {
                log.Date = dateFormater.formateDate(log.Date);
            });
            return newLogs;
        }

        return self;
    }
]);