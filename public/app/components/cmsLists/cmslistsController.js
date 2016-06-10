mainApp.controller('CmsListsController', function($scope, $location) {

    //$('ul.nav li').removeClass('active');
    //$('.cms').addClass("active");

    $scope.goToNewList = function() {
        $location.path('/cms/cmsLists/cmsNewList');
    }

});
