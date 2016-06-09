mainApp.controller('CmsNewListItemController', function($scope, $route) {
    $('ul.nav li').removeClass('active');
    $('.cms').addClass("active");

    $scope.listItem = {};
    $scope.isBusy = false;
    $scope.saveSuccess = false;
    $scope.linkIsInvalid = false;

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

                $('.typeahead').typeahead(
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
        $('.typeahead').typeahead(
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

    $scope.checkList = function() {

        $scope.checking = true;

        socket.emit('validateList', $('.typeahead').val());

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

        $scope.isBusy = true;

        /*$scope.listItem.photo = $('.listItemPhoto')[0].files[0];

        if($scope.listItem.text && $scope.listItem.photo) {
            socket.emit('saveListItem', {title: $scope.listItem.text, photo: $scope.listItem.photo, photoUrl: $scope.listItem.photo.name, link: $('.typeahead').val()});
            $scope.isBusy = true;
        } else {
            $('.newListItemSaveWarn').fadeIn().delay(3000).fadeOut();
        }*/

    };



    socket.on('listValidated', function(response) {

        $scope.$apply(function() {

            $scope.checking = false;

            if(response) {

                $('.typeahead').css('background-color', '#dff0d8');

            } else {

                $('.typeahead').css('background-color', '#F2DEE1');

            }

        });

    });

    socket.on('saveListItemFeedback', function(err) {

        if(err) {
            $scope.$apply(function() {
                $scope.err = err;
            });
        } else {
            $scope.$apply(function() {
                $scope.saveSuccess = true;
            });
            $('.newListItemAlertSuccess').fadeIn().delay(3000).fadeOut();
            $scope.listItem = {};
            $('.listItemPhoto').val("");
            $('.typeahead').val("");
            $('.preview').hide();
        }

        $scope.$apply(function() {
            $scope.isBusy = false;
        });
    });

});
