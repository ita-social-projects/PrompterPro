describe("Operator services - script service service", function () {
    var isFileUploadCalled = false;

    var mockDependencies = function() {
        module(function($provide) {
            $provide.service("fileUpload", function () {
                isFileUploadCalled = true;

                return function() {};
            });
            $provide.service("notify", function () {
                return function () { };
            });
        });
    };

    beforeEach(function() {
        module("app");
        mockDependencies();
    });

    afterEach(function() {
        isFileUploadCalled = false;
    })

    describe("Script service operator service test", function () {
        var service,
            constants,
            entityState,
            prompterStatus,
            $httpBackend,
            webApi;

        var mockHttpRequests = function ($injector) {
            $httpBackend = $injector.get("$httpBackend");
            webApi = $injector.get("webApi");

            $httpBackend.when("POST", webApi.scripts)
                            .respond("test post respond");
        }

        beforeEach(inject(function ($injector) {
            service = $injector.get("scriptService");
            constants = $injector.get("constants");
            entityState = $injector.get("entityState");
            prompterStatus = $injector.get("prompterStatus");

            mockHttpRequests($injector);
        }));

        it("exists", function () {
            expect(service).not.toBe(undefined);
            expect(service).not.toBe(null);
        });

        it("can add", function() {
            //arange
            var scope = {
                scripts: [],
                newScriptName: "Test",
                newScriptDescription: "Test description"
            };
            var form = {
                $valid: true
            };

            //act
            service(scope).add(form);

            //assert
            expect(scope.scripts.length).toBe(1);
            expect(scope.newScriptName).toBe(constants.scriptDefaultName);
            expect(scope.newScriptDescription).toBe(constants.emptyString);
            expect(scope.showScriptModal).toBe(false);
        });

        describe("can remove", function() {
            it("will null if script is selected script", function () {
                //arange
                var script = "test";
                var scope = {
                    selectedScript: script
                };

                //act
                service(scope).remove(script);

                //assert
                expect(scope.selectedScript).toBe(null);
            });

            it("will splice if scripts entity state is added", function () {
                //arange
                var script = {
                    EntityState: entityState.Added
                };
                var scope = {
                    scripts: []
                };

                scope.scripts.push(script);

                //act
                service(scope).remove(script);

                //assert
                expect(scope.scripts.length).toBe(0);
            });

            it("will mark script and all sections as deleted if script is not added", function () {
                //arange
                var section = {
                    EntityState: entityState.Added
                };
                var script = {
                    EntityState: entityState.Modified,
                    Sections: [],
                    Options: {}
                };
                var scope = {};

                script.Sections.push(section);
                
                //act
                service(scope).remove(script);

                //assert
                expect(script.EntityState).toBe(entityState.Deleted);
                expect(script.Sections[0].EntityState).toBe(entityState.Deleted);
                expect(script.Options.EntityState).toBe(entityState.Deleted);
            });
        });

        it("can select script", function() {
            //arange
            var scope = {};
            var script = "test";

            //act
            service(scope).select(script);

            //assert
            expect(scope.selectedScript).toBe("test");
        });

        it("can save script", function () {
            //arange
            var scope = {
                scripts: []
            };
            var script = {
                EntityState: entityState.Modified,
                Sections: []
            };
            var section = {};

            scope.scripts.push(script);
            scope.scripts[0].Sections.push(section);

            //act
            service(scope).save(script);

            $httpBackend.flush();

            //assert
            expect(scope.scripts).toBe("test post respond");
            expect(scope.selectedScript).toBe(null);
        });

        describe("import method", function() {
            it("can import pptx files", function () {
                //arange
                var scope = {
                    scriptFile: "test.pptx"
                };

                //act
                service(scope).import();

                //assert
                expect(isFileUploadCalled).toBe(true);
            });

            it("can import txt files", function () {
                //arange
                var scope = {
                    scriptFile: "test.txt"
                };

                //act
                service(scope).import();

                //assert
                expect(isFileUploadCalled).toBe(true);
            });
        });

        it("can init script", function() {
            //arange
            var scope = {
                scripts: []
            };
            var script = {
                Title: "Test"
            };
            var secondScript = {
                Title: "Z"
            };

            scope.scripts.push(secondScript);
            scope.scripts.push(script);

            //act
            service(scope).initScript(script);

            //assert
            expect(scope.index).toBe(0);
        });

        describe("check method", function() {
            it("will splice checked prompters from check list", function () {
                //arange
                var prompter = {
                    checked: true
                };
                var scope = {
                    checked: []
                };

                scope.checked.push(prompter);

                //act
                service(scope).check(prompter);

                //assert
                expect(prompter.checked).toBe(false);
                expect(scope.checked.length).toBe(0);
            });

            it("will add prompter to checked array if he is on", function() {
                //arange
                var prompter = {
                    checked: false,
                    PrompterStatus: prompterStatus.On
                };
                var scope = {
                    checked: []
                };

                //act
                service(scope).check(prompter);

                //assert
                expect(prompter.checked).toBe(true);
                expect(scope.checked.length).toBe(1);
            });
        });

        it("can check!?", function() {
            //arange
            var scope = {};
            var prompter = {
                PrompterStatus: prompterStatus.On
            }

            //act
            var actual = service(scope).canCheck(prompter);

            //assert
            expect(actual).toBe(true);
        });
    });
});