describe("Operator sections", function () {

    beforeEach(module("app"));

    describe("manageSections test", function() {
        var service;
        var entityState;

        beforeEach(inject(function ($injector) {
            service = $injector.get("manageSections");
            entityState = $injector.get("entityState");
        }));

        it("exists", function () {
            expect(service).not.toBe(undefined);
            expect(service).not.toBe(null);
        });

        it("can init new sections", function() {
            //arange
            var section = [];
            var newSection = {
                Order: 0,
                Text: "",
                ScriptId: 0,
                EntityState: entityState.Added
            };

            //act
            service.initNewSection(section);

            //assert
            expect(section[0]).toEqual(newSection);
        });

        it("will delete sections that are already exists in database, by changing entityState to Deleted", function () {
            //arange
            var dummyScript = {};
            var section = {
                Order: 0,
                Text: "",
                ScriptId: 0,
                EntityState: entityState.Modified
            };

            //act
            service.deleteSection(section, dummyScript);

            //assert
            expect(section.EntityState).toBe(entityState.Deleted);
        });

        it("will delete sections that arent exists in database, by splicing them from array", function () {
            //arange
            var script = {};
            script.Sections = [];
            var section = {
                Order: 0,
                Text: "",
                ScriptId: 0,
                EntityState: entityState.Added
            };

            script.Sections.push(section);

            //act
            service.deleteSection(section, script);

            //assert
            expect(script.Sections.length).toBe(0);
        });

        it("will change script state to modify if we delete any section", function () {
            //arange
            var script = {};
            script.Sections = [];
            var section = {
                Order: 0,
                Text: "",
                ScriptId: 0,
                EntityState: entityState.Added
            };

            script.Sections.push(section);

            //act
            service.deleteSection(section, script);

            //assert
            expect(script.EntityState).toBe(entityState.Modified);
        });

        it("can check if section is deleted", function () {
            //arange
            var section = {
                EntityState: entityState.Deleted
            };

            //act
            var actual = service.isDeleted(section);

            //assert
            expect(actual).toBe(false);
        });

        it("will update section and script state to modify, if section is not new or modified", function () {
            //arange
            var script = {};
            var section = {
                EntityState: entityState.Deleted
            };

            //act
            service.updateSectionState(section, script);

            //assert
            expect(section.EntityState).toBe(entityState.Modified);
            expect(script.EntityState).toBe(entityState.Modified);
        });

        it("will not update section state to, if script is undefined", function () {
            //arange
            var script = undefined;
            var section = {
                EntityState: entityState.Deleted
            };

            //act
            service.updateSectionState(section, script);

            //assert
            expect(section.EntityState).toBe(entityState.Deleted);
        });
    });
});