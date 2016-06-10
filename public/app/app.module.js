var mainApp = angular.module('mainApp', ['ngRoute', 'ui.bootstrap', 'ngAnimate']);

mainApp.service( 'ActiveList', [ '$rootScope', function( $rootScope ) {

    var service = {

        activeList: {
            "lists": [],
            "listItems": []
        },

        setLists: function (lists) {
            activeList.lists = [];
            service.activeList.lists = lists;
            $rootScope.$broadcast( 'lists.update' );
        },

        setListItems: function(listItems) {
            activeList.listItems = [];
            service.activeList.listItems = listItems;
            $rootScope.$broadcast( 'listItems.update' );
        },

        addList: function(list) {
            service.activeList.lists.push( list );
            $rootScope.$broadcast( 'lists.update' );
        },

        addListItem: function(listItem) {
            service.activeList.listItems.items.push( listItem );
            service.activeList.listItems.titles.push( listItem.title );
            $rootScope.$broadcast( 'listItems.update' );
        },

        removeList: function(list) {

        },

        removeListItem: function(listItem) {

        }
    };

    return service;
}]);

mainApp.controller('indexController', ['$scope', 'ActiveList', function($scope, ActiveList) {

    var localStorageLists = localStorage.getItem('lists');
    var localStorageListItems = localStorage.getItem('listItems');

    if(localStorageLists) {

        ActiveList.setLists(JSON.parse(localStorageLists));

    } else {

        var getLists = new XMLHttpRequest();

        getLists.onreadystatechange = function() {

            if (getLists.readyState == 4 && getLists.status == 200) {

                var data = JSON.parse(getLists.responseText);
                localStorage.setItem('lists', JSON.stringify(data));
                ActiveList.setLists(data);
                console.log("lists added to storage");
            }
        };
        getLists.open("GET", window.location.origin + "/getLists", true);
        getLists.send();
    }

    if(localStorageListItems) {

        ActiveList.setListItems(JSON.parse(localStorageListItems));

    } else {

        var getListItems = new XMLHttpRequest();
        getListItems.onreadystatechange = function() {
            if (getListItems.readyState == 4 && getListItems.status == 200) {

                var data = JSON.parse(getListItems.responseText);
                localStorage.setItem('listItems', JSON.stringify(data));
                ActiveList.setListItems(data);
                console.log("listItems added to storage");
            }
        };
        getListItems.open("GET", window.location.origin + "/getListItems", true);
        getListItems.send();
    }

    $scope.users = ["timon"];

}]);
