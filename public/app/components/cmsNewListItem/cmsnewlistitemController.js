mainApp.controller('CmsNewListItemController', function($scope, $route) {
    $('ul.nav li').removeClass('active');
    $('.cms').addClass("active");

    $scope.listItem = {};
    $scope.isBusy = false;
    $scope.saveSuccess = false;
    $scope.listValidated = false;

    var listInput = $('.typeahead');

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

    if(!activeList.listsData) {
        // get listData
        var getLists = new XMLHttpRequest();
        var url = window.location.origin + "/getLists";

        getLists.onreadystatechange = function() {
            if (getLists.readyState == 4 && getLists.status == 200) {
                var listListsData = JSON.parse(getLists.responseText);
                localStorage.setItem('lists', JSON.stringify(listListsData));

                listInput.typeahead(
                    {
                        hint: false,
                        highlight: true,
                        minLength: 2
                    },
                    {
                        name: 'listItems',
                        source: substringMatcher(listListsData.titles)
                    }
                );
            }
        };

        getLists.open("GET", url, true);
        getLists.send();
    } else {
        listInput.typeahead(
            {
                hint: false,
                highlight: true,
                minLength: 2
            },
            {
                name: 'listItems',
                source: substringMatcher(activeList.listsData.titles)
            }
        );
    }

    listInput.on("input", function() {

        $scope.listValidated = false;

        listInput.css('background-color', 'white');

    });

    $scope.checkList = function() {

        $scope.checking = true;

        socket.emit('validateList', listInput.val());

    };

    $scope.previewPhoto = function() {

        var file = $('input[type=file]')[0].files[0];

        var reader = new FileReader();

        reader.addEventListener("load", function () {
            $('.preview').attr("src", reader.result).show();
        }, false);

        if (file) {
            reader.readAsDataURL(file);
        }
    };

    $scope.saveListItem = function() {
        $scope.listItem.photo = $('.listItemPhoto')[0].files[0];

        if($scope.listItem.text && $scope.listItem.photo && $scope.listValidated) {

            console.log({title: $scope.listItem.text, photo: $scope.listItem.photo, photoUrl: $scope.listItem.photo.name, link: $scope.listId });

            $scope.savedListItem = {title: $scope.listItem.text, photo: $scope.listItem.photo, photoUrl: $scope.listItem.photo.name, link: $scope.listId };

            socket.emit('saveListItem', {title: $scope.listItem.text, photo: $scope.listItem.photo, photoUrl: $scope.listItem.photo.name, link: $scope.listId });
            $scope.isBusy = true;
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

                listInput.css('background-color', '#dff0d8');

            } else {

                listInput.css('background-color', '#F2DEE1');

            }

        });

    });

    socket.on('saveListItemFeedback', function(err) {

        $scope.$apply(function() {

            if (err) {

                $scope.err = err;

            } else {

                // add to active list and localstorage
                activeList.listItemsData.titles.push($scope.savedListItem.title);
                activeList.listItemsData.items.push($scope.savedListItem);
                localStorage.setItem('listItems', JSON.stringify(activeList.listItemsData));

                $scope.saveSuccess = true;
                $('.newListItemAlertSuccess').fadeIn().delay(3000).fadeOut();
                $scope.listItem = {};
                $('.listItemPhoto').val("");
                listInput.val("");
                $('.preview').hide();
                listInput.css('background-color', 'white');



            }

            $scope.isBusy = false;
        });
    });
});
