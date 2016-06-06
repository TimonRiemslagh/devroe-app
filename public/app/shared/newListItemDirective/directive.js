mainApp.directive('newListItem', function() {

    function link(scope, element, attrs) {

        scope.previewPhoto = function(currElement) {

            var file = $(currElement).parent().find('input[type=file]')[0].files[0];

            var reader = new FileReader();

            reader.addEventListener("load", function () {
                $(currElement).parent().find('img').attr("src", reader.result).show();
            }, false);

            if (file) {
                reader.readAsDataURL(file);
            }
        };

        scope.delListItem = function($event) {

            $($event.target).parent().parent().parent().remove();

        };
    }

    return {
        restrict: 'E',
        templateUrl: '/app/shared/newListItemDirective/template.html',
        link: link
    };
});
