mainApp.directive('newListItem', function() {

    function link(scope, element, attrs) {

        scope.previewPhoto = function(currElement) {

            console.log($(currElement).parent().find('input[type=file]'));

            var file = $(currElement).parent().find('input[type=file]')[0].files[0];

            var reader = new FileReader();

            reader.addEventListener("load", function () {
                $(currElement).parent().find('img').attr("src", reader.result).show();
            }, false);

            if (file) {
                reader.readAsDataURL(file);
            }
        }
    }

    return {
        restrict: 'E',
        templateUrl: '/app/shared/newListItemDirective/template.html',
        link: link
    };
});
