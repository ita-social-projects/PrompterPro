describe("Operator sections services", function() {

    beforeEach(module("app"));

    describe("Section services test", function() {
        var service;
        var constants;

        beforeEach(inject(function($injector) {
            service = $injector.get("sectionServices");
            constants = $injector.get("constants");
        }));

        it("exist", function() {
            expect(service).not.toBe(undefined);
            expect(service).not.toBe(null);
        });

        it("can display section intro", function() {
            //arange
            var section = {
                Text: "Some long test text to test"
            };
            //+3 is because if text is longer then sectionsIntroLength it will concat with "..."
            //+1 is because jasmine supports only LessThen, and not LessOrEqualThen
            var readTextLength = constants.sectionsIntroLength + 3 + 1;

            //act
            var actual = service.displaySectionIntro(section);

            //assert
            expect(actual.length).toBeLessThan(readTextLength);
        });
    });
});