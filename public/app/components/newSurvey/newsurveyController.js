mainApp.controller('NewSurveyController', function($scope, $routeParams, $location) {

    $('ul.nav li').removeClass('active');
    $('.newSurvey').addClass("active");


    $scope.startSurvey = function() {

        var offerteNumber = $('#Offertenummer').val();
        var client = $('#Klant').val();
        var address = $('#Adres').val();

        if(offerteNumber == "" || client == "" || address == "") {
            $(".startSurveyAlert").fadeIn();
        } else {

            sessionStorage.setItem('offerteNumber', offerteNumber);
            sessionStorage.setItem('client', client);
            sessionStorage.setItem('address', address);

            // reset
            if(sessionStorage.getItem('selectedLists')) {
                sessionStorage.setItem('selectedLists', '');
            }

            $location.path( "/newsurvey/list/0" );
            console.log(sessionStorage);

        }
    };
});
