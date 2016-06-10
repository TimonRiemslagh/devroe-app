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
            socket.emit('saveListItem', {title: $scope.listItem.text, photo: $scope.imageElement.file, photoUrl: $scope.imageElement.name, link: $scope.listId });

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

            } else {
                $scope.customStyle = {'background-color': '#F2DEE1'};
            }

        });

    });

    socket.on('saveListItemFeedback', function(data) {

        $scope.$apply(function() {
            if (data.err) {
                $scope.err = data.err;
            } else {
                ActiveList.addListItem(data.doc.ops[0]);
                var localStor = JSON.parse(localStorage.getItem('listItems'));
                localStor.titles.push(data.doc.ops[0].title);
                localStor.items.push(data.doc.ops[0]);
                localStorage.setItem('listItems', JSON.stringify(localStor));

                $scope.saveSuccess = true;
                $('.newListItemAlertSuccess').fadeIn().delay(3000).fadeOut();
                $scope.listItem = {};
                $scope.imageElement = { data: null, file: null };
                console.log($scope.imageElement);
                $scope.customStyle = {'background-color': 'white'};
                $scope.selectedLinkItem = "";

                angular.forEach(
                    angular.element("input[type='file']"),
                    function(inputElem) {
                        angular.element(inputElem).val(null);
                    });

            }

            $scope.isBusy = false;
        });
    });
}]);
