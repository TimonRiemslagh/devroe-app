mainApp.controller('CmsNewListItemController', ['$scope', 'ActiveList', function($scope, ActiveList) {

    $('ul.nav li').removeClass('active');
    $('.cms').addClass("active");

    $scope.listItem = {};
    $scope.isBusy = false;
    $scope.saveSuccess = false;
    $scope.listValidated = false;

    var listInput = $('.typeahead');

    listInput.typeahead(
        {
            hint: false,
            highlight: true,
            minLength: 2
        },
        {
            name: 'listItems',
            source: substringMatcher(ActiveList.activeList.lists.titles)
        });

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

            $scope.isBusy = true;
            socket.emit('saveListItem', {title: $scope.listItem.text, photo: $scope.listItem.photo, photoUrl: $scope.listItem.photo.name, link: $scope.listId });

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

    socket.on('saveListItemFeedback', function(data) {

        $scope.$apply(function() {
            if (data.err) {
                $scope.err = data.err;
            } else {

                ActiveList.addListItem(data.doc.value);
                var localStor = JSON.parse(localStorage.getItem('listItems'));
                localStor.titles.push(data.doc.value.title);
                localStor.items.push(data.doc.value);
                localStorage.setItem('listItems', JSON.stringify(localStor));

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
}]);
