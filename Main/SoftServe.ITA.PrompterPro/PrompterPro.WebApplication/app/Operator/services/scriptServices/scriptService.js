app.service("scriptService",
[
	"fileUpload",
	"webApi",
	"scriptRepository",
	"entityState",
	"constants",
	"notify",
	"notifyType",
	"icons",
	"prompterStatus",
	function(
		fileUpload,
		webApi,
		scriptRepository,
		entityState,
		constants,
		notify,
		notifyType,
		icons,
		prompterStatus) {

		return function($scope) {
			var obj = {};

			// private members:

			var getFileExtension = function(fileName) {
				if (!_.isString(fileName)) {
					return null;
				}

				var splitByDot = s.words(fileName, ".");
				var length = splitByDot.length;

				if (length === 0) {
					return null;
				}

				return splitByDot[length - 1];
			}

			var failedToImport = function () {
				$scope.showImportLoader = false;
				notify(
					notifyType.danger,
					constants.unimported,
					icons.warning);
			}

			var imported = function (script) {
				$scope.scripts.push(script);
				$scope.showImportLoader = false;
				notify(
					notifyType.success,
					constants.imported + script.Title,
					icons.ok);
			}

			var importPptxFile = function (file) {
				fileUpload(file,
					webApi.presentation,
					imported,
					failedToImport
				);
			}

			var createScript = function(title, description) {
				return {
					Title: title,
					Description: description,
					Sections: [],
					Options: {
						FontSize: constants.defaultFontSize,
						ReadingSpeed: constants.defaultReadingSpeed,
						AnnouncerName: constants.defaultAnnouncer,
						EntityState: entityState.Added
					},
					EntityState: entityState.Added
				};
			}

			var createSection = function(order, text) {
				return {
					Order: order,
					Text: text,
					EntityState: entityState.Added
				};
			}

			var createRegExp = function(str) {
				return new RegExp("(|[a-zA-Z0-9])" + str + "(?=$|[^a-zA-Z0-9])");
			}

			var importTxtFile = function (file) {
				var reader = new FileReader();

				reader.onload = function () {
					var allText = s.trim(reader.result);
					if (!allText) {
						failedToImport();
						return;
					}

					var allParts = allText.split(createRegExp(constants.tagSection));
					if (allParts.length === 0) {
						failedToImport();
						return;
					}

					var header = s.trim(allParts[0]);
					if (!header) {
						failedToImport();
						return;
					}

					var title;
					var description = constants.emptyString;
					if (s.include(header, constants.tagDescription)) {
						var headerParts = header.split(createRegExp(constants.tagDescription));
						title = s.trim(headerParts[0]);
						description = s.trim(headerParts[1]);
					} else {
						title = header;
					}

					if (!s.startsWith(title, constants.tagScript)) {
						failedToImport();
						return;
					}

					title = title.substring(constants.tagScript.length);

					var script = createScript(title, description);

					var order = 0;
					for (var i = 1; i < allParts.length; i++) {
						var sectionText = s.trim(allParts[i]);
						if (sectionText) {
							var section = createSection(order, sectionText);
							script.Sections.push(section);
							++order;
						}
					}

					imported(script);
				}

				reader.readAsText(file);
			}

			var invalidFileExtension = function () {
				$scope.showImportLoader = false;
				notify(
					notifyType.danger,
					constants.invalidFormat,
					icons.warning);
			}

			// public members:

			obj.add = function(form) {
				if (form.$valid) {
					$scope.selectedScript = createScript($scope.newScriptName,
						$scope.newScriptDescription);

					$scope.scripts.push($scope.selectedScript);

					$scope.newScriptName = constants.scriptDefaultName;
					$scope.newScriptDescription = constants.emptyString;

					$scope.showScriptModal = false;
				}
			};

			obj.remove = function(script) {
				if (script === $scope.selectedScript) {
					$scope.selectedScript = null;
				}
				if (script.EntityState === entityState.Added) {
					$scope.scripts = _.without($scope.scripts, script);
				} else {
					script.EntityState = entityState.Deleted;
					if (script.Sections) {
						_.each(script.Sections,
							function(section) {
								section.EntityState = entityState.Deleted;
							});
					}
					if (script.Options) {
						script.Options.EntityState = entityState.Deleted;
					}
				}
			};

			obj.select = function(script) {
				$scope.selectedScript = script;
			};

			obj.save = function() {

				var changed = _.filter($scope.scripts, function(script) {
					return script.EntityState !== entityState.Unchanged;
				});

				var orderSections = function(scripts) {
					_.each(scripts, function(script) {
						_.each(script.Sections, function(section, i) {
							section.Order = i;
						});
					});
				}(changed);

				var oldScripts = $scope.scripts;
				$scope.scripts = undefined;

				scriptRepository.post(changed)
					.then(function(newScripts) {
							$scope.scripts = newScripts;
							$scope.selectedScript = null;
							notify(
								notifyType.success,
								constants.changesSaved,
								icons.ok);
						},
						function() {
							notify(
								notifyType.danger,
								constants.cnagesUnsaved,
								icons.warning);

							$scope.scripts = oldScripts;
						}
					);
			};

			obj.import = function () {
				$scope.showImport = false;
				$scope.showImportLoader = true;

				var file = $scope.scriptFile;
				var extension = getFileExtension(file.name);

				if (extension === "pptx") {
					importPptxFile(file);
				} else if (extension === "txt") {
					importTxtFile(file);
				} else {
					invalidFileExtension();
				}
			};

			obj.initScript = function(script) {
				$scope.index = _.indexOf(_.sortBy($scope.scripts, 'Title'), script);

			}

			obj.saveToTxt = function() {
				var fileName = $scope.selectedScript.Title + ".txt";

				var content = constants.tagScript + "\n"
					+ $scope.selectedScript.Title;

				if ($scope.selectedScript.Description) {
					content += "\n" + constants.tagDescription + "\n"
						+ $scope.selectedScript.Description;
				}

				_.each($scope.selectedScript.Sections,
					function(section) {
						content += "\n\n\n"
							+ constants.tagSection + "\n"
							+ section.Text;
					});

				saveTextAs(content, fileName);
			};

			// prompter list function
			obj.check = function(prompter) {
				if (prompter.checked) {
					prompter.checked = false;
					$scope.checked = _.without($scope.checked, prompter);
				} else if (prompter.PrompterStatus === prompterStatus.On) {
					prompter.checked = true;
					$scope.checked.push(prompter);
				}
			}

			// prompter list function
			obj.canCheck = function(prompter) {
				return prompter.PrompterStatus === prompterStatus.On;
			}

			return obj;
		};
	}
]);