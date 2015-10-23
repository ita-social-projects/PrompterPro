describe("Common date formater", function () {
    beforeEach(module("app"));

    describe("dateFormater service", function() {
        var service;

        beforeEach(inject(function ($injector) {
            service = $injector.get("dateFormater");
        }));

        it("exists", function() {
            expect(service).not.toBe(null);
            expect(service).not.toBe(undefined);
        });

        it("can formate date", function() {
            //arange
            var nonFormatedDate = "2015-03-20T01:35:18.167";
            var formatedDate = "20/03/2015 - 01:35:18";

            //act
            var actual = service.formateDate(nonFormatedDate);

            //assert
            expect(actual).toEqual(formatedDate);
        });
    });
});