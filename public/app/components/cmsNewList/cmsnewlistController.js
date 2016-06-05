mainApp.controller('CmsNewListController', function($scope, $compile) {

    $('ul.nav li').removeClass('active');
    $('.cms').addClass("active");

    $scope.title = "dit is de cms new list pagina";

    $scope.saveList = function() {

        var file = document.querySelector('input[type=file]').files[0];

        console.log(file);

    }

    $scope.addNewItem = function() {
        var el = $compile('<li class="list-group-item"><new-list-item></new-list-item></li>')($scope);
        $('.listItems').append( el );
    }
});
