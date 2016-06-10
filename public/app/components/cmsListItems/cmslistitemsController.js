mainApp.controller('CmsListItemsController', function($scope, $location) {

    //$('ul.nav li').removeClass('active');
    //$('.cms').addClass("active");

    $scope.goToNewListItem = function() {
        $location.path('/cms/cmsListItems/cmsNewListItem');
    }

});
