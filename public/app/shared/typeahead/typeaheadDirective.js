mainApp.directive( "typeAhead", [ 'Book', function( Book ) {
    return {
        restrict: "A",
        link: function( scope, element, attrs ) {
            element.bind( "click", function() {
                Book.addBook( { title: "Star Wars", author: "George Lucas" } );
            });
        }
    }
}]);