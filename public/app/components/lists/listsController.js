mainApp.controller('ListsController', ['$scope', '$routeParams', 'ActiveList', function($scope, $routeParams, ActiveList) {

    $scope.allLists = ActiveList.lists;

    var currentList = $routeParams.listId;

    if(currentList == 0) {

        $scope.allLists.items.forEach(function(item) {

            if(item.id == 0) {
                $scope.currentListItem = item;
            }

        });

    } else {

        $scope.allLists.items.forEach(function(item) {

            console.log(item._id, currentList);

            if(item._id == currentList) {
                $scope.currentListItem = item;
            }

        });

    }



    //var alertDanger = $('.tableHeader .alert-danger');

    //$scope.errorMessage = "Selecteer een user!";
    //$scope.successMessage = "De opmeting is opgeslaan!";

    /*allListsObj.forEach(function(list) {

        if(list.id == currentList) {
            $scope.listTitle = list.title;
            $scope.lists = list.items;
        }

    });*/

    $scope.addList = function(list) {
        var selectedLists = sessionStorage.getItem("selectedLists");
        var selectedListsObj = [];

        if(selectedLists) {
            selectedListsObj = JSON.parse(selectedLists);
        }

        selectedListsObj.push(list);

        sessionStorage.setItem("selectedLists", JSON.stringify(selectedListsObj));
    };

    $scope.showPicture = function(image) {
        console.log(image);
    };

    $scope.saveSurvey = function() {
        //alertDanger.hide();
        //$('.tableHeader .alert-success').hide();

        console.log("save started");

        var selectedLists = sessionStorage.getItem("selectedLists");
        var selectedListsObj = [];
        var selectedListsStrings = [];

        var offerteNumber = sessionStorage.getItem("offerteNumber");
        var address = sessionStorage.getItem("address");
        var client = sessionStorage.getItem("client");

        //var user = $(".usersDropdown option:selected").text();

        if(selectedLists) {
            selectedListsObj = JSON.parse(selectedLists);

            selectedListsObj.forEach(function(list) {
                selectedListsStrings.push(list.title);
            });
            
            console.log(selectedListsStrings);

            if(user == "Selecteer een gebruiker...") {
                //alertDanger.fadeIn().delay(3000).fadeOut();
            } else {
                //$('.spinner').show();
                //$('.saveSurveyButton').prop('disabled', true);
                //socket.emit('saveList', {arr: selectedListsStrings, offerteNumber: offerteNumber, client: client, address: address, user: user});
            }
        } else {
            $scope.errorMessage = "Niets geselecteerd!";
            //alertDanger.fadeIn().delay(3000).fadeOut();
        }

    };
}]);
