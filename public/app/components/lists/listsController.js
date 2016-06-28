mainApp.controller('ListsController', ['$scope', '$routeParams', 'ActiveList', '$http', "$location", '$uibModal', function($scope, $routeParams, ActiveList, $http, $location, $uibModal) {

    $scope.allLists = ActiveList.lists;

    var currentList = $routeParams.listId;

    var selectedLinks = sessionStorage.getItem("selectedLinks");

    $scope.remarks = sessionStorage.getItem('remarks');

    var lastSelectedList = "";

    if(selectedLinks) {
        var obj = JSON.parse(selectedLinks);

        for(var t = 0; t < obj.length; t++) {
            if(obj[t] == currentList) {
                obj.splice(t+1, obj.length-1);
            }
        }

        sessionStorage.setItem("selectedLinks", JSON.stringify(obj));
    }

    if(currentList == 0) {

        $scope.allLists.forEach(function(item) {

            if(item.root == true) {
                $scope.currentListItem = item;
            }

        });

    } else {

        $scope.allLists.forEach(function (item) {
            if (item._id == currentList) {
                $scope.currentListItem = item;
            }

        });

    }

    $scope.addList = function(listTitle, listId) {

        var selectedLists = sessionStorage.getItem("selectedLists");
        var selectedListsObj = [];

        var selectedLinks = sessionStorage.getItem('selectedLinks');
        var selectedLinksObj = [];

        if(selectedLinks) {
            selectedLinksObj = JSON.parse(selectedLinks);
        }

        if(selectedLists) {
            selectedListsObj = JSON.parse(selectedLists);
        }

        selectedLinksObj.push(listId);
        selectedListsObj.push(listTitle);

        sessionStorage.setItem("selectedLists", JSON.stringify(selectedListsObj));
        sessionStorage.setItem("selectedLinks", JSON.stringify(selectedLinksObj));

        console.log(sessionStorage);
    };

    $scope.showPicture = function(image) {
        console.log(image);
        $scope.imageUrl = image;
    };

    $scope.openModal = function() {

        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'app/components/lists/modalTemplate.html',
            size: 'lg',
            controller: 'ModalInstanceCtrl',
            resolve: {
                remarks: function () {
                    return $scope.remarks;
                }
            }
        });

        modalInstance.result.then(function (remarks) {
            $scope.remarks = remarks;
        });
    };

    $scope.saveSurvey = function() {

        var selectedLists = sessionStorage.getItem("selectedLists");
        var offerteNumber = sessionStorage.getItem("offerteNumber");
        var address = sessionStorage.getItem("address");
        var client = sessionStorage.getItem("client");

        if(selectedLists) {
            $scope.noOptions = false;

            console.log(selectedLists);

                $scope.noUser = false;
                $scope.imageUrl = "";
                $scope.saveBusy = true;

                $http.post('/survey', {arr: selectedLists, offerteNumber: offerteNumber, client: client, address: address, remarks: $scope.remarks}).then(function(res) { //, user: user

                    $scope.saveBusy = false;

                    if(res.data.success) {

                        ActiveList.addSurvey(res.data.doc);

                        $location.path('/#/newsurvey');

                        sessionStorage.setItem('selectedLists', "");
                        sessionStorage.setItem('selectedLinks', "");
                        sessionStorage.setItem('offerteNumber', '');
                        sessionStorage.setItem('address', '');
                        sessionStorage.setItem('client', '');

                    } else {
                        
                        $scope.failure = true;
                        $scope.error = res.data.err;
                    }

                }, function(errorRes) {
                    console.log(errorRes);
                });
        } else {
            $scope.noOptions = true;
        }
    };
}]);
