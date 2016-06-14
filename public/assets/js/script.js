var socket = io.connect();
var lists = [];
var activeList = {};

/*socket.on('saveSuccess', function() {
    $('.spinner').hide();
    $('.saveSurveyButton').prop('disabled', false);
    $('.tableHeader .alert-success').fadeIn().delay(3000).fadeOut();
});*/

/*$(document).ready(function() {
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
    });*/
//});
