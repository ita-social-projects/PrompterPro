describe("userActivity repository", function () {
    beforeEach(module("app"));

    describe("User activity repository test", function () {
        var service;
        var $httpBackend, webApi;

        var mockHttpRequests = function ($injector) {
            $httpBackend = $injector.get("$httpBackend");
            webApi = $injector.get("webApi");

            $httpBackend.when("GET", webApi.userActivity + "?page=1")
                            .respond("test get respond");
            $httpBackend.when("POST", webApi.userActivity)
                            .respond("test post respond");
            $httpBackend.when("DELETE", webApi.userActivity)
                            .respond("test clean respond");

            $httpBackend.when("GET", webApi.userActivityActivator)
                            .respond("test activity status respond");
            $httpBackend.when("POST", webApi.userActivityActivator
                + "?isUserActivityActivated=true")
                            .respond("test activity status changed respond");
        }

        beforeEach(inject(function ($injector) {
            service = $injector.get("userActivityRepository");
            mockHttpRequests($injector);
        }));

        afterEach(function () {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        it("can get user activity pages", function() {
            //arange
            var actual;

            //act
            service.userActivity.get(1).then(
                function(logs) {
                    actual = logs;
                });

            $httpBackend.flush();

            //assert
            expect(actual).not.toBe(undefined);
            expect(actual).not.toBe(null);
            expect(actual).toBe("test get respond");
        });

        it("can post user activity pages", function() {
            //arange
            var actual;

            //act
            service.userActivity.post().then(
                function(logs) {
                    actual = logs;
                });

            $httpBackend.flush();

            //assert
            expect(actual).not.toBe(undefined);
            expect(actual).not.toBe(null);
            expect(actual).toBe("test post respond");
        });

        it("can clear user activity pages", function () {
            //arange
            var actual;

            //act
            service.userActivity.clearAllHistory().then(
                function (logs) {
                    actual = logs;
                });

            $httpBackend.flush();

            //assert
            expect(actual).not.toBe(undefined);
            expect(actual).not.toBe(null);
            expect(actual).toBe("test clean respond");
        });

        it("can get user activity status", function () {
            //arange
            var actual;

            //act
            service.userActivityActivator.get().then(
                function (logs) {
                    actual = logs;
                });

            $httpBackend.flush();

            //assert
            expect(actual).not.toBe(undefined);
            expect(actual).not.toBe(null);
            expect(actual).toBe("test activity status respond");
        });

        it("can change user activity status", function () {
            //arange
            var actual;

            //act
            service.userActivityActivator.post(true).then(
                function (logs) {
                    actual = logs;
                });

            $httpBackend.flush();

            //assert
            expect(actual).not.toBe(undefined);
            expect(actual).not.toBe(null);
            expect(actual).toBe("test activity status changed respond");
        });
    });
});