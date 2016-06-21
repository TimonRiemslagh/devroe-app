mainApp.controller('CmsListItemsController', function($scope, $location) {

    $scope.goToNewListItem = function() {
        $location.path('/cms/cmsListItems/cmsNewListItem');
    }

});
