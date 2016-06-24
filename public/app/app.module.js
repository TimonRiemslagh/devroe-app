var mainApp = angular.module('mainApp', ['ngRoute', 'ui.bootstrap', 'bootstrapLightbox', 'ngTouch']);

mainApp.service( 'ActiveList', [ '$rootScope', function( $rootScope ) {

    var service = {

        lists: {}, //items [] titles []
        refs: [],
        surveys: [],

        setRefs: function (refs) {
            service.refs = refs;
            $rootScope.$broadcast( 'refs.update' );
        },

        setLists: function (lists) {
            service.lists = lists;
            $rootScope.$broadcast( 'lists.update' );
        },

        setSurveys: function (survey) {
            service.surveys = survey;
            $rootScope.$broadcast( 'surveys.update' );
        },

        addRef: function(ref) {
            service.refs.unshift(ref);

            var localStorageRefs = JSON.parse(localStorage.getItem('refs'));
            localStorageRefs.unshift(res.data.doc);
            localStorage.setItem('refs', JSON.stringify(localStorageRefs));
            
            $rootScope.$broadcast( 'refs.update' );
        },

        addList: function(list) {
            service.lists.items.push( list );
            service.lists.titles.push(list.title);
            $rootScope.$broadcast( 'lists.update' );
        },

        addSurvey: function(survey) {
            service.surveys.unshift( survey );
            $rootScope.$broadcast( 'survey.update' );
        },

        removeList: function(list) {

            for(var t = service.lists.items.length-1; t >= 0; t--) {
                if(service.lists.items[t].title == list) {
                    service.lists.items.splice(t,1);
                }
            }

            for(var i = service.lists.titles.length-1; i >= 0; i--) {
                if(service.lists.titles[i] == list) {
                    service.lists.titles.splice(i,1);
                }
            }

            $rootScope.$broadcast( 'list.delete' );

        },

        removeRef: function(refId) {

            for(var t = service.refs.length-1; t >= 0; t--) {
                if(service.refs[t]._id == refId) {
                    service.refs.splice(t,1);
                }
            }

            $rootScope.$broadcast( 'refs.delete' );

        },

        updateRef: function(ref) {

            for(var t = 0; t < service.refs.length; t++) {
                if(service.refs[t]._id == ref._id) {
                    service.refs[t] = ref;
                }
            }

            var localStorageRefs = JSON.parse(localStorage.getItem('refs'));

            for(var l = 0; l < localStorageRefs.length; l++) {
                if(localStorageRefs[l]._id == ref._id) {
                    localStorageRefs[l] = ref;
                }
            }

            localStorage.setItem('refs', JSON.stringify(localStorageRefs));

        }
    };

    return service;
}]);

mainApp.controller('indexController', ['$scope', '$http', 'ActiveList', '$location', function($scope, $http, ActiveList, $location) {

    var localStorageLists = localStorage.getItem('lists');
    var localStorageRefs = localStorage.getItem('refs');
    var localStorageSurveys = localStorage.getItem('surveys');

    if(localStorageLists) {
        ActiveList.setLists(JSON.parse(localStorageLists));
    }

    if(localStorageRefs) {
        ActiveList.setRefs(JSON.parse(localStorageRefs));
    }

    if(localStorageSurveys) {
        ActiveList.setSurveys(JSON.parse(localStorageSurveys));
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

    $http.get('/surveys').then(function(res) {
        localStorage.setItem('surveys', JSON.stringify(res.data));
        ActiveList.setSurveys(res.data);
    }, function(errorRes) {
        console.log(errorRes);
    });

    $scope.users = ["timon"];

    $scope.isActiveLink = function(viewLocation) {
        return $location.path().indexOf(viewLocation) == 0;
    }

}]);
