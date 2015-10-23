describe("Operator services - prompter class service", function () {

    beforeEach(module("app"));

    describe("Prompter class operator service test", function () {
        var service,
            prompterStatus,
            listGroupItem;


        beforeEach(inject(function ($injector) {
            service = $injector.get("prompterClass");
            prompterStatus = $injector.get("prompterStatus");
            listGroupItem = $injector.get("listGroupItem");
        }));

        it("exists", function () {
            expect(service).not.toBe(undefined);
            expect(service).not.toBe(null);
        });

        it("will return 'success' if prompter status is 'On'", function() {
            //arange
            var prompter = {
                PrompterStatus: prompterStatus.On
            }

            //act
            var actual = service(prompter);

            //assert
            expect(actual).toBe(listGroupItem.success);
        });

        it("will return 'warning' if prompter status is 'Busy'", function () {
            //arange
            var prompter = {
                PrompterStatus: prompterStatus.Busy
            }

            //act
            var actual = service(prompter);

            //assert
            expect(actual).toBe(listGroupItem.warning);
        });

        it("will return 'none' in all other cases", function () {
            //arange
            var prompter = {}

            //act
            var actual = service(prompter);

            //assert
            expect(actual).toBe(listGroupItem.none);
        });
    });
});