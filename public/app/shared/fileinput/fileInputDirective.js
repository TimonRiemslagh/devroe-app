mainApp.directive("fileInput", [function () {
    return {
        scope: {
            fileInput: "="
        },
        link: function (scope, element, attrs) {

            element.bind("change", function (changeEvent) {

                //scope.fileInput.file = changeEvent.target.files[0];
                scope.fileInput.file = changeEvent.target.files[0];

                var reader = new FileReader();
                reader.onload = function (loadEvent) {
                    scope.$apply(function () {
                        scope.fileInput.data = loadEvent.target.result;
                    });
                };

                if(scope.fileInput.file) {
                    reader.readAsDataURL(changeEvent.target.files[0]);
                }

            });
        }
    }
}]);