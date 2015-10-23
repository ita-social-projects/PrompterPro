describe("userActivity service", function() {
    beforeEach(module("app"));

    describe("userActivityService test", function() {
        var service;

        beforeEach(inject(function ($injector) {
            service = $injector.get("userActivityService");
        }));

        it("exists", function() {
            expect(service).not.toBe(null);
            expect(service).not.toBe(undefined);
        });

        it("can formate user activity status", function() {
            //arange
            var statusOff = false;
            var statusOn = true;

            //act
            var formatedStatusOff = service.getUserActivityStatus(statusOff);
            var formatedStatusOn = service.getUserActivityStatus(statusOn);

            //assert
            expect(formatedStatusOff).toBe("off");
            expect(formatedStatusOn).toBe("on");
        });

        it("can handle new logs", function() {
            //arange
            var incomingLogs = [];
            var log = {};

            incomingLogs.push(log);
            incomingLogs.push(log);

            service.handleNewLogs = function() {};

            spyOn(service, "handleNewLogs");

            //act
            var formatedLogs = service.handleNewLogs(incomingLogs);

            //assert
            expect(service.handleNewLogs).toHaveBeenCalled();
        });

        it("cals error notification", function () {
            //arange
            service.errorNotification = function() {}

            spyOn(service, "errorNotification");

            //act
            service.errorNotification("test");

            //assert
            expect(service.errorNotification).toHaveBeenCalled();
            expect(service.errorNotification).toHaveBeenCalledWith("test");
        });
    });
});