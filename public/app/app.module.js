var mainApp = angular.module('mainApp', ['ngRoute', 'ui.bootstrap', 'ngAnimate']);

mainApp.service( 'ActiveList', [ '$rootScope', function( $rootScope ) {

    var service = {

        lists: {},
        refs: [],

        /*activeList: {
            "lists": [],
            "listItems": []
        },*/

        setRefs: function (refs) {
            service.refs = refs;
            $rootScope.$broadcast( 'refs.update' );
        },

        setLists: function (lists) {
            service.lists = lists;
            $rootScope.$broadcast( 'lists.update' );
        },

        /*setListItems: function(listItems) {
            activeList.listItems = [];
            service.activeList.listItems = listItems;
            $rootScope.$broadcast( 'listItems.update' );
        },*/

        addRef: function(ref) {
            service.refs.push(ref);
            $rootScope.$broadcast( 'refs.update' );
        },

        addList: function(list) {
            console.log(list);
            service.lists.items.push( list );
            service.lists.titles.push(list.title);
            $rootScope.$broadcast( 'lists.update' );
        },

        /*addListItem: function(listItem, title) {
            service.activeList.listItems.items.push( listItem );
            service.activeList.listItems.titles.push( title );
            $rootScope.$broadcast( 'listItems.update' );
        },

        updateListItem: function(listItem) {
            for(var t = 0; t < this.activeList.listItems.items.length; t++) {
                if(this.activeList.listItems.items[t].title == listItem.title) {
                    this.activeList.listItems.items[t] = listItem;
                }
            }
        },*/

        removeList: function(list) {

        },

        updateList: function(list) {

        }

        /*removeListItem: function(listItem) {

        }*/
    };

    return service;
}]);

mainApp.controller('indexController', ['$scope', '$http', 'ActiveList', function($scope, $http, ActiveList) {

    var localStorageLists = localStorage.getItem('lists');
    var localStorageRefs = localStorage.getItem('refs');

    if(localStorageLists) {
        ActiveList.setLists(JSON.parse(localStorageLists));
    }

    if(localStorageRefs) {
        ActiveList.setRefs(JSON.parse(localStorageRefs));
    }

    $http.get('/lists').then(function(res) {
        localStorage.setItem('lists', JSON.stringify(res.data));
        ActiveList.setLists(res.data);
    }, function(errorRes) {
        console.log(errorRes);
    });

    $http.get('/refs').then(function(res) {
        localStorage.setItem('refs', JSON.stringify(res.data));
        ActiveList.setRefs(res.data);
    }, function(errorRes) {
        console.log(errorRes);
    });

    /*var localStorageLists = localStorage.getItem('lists');
    var localStorageListItems = localStorage.getItem('listItems');

    var getLists = new XMLHttpRequest();
    var getListItems = new XMLHttpRequest();

    getLists.onreadystatechange = function() {

        if (getLists.readyState == 4 && getLists.status == 200) {

            var data = JSON.parse(getLists.responseText);
            localStorage.setItem('lists', JSON.stringify(data));
            ActiveList.setLists(data);
            console.log("lists added to storage");
        }
    };

    getListItems.onreadystatechange = function() {
        if (getListItems.readyState == 4 && getListItems.status == 200) {

            var data = JSON.parse(getListItems.responseText);
            localStorage.setItem('listItems', JSON.stringify(data));
            ActiveList.setListItems(data);
            console.log("listItems added to storage");
        }
    };

    if(localStorageLists) {
        ActiveList.setLists(JSON.parse(localStorageLists));
        getLists.open("GET", window.location.origin + "/getLists", true);
        getLists.send();

    } else {
        getLists.open("GET", window.location.origin + "/getLists", true);
        getLists.send();
    }

    if(localStorageListItems) {
        ActiveList.setListItems(JSON.parse(localStorageListItems));
        getListItems.open("GET", window.location.origin + "/getListItems", true);
        getListItems.send();

    } else {
        getListItems.open("GET", window.location.origin + "/getListItems", true);
        getListItems.send();
    }*/

    $scope.users = ["timon"];

}]);
