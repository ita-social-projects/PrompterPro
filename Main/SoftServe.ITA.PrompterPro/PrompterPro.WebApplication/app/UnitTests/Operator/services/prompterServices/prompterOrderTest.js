describe("Operator services - prompter order service", function () {

    beforeEach(module("app"));

    describe("Prompter order operator service test", function () {
        var service,
            prompterStatus;

        beforeEach(inject(function ($injector) {
            service = $injector.get("prompterOrder");
            prompterStatus = $injector.get("prompterStatus");
        }));

        it("exists", function () {
            expect(service).not.toBe(undefined);
            expect(service).not.toBe(null);
        });

        it("will return prompters status order", function() {
            //arange
            var prompter = {
                PrompterStatus: prompterStatus.On
            };

            //act
            var actual = service(prompter);

            //assert
            expect(actual).toBe(1);
        });
    });
});