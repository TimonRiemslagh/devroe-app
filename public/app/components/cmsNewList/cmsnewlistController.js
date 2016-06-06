mainApp.controller('CmsNewListController', function($scope, $compile) {

    $('ul.nav li').removeClass('active');
    $('.cms').addClass("active");

    var listItems = [];
    var photos = [];
    var listTitle = "";
    var externalLink = "";

    $scope.listItems = [0];

    $scope.title = "dit is de cms new list pagina";

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
            item.photoUrl = '/uploads/' + photoData.name;

            listItems.push(item);
            photos.push(photo);

        });

        //socket.emit("saveNewList", { listTitle: listTitle, listItems: listItems, photos: photos, link: externalLink });

    };

    $scope.checkListItem = function($event) {

        var item = $($event.target).parent().siblings('.form-control').val();
        var id = $($event.target).parent().parent().attr('id');
        $('span').hide();

        $('.listItemspinner').show();
        socket.emit('validateListItem', {element: id, item: item});
    };

    socket.on('validation', function(data) {
        var el = $('#' + data.element);

        if(data.validated) {
            el.css('background-color', '#dff0d8');
            el.children('a').children('span.glyphicon-ok').hide();

            $('span.glyphicon-remove').show();

            el.on("input", function() {
                el.css('background-color', 'white');
                $('span').show();
                el.off();
            });

        } else {
            el.css('background-color', '#f2dede');
            $('span').show();
        }

        $('.listItemspinner').hide();
    });

    $scope.removeListItem = function($event) {
        $scope.listItems.pop();
    };

    socket.on('fileSaveError', function(err) {
        console.log(err);
    });

    socket.on('saveComplete', function() {
        console.log('saved');
        //socket.emit('saveList', )
    });

    $scope.addNewItem = function() {
        var count = $scope.listItems.length;
        $scope.listItems.push(count);
    };
});
