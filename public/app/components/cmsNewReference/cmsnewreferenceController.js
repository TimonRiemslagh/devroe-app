mainApp.controller('CmsNewReferenceController', function($scope, $location) {

    //$('ul.nav li').removeClass('active');
    //$('.cms').addClass("active");

    $scope.ref = {};
    $scope.isBusy = false;

    $scope.refImage = {
        file: {},
        data: ""
    };

    $scope.saveRef = function() {

        $scope.isBusy = true;

        socket.emit('saveRef', {keywords: $scope.keywords, photo: $scope.refImage.file, photoUrl: $scope.refImage.file.name});

    };

    socket.on('refSaved', function() {

        $scope.$apply(function() {

            // Reset the form model.
            $scope.keywords = "";
            $scope.refImage = {
                file: {},
                data: ""
            };
            $scope.newRef.$setPristine();
            $scope.newRef.$setUntouched();

            $('.refImage').val(null);
            $scope.showAlert = false;
            $scope.isBusy = false;

        });

    });
    
    socket.on('refNotSaved', function(err) {

        console.log(err);

    });

    /*$scope.saveRef = function() {

        //$scope.listItem.text = $('.listItemInput').val();
        $scope.ref.photo = $('.listItemPhoto')[0].files[0];


        if($scope.ref.text && $scope.ref.photo) {

            console.log($scope.ref.text, $scope.ref.photo);

            socket.emit('saveRef', {keywords: $scope.ref.text, photo: $scope.ref.photo, photoUrl: $scope.ref.photo.name});

            $scope.isBusy = true;
        } else {
            $('.newListItemSaveWarn').fadeIn().delay(3000).fadeOut();
        }

    };*/

    /*socket.on('saveRefFeedback', function(err) {

        console.log(err);

        if(err) {
            $scope.$apply(function() {
                $scope.err = err;
            });
        } else {
            $scope.$apply(function() {
                $scope.saveSuccess = true;
            });
            $('.newRefAlertSuccess').fadeIn().delay(3000).fadeOut();
            $scope.ref.text = "";
            $('.listItemPhoto').val("");
            $('.preview').hide();
        }

        $scope.$apply(function() {
            $scope.isBusy = false;
        });
    });*/

});
