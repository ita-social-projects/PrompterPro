describe("Operator services - operator dialog service", function () {

    beforeEach(module("app"));

    describe("Operator dialog operator service test", function () {
        var service;

        beforeEach(inject(function ($injector) {
            service = $injector.get("operatorDialog");
        }));

        it("exists", function () {
            expect(service).not.toBe(undefined);
            expect(service).not.toBe(null);
        });

        it("can set showScriptModal var to true", function() {
            //arange
            var scope = {};

            //act
            service(scope).script();

            //assert
            expect(scope.showScriptModal).toBe(true);
        });

        it("can set showImport var to true", function () {
            //arange
            var scope = {};

            //act
            service(scope).import();

            //assert
            expect(scope.showImport).toBe(true);
        });
    });
});