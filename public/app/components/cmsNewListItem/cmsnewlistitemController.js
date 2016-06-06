mainApp.controller('CmsNewListItemController', function($scope, $route) {
    $('ul.nav li').removeClass('active');
    $('.cms').addClass("active");

    $scope.listItem = {};
    $scope.isBusy = false;
    $scope.saveSuccess = false;

    $scope.previewPhoto = function() {

        var file = $('input[type=file]')[0].files[0];

        var reader = new FileReader();

        reader.addEventListener("load", function () {
            $('.preview').attr("src", reader.result).show();
        }, false);

        if (file) {
            reader.readAsDataURL(file);
        }
    };

    $scope.saveListItem = function() {

        //$scope.listItem.text = $('.listItemInput').val();
        $scope.listItem.photo = $('.listItemPhoto')[0].files[0];


        if($scope.listItem.text && $scope.listItem.photo) {
            socket.emit('saveListItem', {title: $scope.listItem.text, photo: $scope.listItem.photo});

            $scope.isBusy = true;
        } else {
            $('.newListItemSaveWarn').fadeIn().delay(3000).fadeOut();
        }

    };

    socket.on('saveListItemFeedback', function(err) {

        console.log(err);

        if(err) {
            $scope.$apply(function() {
                $scope.err = err;
            });
        } else {
            $scope.$apply(function() {
                $scope.saveSuccess = true;
            });
            $('.newListItemAlertSuccess').fadeIn().delay(3000).fadeOut();
            $scope.listItem.text = "";
            $('.listItemPhoto').val("");
            $('.preview').hide();
        }

        $scope.$apply(function() {
            $scope.isBusy = false;
        });
    });

});
