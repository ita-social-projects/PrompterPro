app.service("notify",
    function () {
        return function(type, message, icon) {
            $.notify({
                message: message,
                icon: icon
            }, {
                type: type,
                placement: {
                    from: "bottom",
                    align: "right"
                },
                template:
                    "<div data-notify=\"container\" class=\"col-xs-11 col-sm-3 alert alert-{0}\" role=\"alert\">" +
                        "<button type=\"button\" aria-hidden=\"true\" class=\"close\" data-notify=\"dismiss\">×</button>" +
                        "<span data-notify=\"icon\"></span> " +
                        "<span data-notify=\"message\">{2}</span>" +
                    "</div>"
            });
        };
    });