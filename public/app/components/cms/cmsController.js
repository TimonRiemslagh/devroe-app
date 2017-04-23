mainApp.controller('CmsController', function($scope) {
  if(!sessionStorage.getItem('login')) {
    $location.path('/login');
  }
  
});
