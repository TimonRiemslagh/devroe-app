mainApp.directive("fileInput", [function () {
    return {
        scope: {
            fileInput: "="
        },
        link: function (scope, element, attrs) {

            element.bind("change", function (changeEvent) {

                scope.fileInput.file = changeEvent.target.files[0];
                scope.fileInput.changed = true;
                scope.fileInput.filename = changeEvent.target.files[0].name;

                console.log(scope.fileInput.file);

                var reader = new FileReader();
                reader.onload = function (loadEvent) {
                    scope.$apply(function () {
                        scope.fileInput.data = loadEvent.target.result;
                    });
                };

                reader.readAsDataURL(changeEvent.target.files[0]);
            });
        }
    }
}]);