mainApp.controller('CmsReferencesController', function($scope, $location) {

    $('ul.nav li').removeClass('active');
    $('.cms').addClass("active");

    $scope.goToNewRef = function() {
        $location.path('/cms/cmsReferences/cmsNewReference');
    }

});
