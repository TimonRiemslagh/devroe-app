mainApp.controller('LoginController', function($scope, $location, $http) {
  $scope.auth = {name: "", pass: ""};

  //check if user is logged in
  if(sessionStorage.getItem('login')) {
    $location.path('/newsurvey');
  }

  $scope.login = function() {

    $http.post('/authenticate', $scope.auth).then(function(res) {

        if(res.data.success) {

          sessionStorage.setItem('login', 'true');

            $location.path('/newsurvey');

        } else {
            //$scope.error = '<div class="alertLoginFail alert alert-danger"><strong>Fout!</strong> Gebruikersnaam of wachtwoord zijn onjuist.</div>';
            $('.alertLoginFail').show();
        }

    }, function(errorRes) {
        console.log(errorRes);
    });
  }

});
