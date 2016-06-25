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

                console.log(list);

                if(list.id == 0) { //this is the root list
                    $scope.root = true;
                } else {
                    $scope.root = false;
                }

                $scope.listTitle = list.title;
                $scope.listItems = list.items;

                //if image is set of item, leave image field "" and show url, otherwise dont show url

            }
        });
        
    }

    $scope.addAlert = function(alert, type) {
        if(type == "success") {
            $scope.alertsSuccess.push(alert);
        } else if(type == "fail") {
            $scope.alertsFail.push(alert);
        }
    };

    $scope.closeAlert = function(index, type) {
        console.log(type);

        if(type == "success") {
            $scope.alertsSuccess.splice(index, 1);
        } else if(type == "fail") {
            $scope.alertsFail.splice(index, 1);
        }
    };

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

            /*if(item.link) {
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
            }*/

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
        xhr.onreadystatechange = () => {
            if(xhr.readyState === 4){
                if(xhr.status === 200){
                    $scope.addAlert(file.name + " opgeslaan.", "success");
                }
                else{
                    $scope.addAlert(file.name + " niet opgeslaan.", "fail");
                }
            }
        };
        xhr.send(file);
    }

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

        $scope.listSaveBusy = true;

        $scope.listItems.forEach(function(item) {

            if(item.image) {
                getSignedRequest(item.image);
                item.imageUrl = imageDomain + item.image.name;
            } else {
                item.imageUrl = "";
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

                $scope.activeLists = ActiveList.lists.titles;

                $location.path('/cms/cmsLists/cmsNewList/' + res.data.doc._id);

            } else {
                console.log('error save list');
            }

        }, function(errorRes) {
            console.log(errorRes);
        });

    };

}]);
