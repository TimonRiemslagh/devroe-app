mainApp.controller('CmsNewListController', function($scope, $compile) {

    $('ul.nav li').removeClass('active');
    $('.cms').addClass("active");

    var listItems = [];
    var photos = [];
    var listTitle = "";
    var externalLink = "";

    $scope.listItems = [{id: 0, text: "", isBusy: false, isValidated: false, style: {'background-color': 'white'}}];

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

    $scope.checkListItem = function(index) {
        $scope.listItems[index].isBusy = true;
        socket.emit('validateListItem', {index: index, text: $scope.listItems[index].text});
    };

    socket.on('validation', function(data) {

        console.log(data.index);

        if (data.validated) {
            $scope.$apply(function () {
                $scope.listItems[data.index].isValidated = true;
                $scope.listItems[data.index].style = {'background-color': '#dff0d8'};
            });
        }

        if (!data.validated) {
            $scope.$apply(function () {
                $scope.listItems[data.index].style = {'background-color': '#f2dede'};
            });
        }

        $scope.$apply(function () {
            $scope.listItems[data.index].isBusy = false;
        });

    });

    $scope.removeListItem = function(index) {
        $scope.listItems.splice(index, 1);
    };

    socket.on('fileSaveError', function(err) {
        console.log(err);
    });

    socket.on('saveComplete', function() {
        console.log('saved');
        //socket.emit('saveList', )
    });

    $scope.addNewItem = function() {
        var heighestId = 0;

        $scope.listItems.forEach(function(listItem) {
            if(listItem.id > heighestId) {
                heighestId = listItem.id;
            }
        });

        var newId = heighestId+1;

        $scope.listItems.push({id: newId, text: "", isBusy: false, isValidated: false, style: {'background-color': 'white'}});
    };
});
