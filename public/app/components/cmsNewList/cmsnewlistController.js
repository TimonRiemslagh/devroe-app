mainApp.controller('CmsNewListController', ['$scope', 'ActiveList', '$filter', '$http', function($scope, ActiveList, $filter, $http) {
    //$('ul.nav li').removeClass('active');
    //$('.cms').addClass("active");

    //$scope.activeListItems = ActiveList.activeList.listItems.titles;
    $scope.activeLists = ActiveList.lists.titles;

    //$scope.links = [{title: "test 1", valid: true, image: "test.jpg", customStyle: {'background-color': '#dff0d8'}, editMode: false},{title: "test 2", image: "test.jpg", valid: false, customStyle: {'background-color': '#d9edf7'}, editMode: true}];

    //$scope.links = [];

    //$scope.listItems = [{title: "test 1", valid: true, image: "test.jpg", link: "test link", customStyle: {'background-color': '#dff0d8'}, editMode: false},{title: "test 2", image: "test.jpg", valid: false, customStyle: {'background-color': '#d9edf7'}, editMode: true}];

    $scope.listItems = [];

    /*$scope.addLink = function() {

        $scope.checkingLinkItem = true;
        socket.emit('validateItem', {listItem: $scope.selectedLinkItem, type: "link"});

    };*/

    /*$scope.newListItemImageElement = {
        data: "",
        file: {
            name: ""
        }//, filename: ""
    };*/

    $scope.newListItemImageElement = {
        file: {},
        data: ""
    };

    $scope.addListItem = function() {

        $scope.showAlert = false;
        $scope.checkingList = false;

        /*console.log($scope.newListItemTitle);
        console.log($scope.newListItemLink);
        console.log($scope.newListItemImageElement.file);*/

        if($scope.newListItemTitle) {

            $scope.checkingList = true;

            $http.get('/lists/' + $scope.newListItemLink).then(function(res) {

                if(res.data.validList) {
                    $scope.listItems.push({title: $scope.newListItemTitle, image: $scope.newListItemImageElement.file, filename: $scope.newListItemImageElement.file.name, link: $scope.newListItemLink, editMode: false });

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

            }, function(errorRes) {
                console.log(errorRes);
            });

        } else {
            $scope.showAlert = true;
            $scope.checkingList = false;
        }

        //$scope.listItems.push({ title: $scope.newListItem, link: ""});

        /*$scope.checkingItem = true;
        socket.emit('validateItem', {listItem: $scope.selectedItem, type: "item"});*/
    };

    $scope.updateListItem = function(item) {

        item.editMode = true;

        if(item.title) {

            item.checkingList = true;
            item.showAlert = false;

            $http.get('/lists/' + item.link).then(function(res) {

                if(res.data.validList) {

                    $scope.listItems.forEach(function(listItem) {

                        if(listItem.title == item.oldTitle) {
                            listItem.title = item.title;
                            listItem.image = item.image;
                            console.log(listItem.image, item.image.name);
                            listItem.filename = item.image.name;
                            listItem.link = item.link;
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
            item.showAlert = true;
            item.checkingList = false;
        }
    };



    /*socket.on('listValidated', function(response) {

        $scope.$apply(function() {

            $scope.listItems.forEach(function(listItem) {

                if(listItem.item == response.item.item) {

                    listItem.linkIsValid = response.response.valid;

                    if(response.response.valid) {

                        listItem.linkTitleCustomStyle = {'background-color': '#dff0d8'};

                        listItem.link = response.response.list._id;

                    } else {

                        listItem.linkTitleCustomStyle = {'background-color': '#f2dee1'};

                    }

                }

            });

        });*/

        /*$scope.$apply(function() {

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

    });*/

    $scope.toggleEdit = function(item) {

        item.oldTitle = item.title;
        item.editMode = !item.editMode;

    };

    $scope.remove = function(item) {

        console.log("removed");

        /*if(type == 'link') {
            $scope.links =  $filter('filter')($scope.links, {title: item.item});
        }

        if(type == 'item') {
            $scope.items =  $filter('filter')($scope.items, {title: item.item});
        }*/

        for(var t = $scope.listItems.length-1; t >= 0; t--) {
            if($scope.listItems[t].title == item.title) {
                $scope.listItems.splice(t,1);
            }
        }

    };

    /*$scope.changeBackground = function(item) {
        if(item.valid) {
            item.customStyle = {'background-color': '#fcf8e3'};
        }

        item.editNotValid = false;
    };

    $scope.resetBackground = function(item) {
        item.linkTitleCustomStyle = {'background-color': 'white'};

        if(item.valid) {
            item.customStyle = {'background-color': '#fcf8e3'};
        }

        item.editNotValid = false;
    };*/

    /*socket.on('itemValidated', function(response) {

        $scope.$apply(function() {

                if(response.type == 'link') {

                    if(response.res.valid) {

                        response.valid = true;
                        response.customStyle = {'background-color': '#dff0d8'};
                        $scope.links.push(response);

                    } else {

                        //unvalid list

                    }
                }

                if(response.type == 'item') {

                    console.log(response);

                    if (response.res.valid) {

                        response.valid = true;
                        response.customStyle = {'background-color': '#dff0d8'};
                        response.imageElement = {
                            data: "",
                            file: {
                                name: ""
                            },
                            changed: false,
                            filename: ""
                        };
                        response.linkTitleCustomStyle = {'background-color': '#dff0d8'};
                        response.editNotValid = true;
                        response.imageElement.file.name = response.filename;
                        response.linkIsValid = true;
                        $scope.listItems.push(response);

                        console.log(response);

                    } else {

                        var newElement = {};

                        newElement.item = response.item;
                        newElement.valid = false;
                        newElement.customStyle = {'background-color': '#d9edf7'}; //#fcf8e3
                        newElement.editMode = true;
                        newElement.imageElement = {
                            data: "",
                            file: {
                                name: ""
                            },
                            changed: false,
                            filename: ""
                        };

                        $scope.listItems.push(newElement);

                    }
                }

            $scope.checkingItem = false;
            $scope.checkingLinkItem = false;

        });

    });*/

    /*$scope.$on('listItems.update', function(event) {
        console.log("listItemsupdated");
        $scope.activeListItems = ActiveList.activeList.listItems.titles;
    });*/

    $scope.$on('lists.update', function(event) {
        console.log("listsupdated");
        $scope.activeLists = ActiveList.lists.titles;
    });

    $scope.saveList = function() {

        $scope.listSaveBusy = true;

        socket.emit('saveList', {title: $scope.listTitle, items: $scope.listItems});


        
        //socket.emit('saveList', {links: $scope.links, title: $scope.listTitle, listItems: $scope.listItems});

        /*console.log($scope.listTitle);
        console.log($scope.links);
        console.log($scope.listItems);*/

    };
    
    socket.on('listSaved', function() {

        $scope.$apply(function(){

            $scope.listSaveBusy = false;

        });

    });

    socket.on('listNotSaved', function(err) {

        console.log("list save fail", err);

    });


    /*$scope.listItems = [{id: 0, text: "", isBusy: false, isValid: false, style: {'background-color': 'white'}}];

    $scope.listLink = {text: "", isBusy: false, isValid: false, style: {'background-color': 'white'}};

    $scope.resetCheck = function(index) {
        $scope.listItems[index].isValid = false;
        $scope.listItems[index].style = {'background-color': 'white'};
    };

    $scope.resetCheckLink = function() {
        $scope.listLink.isValid = false;
        $scope.listLink.style = {'background-color': 'white'};
    };

    $scope.saveList = function() {

        var allValid = true;
        var listItems = [];

        $scope.listItems.forEach(function(listItem) {
            if(!listItem.isValid) {
                allValid = false;
            }

            listItems.push(listItem.oid);
        });

        if(!$scope.listLink.isValid) {
            allValid = false;
        }

        if(allValid) {

            socket.emit("saveList", { items: listItems, link: $scope.listLink.oid, title: $scope.listTitle });

        }

    };

    $scope.checkListItem = function(index) {
        $scope.listItems[index].isBusy = true;
        socket.emit('validateListItem', {index: index, text: $scope.listItems[index].text});
    };

    $scope.checkListLink = function() {

        if($scope.listLink.text) {
            $scope.listLink.isBusy = true;
            socket.emit('validateListItem', {text: $scope.listLink.text});
        }

    };

    socket.on('validation', function(data) {

        $scope.$apply(function () {

            if(data.index == undefined) {

                if (data.validated) {

                    $scope.listLink.isValid = true;
                    $scope.listLink.style = {'background-color': '#dff0d8'};
                    $scope.listLink.oid = data.oid;

                } else {

                    $scope.listLink.style = {'background-color': '#f2dede'};

                }

                $scope.listLink.isBusy = false;

            } else {

                if (data.validated) {

                    $scope.listItems[data.index].isValid = true;
                    $scope.listItems[data.index].style = {'background-color': '#dff0d8'};
                    $scope.listItems[data.index].oid = data.oid;

                } else {

                    $scope.listItems[data.index].style = {'background-color': '#f2dede'};

                }

                $scope.listItems[data.index].isBusy = false;

            }
        });

    });

    $scope.removeListItem = function(index) {
        $scope.listItems.splice(index, 1);
    };

    var resetDom = function() {

        $scope.listItems = [{id: 0, text: "", isBusy: false, isValid: false, style: {'background-color': 'white'}}];
        $scope.listLink = {text: "", isBusy: false, isValid: false, style: {'background-color': 'white'}};
        $scope.listTitle = "";

    };

    socket.on('saveListFeedback', function(err) {
        $scope.$apply(function () {

            console.log("list saved");

            if (err) {

                $scope.feedbackSave = {
                    done: true,
                    error: err,
                    textFail: "Fout tijdens het opslaan van de lijst.",
                    textSuccess: "",
                    isSuccess: false
                };

            } else {

                resetDom();

                $scope.feedbackSave = {
                    done: true,
                    error: "",
                    textFail: "",
                    textSuccess: "Het opslaan is gelukt!",
                    isSuccess: true
                };

                $('.feedback').delay(3000).fadeOut();

            }
        });

    });

    socket.on('updateLinkFeedback', function(err) {

        $scope.$apply(function () {

            console.log("list linked");

            if (err) {

                $scope.feedbackLink = {
                    done: true,
                    error: err,
                    textFail: "Fout tijdens het maken van de link.",
                    textSuccess: "",
                    isSuccess: false
                };

            } else {

                resetDom();

                $scope.feedbackLink = {
                    done: true,
                    error: "",
                    textFail: "",
                    textSuccess: "Het linken van de lijst is gelukt!",
                    isSuccess: true
                };

                $('.feedback').delay(3000).fadeOut();

            }
        });

    });

    $scope.addNewItem = function() {
        var heighestId = 0;

        $scope.listItems.forEach(function(listItem) {
            if(listItem.id > heighestId) {
                heighestId = listItem.id;
            }
        });

        var newId = heighestId+1;

        $scope.listItems.push({id: newId, text: "", isBusy: false, isValid: false, style: {'background-color': 'white'}});
    };*/

    // typeahead

}]);
