mainApp.config(['$routeProvider', function($routeProvider) {
    $routeProvider.

        when('/references', {
            templateUrl: 'app/components/references/referencesView.html', controller: 'ReferencesController'
        }).

        when('/newsurvey', {
            templateUrl: 'app/components/newSurvey/newsurveyView.html', controller: 'NewSurveyController'
        }).

        when('/newsurvey/list/:listId', {
            templateUrl: 'app/components/lists/listView.html', controller: 'ListsController'
        }).

        when('/allsurveys', {
            templateUrl: 'app/components/allSurveys/allsurveysView.html', controller: 'AllSurveysController'
        }).

        when('/cms', {
            templateUrl: 'app/components/cms/cmsView.html', controller: 'CmsController'
        }).

        when('/cms/cmsLists', {
            templateUrl: 'app/components/cmsLists/cmslistsView.html', controller: 'CmsListsController'
        }).

        when('/cms/cmsLists/cmsNewList', {
            templateUrl: 'app/components/cmsNewList/cmsnewlistView.html', controller: 'CmsNewListController'
        }).

        when('/cms/cmsListItems', {
            templateUrl: 'app/components/cmsListItems/cmslistitemsView.html', controller: 'CmsListItemsController'
        }).

        when('/cms/cmsListItems/cmsNewListItem', {
            templateUrl: 'app/components/cmsNewListItem/cmsnewlistitemView.html', controller: 'CmsNewListItemController'
        }).

        when('/cms/cmsReferences', {
            templateUrl: 'app/components/cmsReferences/cmsreferencesView.html', controller: 'CmsReferencesController'
        }).

        when('/cms/cmsReferences/cmsNewReference', {
            templateUrl: 'app/components/cmsNewReference/cmsnewreferenceView.html', controller: 'CmsNewReferenceController'
        }).

        otherwise({
            redirectTo: '/newsurvey'
        });

}]);
