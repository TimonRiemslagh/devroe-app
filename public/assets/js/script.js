var socket = io.connect();
var lists = [];

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
});
