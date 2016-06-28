mainApp.controller('NewSurveyController', function($scope, $routeParams, $location) {

    $scope.survey = {offnumber: "", client: "", address: ""};
    $scope.showAlert = false;



    var selectedLinks = sessionStorage.getItem("selectedLinks");

    var lastSelectedList = "";

    if(selectedLinks) {
        var obj = JSON.parse(selectedLinks);
        lastSelectedList = obj[obj.length-1];
    }

    if(lastSelectedList) {

        $scope.pending = "#/newsurvey/list/" + lastSelectedList;

    }

    $scope.startSurvey = function() {
        if($scope.survey.offnumber == "" || $scope.survey.client == "" || $scope.survey.address == "") {

            $scope.showAlert = true;

        } else {

            sessionStorage.setItem('offerteNumber', $scope.survey.offnumber);
            sessionStorage.setItem('client', $scope.survey.client);
            sessionStorage.setItem('address', $scope.survey.address);

            // reset
            sessionStorage.setItem('selectedLists', '');
            sessionStorage.setItem('selectedLinks', '');
            sessionStorage.setItem('remarks', '');

            $location.path( "/newsurvey/list/0" );
        }
    };
});
