app.service("manageSections", [
    "entityState",
    function (entityState) {
        var self = this;

        var changeScriptState = function (script) {
            if (script.EntityState !== entityState.Added) {
                script.EntityState = entityState.Modified;
            }
        }

        var createNewSection = function (index, scriptId) {
            return {
                Order: index,
                Text: "",
                ScriptId: scriptId || 0,
                EntityState: entityState.Added
            };
        }

        self.initNewSection = function (section) {
            section.length = 0;
            section.push(createNewSection(0));
        }
        
        self.deleteSection = function (section, script) {
            if (section.EntityState !== entityState.Added) {
                section.EntityState = entityState.Deleted;
            } else {
                var index = script.Sections.indexOf(section);
                script.Sections.splice(index, 1);
            }
            changeScriptState(script);
        }

        self.isDeleted = function (section) {
            if (section.EntityState !== entityState.Deleted)
                return true;
            return false;
        }

        self.updateSectionState = function (section, script) {
            if (script !== null
                && script !== undefined) {
                if (section.EntityState !== entityState.Modified &&
                    section.EntityState !== entityState.Added) {
                    section.EntityState = entityState.Modified;
                }
                changeScriptState(script);
            }
        }

        self.moveSection = function (section, script) {

            script.Sections.splice(script.Sections.indexOf(section), 1);
            changeScriptState(script);
            _.each(script.Sections, function (section) {
                if (section.EntityState !== entityState.Added
                    && section.EntityState !== entityState.Deleted) {
                    section.EntityState = entityState.Modified;
                }
            });

        }

        self.dragNewSection = function (section, script) {
            _.each(script.Sections, function (section) {
                section.ScriptId = script.ScriptId;
                section.isFocused = true;
                if (section.EntityState !== entityState.Deleted
                     && section.EntityState !== entityState.Added) {
                    section.EntityState = entityState.Modified;
                }

            });
            changeScriptState(script);
        }

        self.addNewSection = function (script) {
            var newSection = createNewSection(script.length - 1, script.ScriptId);
            script.Sections.push(newSection);
            changeScriptState(script);
            newSection.isFocused = true;


        }

        return self;
    }
]);