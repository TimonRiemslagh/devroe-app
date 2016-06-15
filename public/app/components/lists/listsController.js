mainApp.controller('ListsController', ['$scope', '$routeParams', 'ActiveList', '$http', "$location", function($scope, $routeParams, ActiveList, $http, $location) {

    $scope.allLists = ActiveList.lists;

    var currentList = $routeParams.listId;

    if(currentList == 0) {

        $scope.allLists.items.forEach(function(item) {

            if(item.id == 0) {
                $scope.currentListItem = item;
                console.log($scope.currentListItem);
            }

        });

    } else {

        $scope.allLists.items.forEach(function (item) {

            if (item._id == currentList) {
                $scope.currentListItem = item;
                console.log($scope.currentListItem);
            }

        });

    }

    $scope.addList = function(listTitle) {
        var selectedLists = sessionStorage.getItem("selectedLists");
        var selectedListsObj = [];

        if(selectedLists) {
            selectedListsObj = JSON.parse(selectedLists);
        }

        selectedListsObj.push(listTitle);

        sessionStorage.setItem("selectedLists", JSON.stringify(selectedListsObj));
        console.log(sessionStorage);
    };

    $scope.showPicture = function(image) {
        $scope.imageUrl = image;
    };

    $scope.saveSurvey = function() {
        var selectedLists = sessionStorage.getItem("selectedLists");

        var offerteNumber = sessionStorage.getItem("offerteNumber");
        var address = sessionStorage.getItem("address");
        var client = sessionStorage.getItem("client");

        var user = $(".usersDropdown option:selected").val();

        if(selectedLists) {
            $scope.noOptions = false;

            console.log(selectedLists);

            if(user == "null") {
                $scope.noUser = true;
            } else {
                $scope.noUser = false;
                $scope.imageUrl = "";
                $scope.saveBusy = true;

                $http.post('/survey', {arr: selectedLists, offerteNumber: offerteNumber, client: client, address: address, user: user}).then(function(res) {

                    $scope.saveBusy = false;

                    if(res.data.success) {

                        $location.path('/#/newsurvey');

                        sessionStorage.setItem('selectedLists', "");
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
            }
        } else {
            $scope.noOptions = true;
        }

    };
}]);
