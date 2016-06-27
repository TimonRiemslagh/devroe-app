mainApp.controller('CmsNewListController', ['$scope', 'ActiveList', '$filter', '$http', '$routeParams', '$location', function($scope, ActiveList, $filter, $http, $routeParams, $location) {
    $scope.activeLists = ActiveList.lists;
    $scope.listItems = [];
    $scope.alertsSuccess = [];
    $scope.alertsFail = [];
    $scope.root = false;

    var listItemId = 0;

    if($routeParams.listId) {
        ActiveList.lists.forEach(function(list) {
            if(list._id == $routeParams.listId) {
                $scope.currentList = list;
                $scope.root = list.root;
                $scope.listTitle = list.title;
                $scope.listItems = list.items;
            }
        });
    }

    $scope.up = function(item) {
        for(var t = 0; t < $scope.listItems.length; t++) {
            if($scope.listItems[t].listItemId == item.listItemId-1) {
                $scope.listItems[t].listItemId++;
                item.listItemId--;
                break;
            }
        }
    };

    $scope.down = function(item) {
        for(var t = 0; t < $scope.listItems.length; t++) {
            if($scope.listItems[t].listItemId == item.listItemId+1) {
                console.log('test');
                $scope.listItems[t].listItemId--;
                item.listItemId++;
                break;
            }
        }
    };

    $scope.addAlert = function(alert, type) {
        if(type == "success") {
            $scope.alertsSuccess.push(alert);
        } else if(type == "fail") {
            $scope.alertsFail.push(alert);
        }
    };

    $scope.closeAlert = function(index, type) {
        if(type == "success") {
            $scope.alertsSuccess.splice(index, 1);
        } else if(type == "fail") {
            $scope.alertsFail.splice(index, 1);
        }
    };


    $scope.addListItem = function() {

        $scope.showAlert = false;
        $scope.checkingList = false;

        if($scope.newListItemTitle) {

            $scope.checkingList = true;

            $http.get('/lists/' + $scope.newListItemLink).then(function(res) {

                if(res.data.validList) {

                    var image = $('.newImage')[0].files[0];

                    if(image) {
                        $scope.listItems.push({listItemId: listItemId, title: $scope.newListItemTitle, image: image, imageName: image.name, link: $scope.newListItemLink, linkUrl: res.data.doc._id, editMode: false });
                    } else {
                        $scope.listItems.push({listItemId: listItemId, title: $scope.newListItemTitle, image: "", imageName: "", link: $scope.newListItemLink, linkUrl: res.data.doc._id, editMode: false });
                    }

                    listItemId++;

                    // Reset the form model.
                    $scope.newListItemTitle = "";
                    $scope.newListItemLink = "";

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
    };

    $scope.updateListItem = function(item) {

        var image = $("#" + item.listItemId)[0].files[0];

        item.editMode = true;

        if(item.title) {

            item.checkingList = true;
            item.showAlert = false;

            $http.get('/lists/' + item.link).then(function(res) {

                if(res.data.validList) {

                    $scope.listItems.forEach(function(listItem) {

                        if(listItem.listItemId == item.listItemId) {
                            listItem.title = item.title;
                            if(image) {
                                listItem.image = image;
                                listItem.imageName = image.name;
                                listItem.imageUrl = imageDomain + image.name;
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
            item.showAlert = true;
            item.checkingList = false;
        }
    };



    $scope.routeList = function(listId) {
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

    function uploadFile(file, signedRequest, url){
        const xhr = new XMLHttpRequest();

        xhr.open('PUT', signedRequest);
        /*
        xhr.onreadystatechange = () => {
            if(xhr.readyState === 4){
                $scope.$apply(function() {
                    if(xhr.status === 200){
                        $scope.addAlert(file.name + " opgeslaan.", "success");
                    }
                    else{
                        $scope.addAlert(file.name + " niet opgeslaan.", "fail");
                    }
                });
            }
        };
        xhr.send(file);*/
    }

    alert('test 10');/*

    function getSignedRequest(file){
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `/sign-s3?file-name=${file.name}&file-type=${file.type}`);
        xhr.onreadystatechange = () => {
            if(xhr.readyState === 4){
                if(xhr.status === 200){
                    const response = JSON.parse(xhr.responseText);
                    uploadFile(file, response.signedRequest, response.url);
                }
                else{
                    alert('Could not get signed URL.');
                }
            }
        };
        xhr.send();
    }



    $scope.saveList = function() {

        console.log($scope.listItems);

        $scope.listSaveBusy = true;

        $scope.listItems.forEach(function(item) {

            if(item.image) {
                getSignedRequest(item.image);
                item.imageUrl = imageDomain + item.image.name;
            }

            item.image = "";

        });

        if($scope.currentList) {
            postList({id: $scope.currentList._id, title: $scope.listTitle, items: $scope.listItems, root: $scope.root});
        } else {
            postList({title: $scope.listTitle, items: $scope.listItems, root: $scope.root});
        }
    };

    var postList = function(data) {

        $http.post('/list', data).then(function(res) {

            $scope.listSaveBusy = false;

            if(res.data.success) {

                if(res.data.updated) {
                    ActiveList.updateList(res.data.doc);
                } else {
                    ActiveList.addList(res.data.doc);
                }

                $scope.activeLists = ActiveList.lists;

                $location.path('/cms/cmsLists/cmsNewList/' + res.data.doc._id);

            } else {
                console.log('error save list');
            }

        }, function(errorRes) {
            console.log(errorRes);
        });

    };*/

}]);
