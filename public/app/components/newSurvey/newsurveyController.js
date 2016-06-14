mainApp.controller('NewSurveyController', function($scope, $routeParams, $location) {

    //$('ul.nav li').removeClass('active');
    //$('.newSurvey').addClass("active");

    $scope.survey = {offnumber: "", client: "", address: ""};
    $scope.showAlert = false;

    $scope.startSurvey = function() {
        

        if($scope.survey.offnumber == "" || $scope.survey.client == "" || $scope.survey.address == "") {

            $scope.showAlert = true;

        } else {

            sessionStorage.setItem('offerteNumber', $scope.survey.offnumber);
            sessionStorage.setItem('client', $scope.survey.client);
            sessionStorage.setItem('address', $scope.survey.address);

            // reset
            if(sessionStorage.getItem('selectedLists')) {
                sessionStorage.setItem('selectedLists', '');
            }

            $location.path( "/newsurvey/list/0" );
            console.log(sessionStorage);
        }
    };
});
