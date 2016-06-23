mainApp.controller('CmsNewReferenceController', ['$scope', 'ActiveList', '$routeParams', '$location', function($scope, ActiveList, $routeParams, $location) {

    $scope.ref = {};
    $scope.isBusy = false;

    $scope.refImage = {
        file: "",
        data: ""
    };

    $scope.currentRef = {url: ""};

    if($routeParams.refId) {

        ActiveList.refs.forEach(function(ref) {
            if(ref._id == $routeParams.refId) {
                $scope.currentRef = ref;
                console.log(ref);
                $scope.keywords = ref.keywords;
            }
        });

    }

    $scope.saveRef = function() {

        $scope.showAlert = false;

        if($scope.currentRef.url) {

            if($scope.keywords) {

                $scope.isBusy = true;
                socket.emit('updateRef', {id: $scope.currentRef._id, keywords: $scope.keywords, photo: $scope.refImage.file, filename: $scope.refImage.file.name, url: $scope.currentRef.url});

            } else {
                $scope.showAlert = true;
            }

        } else {

            if ($scope.keywords && $scope.refImage.file) {

                $scope.isBusy = true;
                socket.emit('saveRef', {
                    id: $scope.currentRef._id,
                    keywords: $scope.keywords,
                    photo: $scope.refImage.file,
                    filename: $scope.refImage.file.name
                });

            } else {
                $scope.showAlert = true;
            }

        }

    };

    socket.on('refSaved', function(savedRef) {

        $scope.$apply(function() {

            ActiveList.addRef(savedRef);
            var localStorageRefs = JSON.parse(localStorage.getItem('refs'));
            localStorageRefs.unshift(savedRef);
            localStorage.setItem('refs', JSON.stringify(localStorageRefs));

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

    socket.on('refUpdated', function(updatedRef) {

        $scope.$apply(function() {
            $location.path('/cms/cmsReferences');
        });

    });
    
    socket.on('refNotSaved', function(err) {

        console.log(err);

    });

}]);
