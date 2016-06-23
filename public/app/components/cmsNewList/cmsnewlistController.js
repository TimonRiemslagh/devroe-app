mainApp.controller('CmsNewListController', ['$scope', 'ActiveList', '$filter', '$http', '$routeParams', '$location', function($scope, ActiveList, $filter, $http, $routeParams, $location) {
    $scope.activeLists = ActiveList.lists.titles;
    $scope.listItems = [];

    if($routeParams.listId) {

        ActiveList.lists.items.forEach(function(list) {
            if(list._id == $routeParams.listId) {

                $scope.currentList = list;

                console.log(list);

                if(list.id == 0) { //this is the root list
                    $scope.root = true;
                }

                $scope.listTitle = list.title;
                $scope.listItems = list.items;

            }
        });
        
    }

    $scope.newListItemImageElement = {
        file: {},
        data: ""
    };

    $scope.addListItem = function() {

        $scope.showAlert = false;
        $scope.checkingList = false;

        if($scope.newListItemTitle) {

            $scope.checkingList = true;

            $http.get('/lists/' + $scope.newListItemLink).then(function(res) {

                //if($scope.newListItemLink) {
                    if(res.data.validList) {
                        $scope.listItems.push({title: $scope.newListItemTitle, imageObj: $scope.newListItemImageElement, image: $scope.newListItemImageElement.file, filename: $scope.newListItemImageElement.file.name, link: $scope.newListItemLink, linkUrl: res.data.doc._id, editMode: false });

                        // Reset the form model.
                        $scope.newListItemTitle = "";
                        $scope.newListItemLink = "";
                        $scope.newListItemImageElement = {
                            file: {},
                            data: ""
                        };
                        $scope.addItemForm.$setPristine();
                        $scope.addItemForm.$setUntouched();

                        $('.newImage').val(null);
                        $scope.showAlert = false;
                        $scope.checkingList = false;

                    } else {
                        $scope.showAlert = true;
                        $scope.checkingList = false;
                    }
                //}
                    /*else {

                    $scope.listItems.push({title: $scope.newListItemTitle, image: $scope.newListItemImageElement.file, filename: $scope.newListItemImageElement.file.name, link: "", linkUrl: "", editMode: false });

                    // Reset the form model.
                    $scope.newListItemTitle = "";
                    $scope.newListItemLink = "";
                    $scope.newListItemImageElement = {
                        file: {},
                        data: ""
                    };
                    $scope.addItemForm.$setPristine();
                    $scope.addItemForm.$setUntouched();

                    $('.newImage').val(null);
                    $scope.showAlert = false;
                    $scope.checkingList = false;

                }*/

            }, function(errorRes) {
                console.log(errorRes);
            });

        } else {
            $scope.showAlert = true;
            $scope.checkingList = false;
        }
    };

    $scope.updateListItem = function(item) {

        console.log(item);

        item.editMode = true;

        if(item.title) {

            item.checkingList = true;
            item.showAlert = false;

            if(item.link) {
                $http.get('/lists/' + item.link).then(function(res) {

                    if(res.data.validList) {

                        $scope.listItems.forEach(function(listItem) {

                            if(listItem.title == item.oldTitle) {
                                listItem.title = item.title;
                                listItem.imageObj = item.image;
                                if(item.image) {
                                    listItem.image = item.image.file;
                                    listItem.filename = item.image.file.name;
                                }
                                listItem.link = item.link;
                                listItem.linkUrl = res.data.doc._id;
                            }

                        });

                        item.showAlert = false;
                        item.checkingList = false;
                        item.editMode = false;

                    } else {
                        item.showAlert = true;
                        item.checkingList = false;
                    }

                }, function(errorRes) {
                    console.log(errorRes);
                });
            } else {
                $scope.listItems.forEach(function(listItem) {

                    if(listItem.title == item.oldTitle) {
                        listItem.title = item.title;
                        listItem.image = item.image;
                        if(item.image) {
                            listItem.filename = item.image.name;
                        }
                        listItem.link = item.link;
                        listItem.linkUrl = "";
                    }
                });

                item.showAlert = false;
                item.checkingList = false;
                item.editMode = false;
            }

        } else {
            item.showAlert = true;
            item.checkingList = false;
        }
    };

    $scope.routeList = function(listId) {

        console.log(listId);

        $location.path('/cms/cmsLists/cmsNewList/' + listId);

    };

    $scope.toggleEdit = function(item) {

        item.oldTitle = item.title;
        item.editMode = !item.editMode;

    };

    $scope.remove = function(item) {

        var r = confirm("\"" + item.title + "\" voorgoed verwijderen?");
        if (r == true) {
            for(var t = $scope.listItems.length-1; t >= 0; t--) {
                if($scope.listItems[t].title == item.title) {
                    $scope.listItems.splice(t,1);
                }
            }
        }

    };

    $scope.saveList = function() {

        $scope.listSaveBusy = true;

        if($routeParams.listId) {

            socket.emit('saveList', {title: $scope.listTitle, items: $scope.listItems, root: $scope.root, id: $routeParams.listId});

        } else {
            socket.emit('saveList', {title: $scope.listTitle, items: $scope.listItems, root: $scope.root});
        }

    };
    
    socket.on('listSaved', function(data) {
        console.log(data);

        var localStorageLists = JSON.parse(localStorage.getItem('lists'));

        $scope.$apply(function(){

            if(data.updatedExisting) {

                if($scope.currentList) {
                    for(var t = 0; t < ActiveList.lists.items.length; t++) {
                        if(ActiveList.lists.items[t].title == $scope.currentList.title) {
                            ActiveList.lists.items[t] = data.doc;
                        }
                    }

                    for(var i = 0; t < ActiveList.lists.titles.length; t++) {
                        if(ActiveList.lists.items[i] == $scope.currentList.title) {
                            ActiveList.lists.items[i] = data.doc.title;
                        }
                    }

                    for(var c = 0; t < localStorageLists.items.length; t++) {
                        if(localStorageLists.items[c].title == $scope.currentList.title) {
                            localStorageLists.items[c] = data.doc;
                        }
                    }

                    for(var d = 0; t < localStorageLists.titles.length; t++) {
                        if(localStorageLists.titles[d] == $scope.currentList.title) {
                            localStorageLists.titles[d] = data.doc.title;
                        }
                    }

                    localStorage.setItem('lists', JSON.stringify(localStorageLists));
                    $scope.activeLists = ActiveList.lists.titles;

                } else {

                    for(var l = 0; l < ActiveList.lists.items.length; l++) {
                        if(ActiveList.lists.items[l].title == data.doc.title) {
                            ActiveList.lists.items[l] = data.doc;
                        }
                    }

                    for(var x = 0; x < localStorageLists.items.length; x++) {
                        if(localStorageLists.items[x].title == data.doc.title) {
                            localStorageLists.items[x] = data.doc;
                        }
                    }

                    localStorage.setItem('lists', JSON.stringify(localStorageLists));

                }
                $scope.listSaveBusy = false;


            } else {

                ActiveList.addList(data.doc);

                localStorageLists.items.push(data.doc);
                localStorageLists.titles.push(data.doc.title);

                localStorage.setItem('lists', JSON.stringify(localStorageLists));

                $scope.activeLists = ActiveList.lists.titles;

                $scope.listSaveBusy = false;
                $scope.newListItemTitle = "";
                $scope.listTitle = "";
                $scope.listItems = [];

            }

        });

    });

    socket.on('listNotSaved', function(err) {

        console.log("list save fail", err);

    });

}]);
