describe("Operator services - script order service", function () {

    beforeEach(module("app"));

    describe("Script order operator service test", function () {
        var service;

        beforeEach(inject(function ($injector) {
            service = $injector.get("scriptOrder");
        }));

        it("exists", function () {
            expect(service).not.toBe(undefined);
            expect(service).not.toBe(null);
        });

        it("can return script title", function() {
            //arange
            var script = {
                Title: "Test"
            };

            //act
            var actual = service(script);

            //assert
            expect(actual).toBe("Test");
        });
    });
});