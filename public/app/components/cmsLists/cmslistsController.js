mainApp.controller('CmsListsController', ['$scope', '$location', 'ActiveList', '$http', 'filterFilter',  function($scope, $location, ActiveList, $http, filterFilter) {

    $scope.goToNewList = function() {
        $location.path('/cms/cmsLists/cmsNewList');
    };

    $scope.activeLists = ActiveList.lists;

    $scope.edit = function(listId) {

        $location.path('/cms/cmsLists/cmsNewList/' + listId);
    };
    
    $scope.$on('lists.update', function() {
        $scope.activeLists = ActiveList.lists;
    });

    $scope.delete = function(id, listTitle) {

        console.log(id);

        var r = confirm("\"" + listTitle + "\" voorgoed verwijderen?");
        if (r == true) {

            $http.delete('/lists/' + id).then(function(res) {

                if(res.data.success) {
                    ActiveList.removeList(id);
                } else {
                    console.log(res.data.err);
                }

            }, function(errorRes) {
                console.log(errorRes);
            });

        }

    };

}]);
