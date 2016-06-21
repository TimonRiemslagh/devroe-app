mainApp.controller('CmsListsController', ['$scope', '$location', 'ActiveList', '$http',  function($scope, $location, ActiveList, $http) {

    $scope.goToNewList = function() {
        $location.path('/cms/cmsLists/cmsNewList');
    };

    $scope.activeLists = ActiveList.lists.items;

    $scope.edit = function(listId) {

        $location.path('/cms/cmsLists/cmsNewList/' + listId);
    };
    
    $scope.$on('lists.update', function() {
        console.log('listsupdated');
        $scope.activeLists = ActiveList.lists.items;
    });

    $scope.delete = function(id, listTitle) {

        console.log(id);

        var r = confirm("\"" + listTitle + "\" voorgoed verwijderen?");
        if (r == true) {

            $http.delete('/lists/' + id).then(function(res) {

                if(res.data.success) {

                    ActiveList.removeList(listTitle);

                    var localStorageLists = JSON.parse(localStorage.getItem('lists'));

                    for(var t = localStorageLists.items.length-1; t >= 0; t--) {
                        if(localStorageLists.items[t].title == listTitle) {
                            localStorageLists.items.splice(t,1);
                        }
                    }

                    for(var i = localStorageLists.titles.length-1; i >= 0; i--) {
                        if(localStorageLists.titles[i].title == listTitle) {
                            localStorageLists.titles.splice(i,1);
                        }
                    }

                    localStorage.setItem('lists', JSON.stringify(localStorageLists));
                } else {
                    console.log(res.data.err);
                }

            }, function(errorRes) {
                console.log(errorRes);
            });

        }

    };

}]);
