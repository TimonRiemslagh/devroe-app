var socket = io.connect();
var lists = [];
var activeList = {};
activeList.listsData = JSON.parse(localStorage.getItem('lists'));
activeList.listItemsData = JSON.parse(localStorage.getItem('listItems'));

socket.on('connect', function() {
    socket.on('setAllLists', function(data) {
        if (typeof(Storage) !== "undefined") {
            sessionStorage.clear();
            sessionStorage.setItem("lists", JSON.stringify(data.lists));

        }
    });
});

socket.on('saveSuccess', function() {
    $('.spinner').hide();
    $('.saveSurveyButton').prop('disabled', false);
    $('.tableHeader .alert-success').fadeIn().delay(3000).fadeOut();
});

socket.on('saveFailure', function() {
});

$(document).ready(function() {
    $('a').on('click', function(e) {
        var selectedLists = sessionStorage.getItem('selectedLists');

        if(selectedLists) {
            if (!confirm('U heeft een lopende opmeting, deze zal verloren gaan.')) {
                e.preventDefault();
                e.stopImmediatePropagation();
                return false;
            } else {
                sessionStorage.setItem('selectedLists', '');
            }
        }
    });

    // get listData
    var getLists = new XMLHttpRequest();
    var url = window.location.origin + "/getLists";

    getLists.onreadystatechange = function() {
        if (getLists.readyState == 4 && getLists.status == 200) {
            var listListsData = JSON.parse(getLists.responseText);
            localStorage.setItem('lists', JSON.stringify(listListsData));
            console.log("lists added to storage");
        }
    };

    getLists.open("GET", url, true);
    getLists.send();

    // get listItems
    var getListItems = new XMLHttpRequest();
    var url = window.location.origin + "/getListItems";

    getListItems.onreadystatechange = function() {
        if (getListItems.readyState == 4 && getListItems.status == 200) {
            var listItemsData = JSON.parse(getListItems.responseText);
            localStorage.setItem('listItems', JSON.stringify(listItemsData));
            console.log('listItems added to storage');
        }
    };

    getListItems.open("GET", url, true);
    getListItems.send();

});
