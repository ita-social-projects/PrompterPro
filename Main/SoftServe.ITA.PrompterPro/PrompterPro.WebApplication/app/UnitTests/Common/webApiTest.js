describe("Common webApi", function() {
    beforeEach(module("app"));

    describe("webApi service tests", function() {
        var service;

        beforeEach(inject(function($injector) {
            service = $injector.get("webApi");
        }));

        it("should return pack of constants", function() {
            //assert
            expect(service.presentation).toBe("/api/presentation");
            expect(service.script).toBe("/api/script");
            expect(service.prompter).toBe("/api/prompter");
            expect(service.diagnostics).toBe("/api/diagnostics");
            expect(service.userActivity).toBe("/api/userActivity");
            expect(service.userActivityActivator).toBe("/api/userActivityActivator");
        });
    });
});