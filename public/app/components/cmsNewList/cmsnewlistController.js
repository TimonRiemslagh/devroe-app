mainApp.controller('CmsNewListController', ['$scope', 'ActiveList', function($scope, ActiveList) {

    $('ul.nav li').removeClass('active');
    $('.cms').addClass("active");

    console.log(ActiveList.activeList);

    //$scope.links = [{title: "test 1", valid: true, image: "test.jpg", customStyle: {'background-color': '#dff0d8'}, editMode: false},{title: "test 2", image: "test.jpg", valid: false, customStyle: {'background-color': '#d9edf7'}, editMode: true}];

    $scope.links = [];

    //$scope.listItems = [{title: "test 1", valid: true, image: "test.jpg", link: "test link", customStyle: {'background-color': '#dff0d8'}, editMode: false},{title: "test 2", image: "test.jpg", valid: false, customStyle: {'background-color': '#d9edf7'}, editMode: true}];

    $scope.listItems = [];

    $scope.addLink = function() {

        var listItem = $('.linkListItem').val();

        $scope.checkingLinkItem = true;

        socket.emit('validateItem', {listItem: listItem, type: "link"});

    };

    $scope.addItem = function() {
        var listItem = $('.listItemInput').val();

        $scope.checkingItem = true;

        console.log(listItem);

        socket.emit('validateItem', {listItem: listItem, type: "item"});
    };

    $scope.updatePhoto = function(event, type) {



    };

    $scope.toggleEdit = function(item, type) {

        if(type == 'link') {
            $scope.links.forEach(function(i) {

                if(i.title == item.title) {
                    i.editMode = !i.editMode;
                }

            });
        }

        if(type == 'item') {
            $scope.listItems.forEach(function(i) {

                if(i.title == item.title) {
                    i.editMode = !i.editMode;
                }

            });
        }

    };

    $scope.delete = function(item) {

    };

    $scope.remove = function(item, type) {

        if(type == 'link') {
           $scope.links.removeValue('title', item.title);
        }

        if(type == 'item') {
            $scope.listItems.removeValue('title', item.title);
        }

    };

    socket.on('itemValidated', function(response) {

        console.log(response);

        $scope.$apply(function() {

            $scope.checkingLinkItem = false;

                if(response.type == 'link') {

                    if(response.res.valid) {

                        response.res.item.valid = true;
                        response.res.item.customStyle = {'background-color': '#dff0d8'};
                        $scope.links.push(response);

                    } else {

                        //unvalid list

                    }
                }

                if(response.type == 'item') {

                    if (response.res.valid) {

                        response.res.item.valid = true;
                        response.res.item.customStyle = {'background-color': '#dff0d8'};
                        $scope.listItems.push(response);

                    } else {

                        $scope.listItems.push({
                            title: response.item,
                            valid: false,
                            customStyle: {'background-color': '#d9edf7'},
                            editMode: true
                        });

                    }
                }

            $scope.checkingItem = false;
            $scope.checkingLinkItem = false;

        });

    });

    $('.typeahead').typeahead({
            hint: false,
            highlight: true,
            minLength: 2
        },
        {
            name: 'listItems',
            source: substringMatcher(ActiveList.activeList.listItems.titles)
        });

    $('.typeaheadlists').typeahead(
        {
            hint: false,
            highlight: true,
            minLength: 2
        },
        {
            name: 'listItems',
            source: substringMatcher(ActiveList.activeList.lists.titles)
        }
    );



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
