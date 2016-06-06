mainApp.controller('CmsNewListItemController', function($scope, $route) {
    $('ul.nav li').removeClass('active');
    $('.cms').addClass("active");

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

        var title = $('.listItemInput').val();
        var photo = $('.listItemPhoto')[0].files[0];

        if(title && photo) {
            socket.emit('saveListItem', {title: title, photo: photo, fileName: photo.name});

            $('.spinner').show();
            $('.newListItem').hide();
        } else {
            $('.newListItemSaveWarn').fadeIn().delay(3000).fadeOut();
        }

    };

    socket.on('saveListItemFeedback', function(err) {

        console.log(err);

        if(err) {
            $scope.err = err;
            $('.newListItemAlertFail').show();
        } else {
            $('.newListItemAlertSuccess').fadeIn().delay(3000).fadeOut();
            $('.listItemInput').val("");
            $('.listItemPhoto').val("");
            $('.preview').hide();
            $('.newListItem').show();
        }

        $('.spinner').hide();
        console.log("completed");
    });

});
