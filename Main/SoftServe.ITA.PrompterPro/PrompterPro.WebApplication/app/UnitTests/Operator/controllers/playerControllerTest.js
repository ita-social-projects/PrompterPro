describe("Operator controller - player controller", function () {
    var isModalCalled = false;
    var isBroadcastHubCalled = false;

    var mockDependencies = function () {
        module(function ($provide) {
            $provide.service("broadcastHub", function () {
                isBroadcastHubCalled = true;

                var that = this;

                that.server = {
                    mirrorText: function () { },
                    play: function () { },
                    handPlayBack: function () { },
                    handPlay: function () { },
                    pause: function () { },
                    stop: function () { },
                    speedUp: function () { },
                    speedDown: function () { },
                    padRight: function () { },
                    padLeft: function () { },
                    changeTextSize: function () { }
                };


                return that;
            });

            $provide.service("$modal", function () {
                this.open = function() {
                    isModalCalled = true;

                    return {
                        result: {
                            then: function() {}
                        }
                    };
                };
            });
        });
    };

    beforeEach(function () {
        module("app");
        mockDependencies();
    });

    afterEach(function() {
        isModalCalled = false;
        isBroadcastHubCalled = false;
    });

    describe("Player controller test", function () {
        var controller,
            $scope = {
                $parent: {
                    selectedScript: {
                        Sections: []
                    }
                }
            };

        beforeEach(inject(function ($injector, $controller) {
            controller = $controller("playerController",
            { $scope: $scope });
        }));

        it("controller exists", function () {
            expect(controller).not.toBe(undefined);
            expect(controller).not.toBe(null);
        });

        it("scope exists", function () {
            expect($scope).not.toBe(undefined);
            expect($scope).not.toBe(null);
        });

        it("can open", function() {
            //arange
            //act
            $scope.open();

            //assert
            expect(isModalCalled).toBe(true);
        });

        it("can display text", function() {
            //arange
            var section = {
                Order: 1,
                Text: "test"
            };

            $scope.$parent.selectedScript.Sections.push(section);

            //act
            var actual = $scope.displayText();

            //assert
            expect(actual).toBe("\n[Section:1]\ntest\n");
        });

        it("can call mirror text on server side", function () {
            //arange
            //act
            $scope.mirrorText();

            //assert
            expect(isBroadcastHubCalled).toBe(true);
        });

        it("can close player", function() {
            //arange
            var broadcastOperatorCalled = false;
            var scopeStopped = false;

            $scope.broadcastOperator = {
                successEndBroadcast: function() {
                    broadcastOperatorCalled = true;
                }
            }
            $scope.stop = function() {
                scopeStopped = true;
            }

            //act
            $scope.closePlayer();

            //assert
            expect($scope.isMirroredX).toBe(undefined);
            expect($scope.isMirroredY).toBe(undefined);
            expect($scope.speed).toBe(1);
            expect($scope.leftPadding).toBe(0);
            expect($scope.rightPadding).toBe(0);
            expect($scope.textSize).toBe(90);

            expect(broadcastOperatorCalled).toBe(true);
            expect(scopeStopped).toBe(true);
        });

        it("can dont save changes", function () {
            //arange
            var broadcastOperatorCalled = false;

            $scope.broadcastOperator = {
                successEndBroadcast: function () {
                    broadcastOperatorCalled = true;
                }
            }

            //act
            $scope.dontSaveChanges();

            //assert
            expect($scope.showDialog).toBe(false);
            expect($scope.textIsChanged).toBe(false);

            expect(broadcastOperatorCalled).toBe(true);
        });

        it("can save changes", function () {
            //arange
            var broadcastOperatorCalled = false;

            $scope.broadcastOperator = {
                successEndBroadcast: function () {
                    broadcastOperatorCalled = true;
                }
            }

            //act
            $scope.saveChanges();

            //assert
            expect($scope.showDialog).toBe(false);
            expect($scope.textIsChanged).toBe(false);

            expect(broadcastOperatorCalled).toBe(true);
        });

        it("can pause", function () {
            //arange
            //act
            $scope.pause();

            //assert
            expect(isBroadcastHubCalled).toBe(true);
            expect($scope.isHandPlayDisabled).toBe(false);
            expect($scope.isPlayDisabled).toBe(false);
        });
        
        it("can speed up", function () {
            //arange
            $scope.speed = 0;

            //act
            $scope.speedUp();

            //assert
            expect(isBroadcastHubCalled).toBe(true);
            expect($scope.speed).toBe(1);
        });

        it("can speed down", function () {
            //arange
            $scope.speed = 5;

            //act
            $scope.speedDown();

            //assert
            expect(isBroadcastHubCalled).toBe(true);
            expect($scope.speed).toBe(4);
        });

        it("has getNextSection function, but it does nothing", function () {
            //arange
            //act
            $scope.getNextSection();

            //assert
        });

        it("has getPrevSection function, but it does nothing", function () {
            //arange
            //act
            $scope.getNextSection();

            //assert
        });

        it("can pad rigth", function () {
            //arange
            //act
            $scope.padRight();

            //assert
            expect(isBroadcastHubCalled).toBe(true);
        });

        it("can pad left", function () {
            //arange
            //act
            $scope.padLeft();

            //assert
            expect(isBroadcastHubCalled).toBe(true);
        });

        it("can change text size", function () {
            //arange
            //act
            $scope.changeTextSize();

            //assert
            expect(isBroadcastHubCalled).toBe(true);
        });
    });
});