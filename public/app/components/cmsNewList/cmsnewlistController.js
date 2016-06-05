mainApp.controller('CmsNewListController', function($scope, $compile) {

    $('ul.nav li').removeClass('active');
    $('.cms').addClass("active");

    var listItems = [];
    var photos = [];
    var listTitle = "";
    var externalLink = "";

    $scope.title = "dit is de cms new list pagina";

    console.log(ObjectId());

    $scope.saveList = function() {

        listItems = [];
        photos = [];

        listTitle = $('.listTitleInput').val();
        externalLink = $('.listLinkItem').val();

        $('.listItems li').each(function() {

            var photoData = $(this).find('.listItemPhoto')[0].files[0];

            var item = {};
            var photo = {};

            photo.data = photoData;
            photo.fileName = photoData.name;

            item.title = $(this).find('.listItemInput').val();
            item.photoUrl = '/uploads/' + photo.name;

            listItems.push(item);
            photos.push(photo);

        });

        socket.emit("saveNewList", { listTitle: listTitle, listItems: listItems, photos: photos, link: externalLink });

    };

    socket.on('fileSaveError', function(err) {
        console.log(err);
    });

    socket.on('saveComplete', function() {
        console.log('saved');
        //socket.emit('saveList', )
    });

    $scope.addNewItem = function() {
        var el = $compile('<li class="list-group-item"><new-list-item></new-list-item></li>')($scope);
        $('.listItems').append( el );
    };
});
