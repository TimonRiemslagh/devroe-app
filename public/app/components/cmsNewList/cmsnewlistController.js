mainApp.controller('CmsNewListController', function($scope) {

    $('ul.nav li').removeClass('active');
    $('.cms').addClass("active");

    console.log(activeList.listItemsData.titles);

    $scope.links = [];

    $scope.listItems = [];

    $scope.listItem = "";
    $scope.linkItem = "";

    $scope.addLink = function() {
    };

    $scope.addItem = function() {
    };

    var substringMatcher = function(strs) {
        return function findMatches(q, cb) {
            var matches, substringRegex;

            // an array that will be populated with substring matches
            matches = [];

            // regex used to determine if a string contains the substring `q`
            substringRegex = new RegExp(q, 'i');

            // iterate through the pool of strings and for any string that
            // contains the substring `q`, add it to the `matches` array
            $.each(strs, function(i, str) {
                if (substringRegex.test(str)) {
                    matches.push(str);
                }
            });

            cb(matches);
        };
    };

    if(activeList) {

        $('.typeahead').typeahead({
                hint: false,
                highlight: true,
                minLength: 2
            },
            {
                name: 'listItems',
                source: substringMatcher(activeList.listItemsData.titles)
            });

    }



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

});
