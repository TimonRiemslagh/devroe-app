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

        scope.saveListItem = function() {

            var title = $('.listItemInput').val();
            var photo = $('.listItemPhoto')[0].files[0];

            socket.emit('saveListItem', {title: title, photo: photo, fileName: photo.name});

        };

        socket.on('saveListItemComplete', function() {
            console.log("completed");
        });
    }

    return {
        restrict: 'E',
        templateUrl: '/app/shared/newListItemDirective/template.html',
        link: link
    };
});
