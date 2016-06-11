mainApp.controller('CmsNewListItemController', ['$scope', 'ActiveList', function($scope, ActiveList) {

    //$('ul.nav li').removeClass('active');
    //$('.cms').addClass("active");

    $scope.activeLists = ActiveList.activeList.lists.titles;

    $scope.listItem = {};
    $scope.isBusy = false;
    $scope.saveSuccess = false;
    $scope.listValidated = false;
    $scope.showAlert = false;

    $scope.imageElement = {
        data: "",
        file: ""
    };

    $scope.checkList = function() {
        $scope.checking = true;
        socket.emit('validateList', $scope.selectedLinkItem);
    };

    $scope.saveListItem = function() {

        if($scope.listItem.text && $scope.imageElement.file && $scope.listValidated) {

            $scope.isBusy = true;
            socket.emit('saveListItem', {title: $scope.listItem.text, photo: $scope.imageElement.file, photoUrl: $scope.imageElement.file.name, link: $scope.listId, listTitle: $scope.listLinkTitle });

        } else {
            $('.newListItemSaveWarn').fadeIn().delay(3000).fadeOut();
        }
    };

    socket.on('listValidated', function(response) {

        $scope.$apply(function() {

            $scope.checking = false;

            if(response.valid) {
                $scope.listValidated = true;
                $scope.listId = response.list._id;
                $scope.customStyle = {'background-color': '#dff0d8'};
                $scope.listLinkTitle = response.list.title;
            } else {
                $scope.customStyle = {'background-color': '#F2DEE1'};
            }

        });

    });

    socket.on('saveListItemFeedback', function(data) {

        console.log(data);

        $scope.$apply(function() {
            if (data.err) {
                $scope.err = data.err;
            } else {

                if(data) {

                    var localStor = JSON.parse(localStorage.getItem('listItems'));

                    if(data.doc.lastErrorObject.updatedExisting) {

                        console.log("test");

                        ActiveList.updateListItem(data.original);

                        for(var t = 0; t < localStor.items.length; t++) {
                            if(localStor.items[t].title == data.original.title) {
                                console.log("found", localStor.items[t]);
                                localStor.items[t] = data.original;
                                console.log("updated", localStor.items[t]);
                            }
                        }

                        localStorage.setItem('listItems', JSON.stringify(localStor));

                    } else {

                        ActiveList.addListItem(data.doc, data.doc.value.title); //+ " (" + data.doc.value.link.title + ")"
                        var localStor = JSON.parse(localStorage.getItem('listItems'));
                        localStor.titles.push(data.doc.value.title); //" (" + data.doc.value.link.title + ")"
                        localStor.items.push(data.doc.value);

                        localStorage.setItem('listItems', JSON.stringify(localStor));

                    }

                    $scope.saveSuccess = true;
                    $('.newListItemAlertSuccess').fadeIn().delay(3000).fadeOut();
                    $scope.listItem = {};
                    $scope.imageElement = { data: null, file: null };
                    $scope.customStyle = {'background-color': 'white'};
                    $scope.selectedLinkItem = "";
                    document.getElementById('imageInput').value = null;

                }

            }

            $scope.isBusy = false;
        });
    });

    $scope.$on('lists.update', function(event) {
        console.log("lists updated");

        $scope.activeLists = ActiveList.activeList.lists.titles;
    });
}]);
