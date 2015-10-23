describe("Admin controller - datepicker controller", function() {

    beforeEach(module("app"));

    describe("Admin datepicker controller test", function() {
        var controller,
            $scope = {
                $watch: function() {}
            };

        beforeEach(inject(function($injector, $controller) {
            controller = $controller("datepickerController",
            { $scope: $scope });
        }));

        it("controller exists", function() {
            expect(controller).not.toBe(undefined);
            expect(controller).not.toBe(null);
        });

        it("scope exists", function() {
            expect($scope).not.toBe(undefined);
            expect($scope).not.toBe(null);
        });

        it("can set last period", function() {
            //arange
            var date = new Date().setDate(
                new Date().getDate() - 7
                );

            //act
            $scope.lastPeriod();

            //assert
            expect($scope.dt).toBe(date);
        });

        it("can clear last period", function () {
            //arange
            //act
            $scope.clear();

            //assert
            expect($scope.dt).toBe(null);
        });

        it("can get current day", function () {
            //arange
            var date = new Date();

            //act
            //assert
            expect($scope.today).toEqual(date);
        });

        it("can open", function() {
            //arange
            var event = {
                preventDefault: function() {},
                stopPropagation: function() {}
            };

            spyOn(event, "preventDefault");
            spyOn(event, "stopPropagation");

            //act
            $scope.open(event);

            //assert
            expect($scope.opened).toBe(true);
            expect(event.preventDefault).toHaveBeenCalled();
            expect(event.stopPropagation).toHaveBeenCalled();
        });
    });
});