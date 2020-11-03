// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

//Below variables are related to when a user clicks on a food item to add
//to an order. These lists are used to store the main item the user has selected,
//along with any extra smay they wish to add on. If a user is happy with the order,
//upon confirmation the modal order will be added to the main food order. 

var modalItems = [];
var modalCats = [];
var modalPrices = [];
var itemName = "";
var totalModalSum;


// Write your Javascript code.
var count = 0;

$('#btnBurger').on('click', function () {
    count += 1;
    $('#burgers').show('slow');
    if (count == 2) {
        $('#burgers').hide('slow');
        count = 0;
    }
});

$('#burgerHide').on('click', function () {
    $('#burgers').hide('slow');
    count = 0;
});

$('#btnPizza').on('click', function () {
    count += 1;
    $('#pizzas').show('slow');
    if (count == 2) {
        $('#pizzas').hide('slow');
        count = 0;
    }
});

$('#pizzaHide').on('click', function () {
    $('#pizzas').hide('slow');
    count = 0;
});

$('#itemSizeTable').on('click', 'tbody tr', function (event) {
    $(this).addClass('highlight').siblings().removeClass('highlight');
});

