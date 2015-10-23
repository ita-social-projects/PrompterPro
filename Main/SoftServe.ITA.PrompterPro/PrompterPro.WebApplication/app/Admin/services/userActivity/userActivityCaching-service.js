app.service("userActivityCachingService",[

    function() {
        var self = this;

        var cachedLogs = new Array();

        self.clearCache = function() {
            cachedLogs = new Array();
        }

        self.addPageToCache = function (logPage) {
            cachedLogs.push(logPage);
        }

        self.isPageCached = function (pageNumber) {
            var cachedPageNumber = pageNumber - 1;

            return cachedLogs.length > cachedPageNumber;
        }

        self.getPageFromCache = function (pageNumber) {
            var cachedPageNumber = pageNumber - 1;

            return cachedLogs[cachedPageNumber];
        }

        self.refreshCachePage = function (currentPageLogs, pageNumber) {
            var cachedPageNumber = pageNumber - 1;

            cachedLogs[cachedPageNumber] = currentPageLogs;
        }
        
        return self;
    }
]);