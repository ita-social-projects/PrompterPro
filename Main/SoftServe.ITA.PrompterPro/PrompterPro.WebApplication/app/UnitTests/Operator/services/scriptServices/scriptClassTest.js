describe("Operator services - script class service", function () {

    beforeEach(module("app"));

    describe("Script class operator service test", function () {
        var service,
            entityState,
            listGroupItem;

        beforeEach(inject(function ($injector) {
            service = $injector.get("scriptClass");
            entityState = $injector.get("entityState");
            listGroupItem = $injector.get("listGroupItem");
        }));

        it("exists", function () {
            expect(service).not.toBe(undefined);
            expect(service).not.toBe(null);
        });

        it("will return list 'info' if script is selected", function() {
            //arange
            var script = {
                EntityState: entityState.Modified
            };
            var scope = {
                selectedScript: script
            };

            //act
            var actual = service(scope)(script);

            //assert
            expect(actual).toBe(listGroupItem.info);
        });

        it("will return list 'warning' if scripts entity state is Modified", function () {
            //arange
            var script = {
                EntityState: entityState.Modified
            };
            var scope = {};

            //act
            var actual = service(scope)(script);

            //assert
            expect(actual).toBe(listGroupItem.warning);
        });

        it("will return list 'success' if scripts entity state is Added", function () {
            //arange
            var script = {
                EntityState: entityState.Added
            };
            var scope = {};

            //act
            var actual = service(scope)(script);

            //assert
            expect(actual).toBe(listGroupItem.success);
        });

        it("will return list 'empty' in all other cases", function () {
            //arange
            var script = {};
            var scope = {};

            //act
            var actual = service(scope)(script);

            //assert
            expect(actual).toBe(listGroupItem.empty);
        });
    });
});