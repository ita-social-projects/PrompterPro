describe("Operator services - prompter checked service", function () {

    beforeEach(module("app"));

    describe("Prompter checked operator service test", function () {
        var service;

        beforeEach(inject(function ($injector) {
            service = $injector.get("prompterChecked");
        }));

        it("exists", function () {
            expect(service).not.toBe(undefined);
            expect(service).not.toBe(null);
        });

        it("can set prompter checked to true", function() {
            //arange
            var prompter = {};

            //act
            service(prompter);

            //assert
            expect(prompter.checked).toBe(undefined);
        });
    });
});