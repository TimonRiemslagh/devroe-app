mainApp.directive("fileInput", [function () {
    return {
        scope: {
            fileInput: "="
        },
        link: function (scope, element, attrs) {
            element.bind("change", function (changeEvent) {

                scope.$apply(function () {
                    scope.fileInput = changeEvent.target.files[0];
                });

                /*var reader = new FileReader();
                reader.onload = function (loadEvent) {
                    scope.$apply(function () {
                        scope.fileread = loadEvent.target.result;
                    });
                };
                reader.readAsDataURL(changeEvent.target.files[0]);*/
            });
        }
    }
}]);