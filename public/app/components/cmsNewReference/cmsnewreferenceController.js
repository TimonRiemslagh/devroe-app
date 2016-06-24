mainApp.controller('CmsNewReferenceController', ['$scope', 'ActiveList', '$routeParams', '$location', '$http', function($scope, ActiveList, $routeParams, $location, $http) {

    $scope.ref = {};
    $scope.isBusy = false;
    var preview = $('.preview');

    if($routeParams.refId) {

        ActiveList.refs.forEach(function(ref) {
            if(ref._id == $routeParams.refId) {
                $scope.currentRef = ref;
                $scope.keywords = ref.keywords;
                $scope.imageUrl = ref.url;
                preview.attr("src", ref.url);
            }
        });

    }

    function uploadFile(file, signedRequest, url){
        const xhr = new XMLHttpRequest();
        xhr.open('PUT', signedRequest);
        xhr.onreadystatechange = () => {
            if(xhr.readyState === 4){
                if(xhr.status === 200){
                    if($scope.currentRef) {
                        postRef({id: $scope.currentRef._id, keywords: $scope.keywords, url: url});
                    } else {
                        postRef({keywords: $scope.keywords, url: url});
                    }
                }
                else{
                    alert('Could not upload file.');
                }
            }
        };
        xhr.send(file);
    }

    function getSignedRequest(file){
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `/sign-s3?file-name=${file.name}&file-type=${file.type}`);
        xhr.onreadystatechange = () => {
            if(xhr.readyState === 4){
                if(xhr.status === 200){
                    const response = JSON.parse(xhr.responseText);
                    uploadFile(file, response.signedRequest, response.url);
                }
                else{
                    alert('Could not get signed URL.');
                }
            }
        };
        xhr.send();
    }

    $scope.saveRef = function() {

        var image = $(".refImage")[0].files;

        $scope.showAlert = false;

        if($scope.imageUrl && $scope.keywords) {

            $scope.isBusy = true;
            postRef({id: $scope.currentRef._id, keywords: $scope.keywords, url: $scope.imageUrl});

        } else {
            if(image[0] && $scope.keywords) {
                $scope.isBusy = true;
                getSignedRequest(image[0]);
            } else {
                $scope.showAlert = true;
            }
        }

    };

    var postRef = function(data) {

        $http.post('/ref', data).then(function(res) {

            $scope.isBusy = false;

            if(res.data.success) {

                if(res.data.updated) {
                    ActiveList.updateRef(res.data.doc);
                } else {
                    ActiveList.addRef(res.data.doc);
                }
    
                // Reset the form model.
                $scope.keywords = "";
                $scope.newRef.$setPristine();
                $scope.newRef.$setUntouched();

                $('.refImage').val(null);
                $scope.showAlert = false;
                $scope.isBusy = false;
                $('.preview').attr("src", "");

            } else {
                console.log('error save ref');
            }

        }, function(errorRes) {
            console.log(errorRes);
        });

    };

}]);

function previewFile() {

    var preview = $('.preview');
    var file    = $(".refImage")[0].files[0];

    var reader  = new FileReader();

    reader.addEventListener("load", function () {
        preview.attr("src", reader.result);
    }, false);

    if (file) {
        reader.readAsDataURL(file);
    }
}