describe("Operator services - prompter repository service", function () {

    beforeEach(module("app"));

    describe("Prompter repository operator service test", function () {
        var service,
            webApi,
            $httpBackend;

        var mockHttpRequests = function ($injector) {
            $httpBackend = $injector.get("$httpBackend");
            webApi = $injector.get("webApi");

            $httpBackend.when("GET", webApi.prompter)
                .respond("test get respond");
        }

        beforeEach(inject(function ($injector) {
            service = $injector.get("prompterRepository");
            webApi = $injector.get("webApi");

            mockHttpRequests($injector);
        }));

        it("exists", function () {
            expect(service).not.toBe(undefined);
            expect(service).not.toBe(null);
        });

        it("can send get http request", function() {
            //arange
            var actual;

            //act
            service.get()
                .then(function() {
                    actual = true;
                });

            $httpBackend.flush();

            //assert
            expect(actual).toBe(true);
        });
    });
});