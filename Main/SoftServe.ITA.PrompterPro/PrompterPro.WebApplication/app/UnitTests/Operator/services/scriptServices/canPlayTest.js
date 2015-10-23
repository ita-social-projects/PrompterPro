describe("Operator services - can play service", function () {

    beforeEach(module("app"));

    describe("Can play operator service test", function () {
        var service,
            prompterStatus;

        beforeEach(inject(function ($injector) {
            service = $injector.get("canPlay");
            prompterStatus = $injector.get("prompterStatus");
        }));

        it("exists", function () {
            expect(service).not.toBe(undefined);
            expect(service).not.toBe(null);
        });

        it("can tell if we can play script", function() {
            //arange
            var scope = {
                selectedScript: "test"
            };
            var prompter = {
                PrompterStatus: prompterStatus.On
            };

            //act
            var actual = service(scope)(prompter);

            //assert
            expect(actual).toBe(true);
        });
    });
});