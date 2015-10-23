app.service("sectionServices", [
    "constants",
    function (constants) {
        var self = this;

        self.displaySectionIntro = function(section) {
            var intro = section.Text;
            var introLength = constants.sectionsIntroLength;
            if (section.Text.length > introLength) {
                intro = section.Text.substring(0, introLength) + "...";
            }
            return intro;
        }

        return self;
    }
]);