describe("Admin services", function() {

    beforeEach(module("app"));

    describe("Diagnostics service test", function() {
        var service,
            $httpBackend;
        
        var mockHttpRequests = function ($injector) {
            $httpBackend = $injector.get("$httpBackend");

            $httpBackend.when("GET", "/api/diagnostics")
                            .respond("test get respond");
            $httpBackend.when("GET", "/api/diagnostics?fromDate=1488")
                            .respond("test get with date respond");
        }

        beforeEach(inject(function ($injector) {
            service = $injector.get("diagnosticsService");
            mockHttpRequests($injector);
        }));

        it("exists", function() {
            expect(service).not.toBe(undefined);
            expect(service).not.toBe(null);
        });

        it("can send get http request", function() {
            //arange
            var actual;

            //act
            var result = service.getLastDiagnostics();

            result.then(function(result) {
                actual = result;
            });

            $httpBackend.flush();

            //assert
            expect(actual).toBe("test get respond");
        });

        it("can send get http request with some date", function () {
            //arange
            var actual;
            var date = 1488;

            //act
            var result = service.getFromDate(date);

            result.then(function (result) {
                actual = result;
            });

            $httpBackend.flush();

            //assert
            expect(actual).toBe("test get with date respond");
        });
    });
});