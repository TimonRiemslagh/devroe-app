mainApp.controller('ListsController', function($scope, $routeParams, $location) {
    var allLists = sessionStorage.getItem('lists');
    var allListsObj = JSON.parse(allLists);

    var currentList = $routeParams.listId;

    var alertDanger = $('.tableHeader .alert-danger');

    $scope.errorMessage = "Selecteer een user!";
    $scope.successMessage = "De opmeting is opgeslaan!";

    allListsObj.forEach(function(list) {

        if(list.id == currentList) {
            $scope.listTitle = list.title;
            $scope.lists = list.items;
        }

    });

    $scope.addList = function(list) {
        var selectedLists = sessionStorage.getItem("selectedLists");
        var selectedListsObj = [];

        if(selectedLists) {
            selectedListsObj = JSON.parse(selectedLists);
        }

        selectedListsObj.push(list);

        sessionStorage.setItem("selectedLists", JSON.stringify(selectedListsObj));
    };

    $scope.saveSurvey = function() {
        alertDanger.hide();
        $('.tableHeader .alert-success').hide();

        console.log("save started");

        var selectedLists = sessionStorage.getItem("selectedLists");
        var selectedListsObj = [];
        var selectedListsStrings = [];

        var offerteNumber = sessionStorage.getItem("offerteNumber");
        var address = sessionStorage.getItem("address");
        var client = sessionStorage.getItem("client");

        var user = $(".usersDropdown option:selected").text();

        if(selectedLists) {
            selectedListsObj = JSON.parse(selectedLists);

            selectedListsObj.forEach(function(list) {
                selectedListsStrings.push(list.title);
            });
            console.log(selectedListsStrings);

            if(user == "Selecteer een gebruiker...") {
                alertDanger.fadeIn().delay(3000).fadeOut();
            } else {
                $('.spinner').show();
                $('.saveSurveyButton').prop('disabled', true);
                socket.emit('saveList', {arr: selectedListsStrings, offerteNumber: offerteNumber, client: client, address: address, user: user});
            }
        } else {
            $scope.errorMessage = "Niets geselecteerd!";
            alertDanger.fadeIn().delay(3000).fadeOut();
        }

    };
});
