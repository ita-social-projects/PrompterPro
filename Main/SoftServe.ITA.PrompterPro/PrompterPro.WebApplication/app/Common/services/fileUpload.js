app.service("fileUpload", [
	"$http",
	function($http) {
		return function(file, url, succes, error) {
			var formData = new FormData();
			formData.append("file", file);
			$http.post(url,
					formData,
					{
						transformRequest: angular.identity,
						headers: { "Content-Type": undefined }
					})
				.success(function (data) {
					if (succes) {
						succes(data);
					}
				})
				.error(function (message) {
					if (error) {
						error(message);
					}
				});
		};
	}
]);