mainApp.controller('NewSurveyController', function($scope, $routeParams, $location) {

    $('ul.nav li').removeClass('active');
    $('.newSurvey').addClass("active");


    $scope.startSurvey = function() {
        sessionStorage.setItem('offerteNumber', $('#Offertenummer').val());
        sessionStorage.setItem('client', $('#Klant').val());
        sessionStorage.setItem('address', $('#Adres').val());

        if(sessionStorage.getItem('selectedLists')) {
            sessionStorage.setItem('selectedLists', '');
        }

        $location.path( "/newsurvey/list/0" );
        console.log(sessionStorage);
    };



});
