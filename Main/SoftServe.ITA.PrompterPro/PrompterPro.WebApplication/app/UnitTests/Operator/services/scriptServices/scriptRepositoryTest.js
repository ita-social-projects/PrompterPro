describe("Operator services - script repository service", function () {

    beforeEach(module("app"));

    describe("Script repository operator service test", function () {
        var service,
            webApi,
            $httpBackend;

        var mockHttpRequests = function($injector) {
            $httpBackend = $injector.get("$httpBackend");
            webApi = $injector.get("webApi");

            $httpBackend.when("GET", webApi.script)
                .respond("test get respond");
            $httpBackend.when("POST", webApi.script)
                .respond("test post respond");
        }

        beforeEach(inject(function ($injector) {
            service = $injector.get("scriptRepository");
            webApi = $injector.get("webApi");

            mockHttpRequests($injector);
        }));

        it("exists", function () {
            expect(service).not.toBe(undefined);
            expect(service).not.toBe(null);
        });

        it("can send get http requst to script controller", function() {
            //arange
            var actual;

            //act
            service.get()
                .then(function(response) {
                    actual = response;
                });

            $httpBackend.flush();

            //assert
            expect(actual).toBe("test get respond");
        });

        it("can send post http requst to script controller", function () {
            //arange
            var actual;
            var scripts = {};

            //act
            service.post(scripts)
                .then(function (response) {
                    actual = response;
                });

            $httpBackend.flush();

            //assert
            expect(actual).toBe("test post respond");
        });
    });
});