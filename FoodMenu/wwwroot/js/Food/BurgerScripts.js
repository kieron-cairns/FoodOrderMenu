//All tables that are populated within this script file are populated via SQL queries. See the HomeController
//and DatabaseRepository files for more info

//Burger tables scripts


var BurgerScripts = {


    ConvertDouble: function (price) {
        //Method to
        //Convert the double price variable so that it will show trailing 0's to
        //2 decimal places. With help from https://stackoverflow.com/questions/6134039/format-number-to-always-show-2-decimal-places

        var converted = (Math.round(price * 100) / 100).toFixed(2);

        return converted;

    },

    //Method that will call the GetFoodItems method and pass the relevant table name to the method to load
    //Food items of that category table

    FoodList: function (tble, category) {
        console.log(category);
        $(document).ready(function () {
            $.ajax({
                url: '/Home/GetFoodItems?category=' + category,
                dataType: "json",
                method: 'post',
                success: function (data) {

                    //Below variables are passed into HTML labels so that they can be styled. 

                    tble.DataTable().destroy();
                    tble.DataTable({
                        data: data.html,
                        stateSave: true,
                        order: [],
                        bPaginate: false,
                        bLengthChange: false,
                        bFilter: true,
                        bInfo: false,
                        bAutoWidth: false,

                        "columns": [
                            {
                                //label column
                                "render": function (data, type, full) {
                                    return '<label class="food_label" style="font-size:35px;">' + full.name + '</label>';

                                }

                            },
                            {
                                //Add edit and delete buttons to each row record
                                "render": function (data, type, full) {

                                    return '<label style="font-size:20px;">' + full.description + '</label>';

                                }

                            },
                            {
                                //Add edit and delete buttons to each row record
                                "render": function (data, type, full) {

                                    return '<label class="display-4">' + BurgerScripts.ConvertDouble(full.initPrice) + '</label>';

                                }

                            },
                            {
                                //Add edit and delete buttons to each row record
                                "render": function (data, type, full) {

                                    //TO-DO:


                                    //call modal so that user can specify how many of each FoodItem they would like - also with the options
                                    //of adding extras to the selected food item
                                    return '<button class="btn btn-success" onclick="BurgerScripts.GetFoodItemInfo(' + "'" + full.name + "'" + "," + "'" + full.description + "'" + "," + "'" + category + "'" + "," + "'" + full.sizePriceBracket + "'" + ')">Add</button>';

                                }
                            }
                        ]
                    });

                    //below function will set the global itemName parameter to the foodItem the user has clicked on, 
                    //based clicking on the table row. Ideally this should be based on clicking on the add button,
                    //but this still works.                

                    $('#burgerTable tbody').on('click', 'td', function () {

                        //Get row data 

                        var data = $('#burgerTable').DataTable().row($(this).parents('tr')).data();
                        //get item name and set the global itemName variable
                        //(name of item that user is potentially adding in order
                        itemName = data["name"];

                        //below will call the sizetable of the selected product along
                        //with the relevant price bracket of that product

                        LoadBurgerSizes(data["sizePriceBracket"]);
                        LoadBurgerSauces();

                    });
                    



                },
                error: function (err) {
                    alert(err);
                }
            });
        });
    },

    //Method that will call the item sizes for the relevant food category.

    SizeList: function (tble, categorySize, priceBracket) {
        $(document).ready(function () {
            $.ajax({
                url: '/Home/GetFoodItems?category=' + categorySize + '&priceBracket=' + priceBracket,


                dataType: "json",
                method: 'post',
                success: function (data) {

                    //Below variables are passed into HTML labels so that they can be styled. 

                    tble.DataTable().destroy();
                    tble.DataTable({
                        data: data.html,
                        stateSave: true,
                        order: [],
                        bPaginate: false,
                        bLengthChange: false,
                        bFilter: true,
                        bInfo: false,
                        bAutoWidth: false,

                        "columns": [
                            {
                                //label column
                                "render": function (data, type, full) {
                                    return '<label style="font-size:20px;">' + full.size + '</label>';

                                }

                            },
                            {
                                //Add edit and delete buttons to each row record
                                "render": function (data, type, full) {

                                    return '<label style="font-size:20px;">' + BurgerScripts.ConvertDouble(full.sizePrice) + '</label>';

                                }
                            }

                        ],
                    });

                    //Bellow function will add the burger size to the modal order list. The itemName variable will also be added to 
                    //the item size in the PushModalItems function to avoid confusion.

                    //With help from jquery databales documentation https://datatables.net/examples/advanced_init/events_live.html

                    //if category is burger

                    if (categorySize == 'BurgerSizes') {
                        $('#burgerSizeTable tbody').on('click', 'td', function () {
                            var data = $('#burgerSizeTable').DataTable().row($(this).parents('tr')).data();

                            //call PushModalItems funciton so the relveant items can be pushed to the relevant lists.
                            BurgerScripts.PushModalItems(data["size"], data["sizePrice"], categorySize);
                        });
                    }
                },
                error: function (err) {
                    alert(err);
                }
            });
        });


    },



    //method that will call the burger sauces list. 

    BurgerSaucesList: function (tble, category) {

        $(document).ready(function () {
            $.ajax({
                url: '/Home/GetFoodItems?category=' + category,


                dataType: "json",
                method: 'post',
                success: function (data) {

                    //Below variables are passed into HTML labels so that they can be styled. 

                    tble.DataTable().destroy();
                    tble.DataTable({
                        data: data.html,
                        stateSave: true,
                        order: [],
                        bPaginate: false,
                        bLengthChange: false,
                        bFilter: true,
                        bInfo: false,
                        bAutoWidth: false,

                        "columns": [
                            {
                                //label column
                                "render": function (data, type, full) {
                                    return '<label style="font-size:20px;">' + full.sauceName + '</label>';

                                }

                            },
                            {
                                //label column
                                "render": function (data, type, full) {
                                    return '<label id="lblCount"></label><label style="font-size:20px;">' + BurgerScripts.ConvertDouble(full.saucePrice) + '</label>';

                                }
                            }

                        ],

                    });



                    $('#burgerSaucesTable tbody').on('click', 'td', function () {

                         //if a burger sauce is selected, allow the order to finalise order.
                        //burger sauces and extras will only show if a pizza size is selected.

                        var data = $('#burgerSaucesTable').DataTable().row($(this).parents('tr')).data();

                        document.getElementById("btnBurgerOrder").disabled = false;


                        BurgerScripts.PushModalItems(data["sauceName"], data["saucePrice"], category);
                    });
                },
                error: function (err) {
                    alert(err);
                }
            });
        });


    },

    //method that will call the burger extras list. 


    BurgerExtrasList: function (tble, category) {

        $(document).ready(function () {
            $.ajax({
                url: '/Home/GetFoodItems?category=' + category,

                dataType: "json",
                method: 'post',
                success: function (data) {

                    //Below variables are passed into HTML labels so that they can be styled. 

                    tble.DataTable().destroy();
                    tble.DataTable({
                        data: data.html,
                        stateSave: true,
                        order: [],
                        bPaginate: false,
                        bLengthChange: false,
                        bFilter: true,
                        bInfo: false,
                        bAutoWidth: false,

                        "columns": [
                            {
                                //label column
                                "render": function (data, type, full) {
                                    return '<label style="font-size:20px;">' + full.extraName + '</label>';

                                }

                            },
                            {
                                //label column
                                "render": function (data, type, full) {
                                    return '<label id="lblCount"></label><label style="font-size:20px;">' + BurgerScripts.ConvertDouble(full.extraPrice) + '</label>';

                                }
                            }

                        ],

                    });



                    $('#burgerExtrasTable tbody').on('click', 'td', function () {


                        var data = $('#burgerExtrasTable').DataTable().row($(this).parents('tr')).data();

                        BurgerScripts.PushModalItems(data["extraName"], data["extraPrice"], category);


                    });


                },
                error: function (err) {
                    alert(err);
                }
            });
        });


    },


    PushModalItems: function (item, price, category) {

        // This method will push the relevant items to arrays 
        //that are being added to a potential order within a modal.

        //The modal works by firstly only letting a user select a BurgerBase, therefor the first items 
        //in the modalCats array will be BurgerSizes.

        //If passed category is equal to BurgerSizes, then modify the first item in the arrays
        //instead of adding to array.

        //(If the user changes the size of the burger then the first item in the arrays are modified)

        if (price == null) {
            price = 0;
        }

        if (category == 'BurgerSizes') {

            //if first item in modalCat array is equal to BurgerSizes,
            //Modify first items in all arrays  

            if (modalCats[0] == category) {
                modalItems[0] = item + " " + itemName;
                modalCats[0] = category;
                modalPrices[0] = price;

                console.log(modalItems);
                console.log(modalCats);
                console.log(modalPrices);

            }
            else {

                //else push all items to arrays

                modalItems.push(item + " " + itemName);
                modalCats.push(category);
                modalPrices.push(price);

                console.log(modalItems);
                console.log(modalCats);
                console.log(modalPrices);

            }

        }

        else if (category == "BurgerSauces") {

            //if second cateogry in modalCats is equal to given category,
            //modify second items in all arrays

            if (modalCats[1] == category) {
                modalItems[1] = item;
                modalCats[1] = category;
                modalPrices[1] = price;

                console.log(modalItems);
                console.log(modalCats);
                console.log(modalPrices);
            }
            else {

                //else push all items to arrays


                modalItems.push(item);
                modalCats.push(category);
                modalPrices.push(price);

                console.log(modalItems);
                console.log(modalCats);
                console.log(modalPrices);
            }
        }

        else {

            //last case the items added will be extras

            modalItems.push("Added " + item);
            modalCats.push(category);
            modalPrices.push(price);

            console.log(modalItems);
            console.log(modalCats);
            console.log(modalPrices);

        }

        //sum all items in modalPrices array

        var modalSum = modalPrices.reduce(function (a, b) {
            return a + b;
        }, 0);

        totalModalSum = BurgerScripts.ConvertDouble(modalSum);



        //update modal add to order button price
        document.getElementById('btnBurgerOrder').innerHTML = "Add to order £" + totalModalSum;

    },

   

    //Below method is used to populate partial view with table row detials
    //of each food category table.

    GetFoodItemInfo: function (Name, Description, Category, Bracket) {

        console.log("Test: " + Bracket);

        $.ajax({
            url: '/Home/GetFoodItems',
            data: { 'name': Name, 'category': Category, 'priceBracket': Bracket },
            success: (result) => {
                if (result.success) {
                    
                    $("#burgerModal").html(result.html);
                    $("#burgerModal").modal('show');
                    $("#burgerModal").modal('hide');


                    $("#burger-title").html(Name);
                    $("#burger-description").html(Description);
                    
                }
                else {
                    alert(result.errorMessage);
                }

            },
            error: (error) => {
                console.log(error)
            }
        });
    },


    //Below function will create a table to list any food category that is given to it.
    //This saves having to type out a html table more than once.

    FoodItemTable: function (tbleId) {
        var foodItemTable = "<table id='" + tbleId + "' class='table table-hover'  cellspacing='0' style='width:100%'>";

        foodItemTable += " <colgroup>";
        foodItemTable += " <col span='1' style='width:55%'>";
        foodItemTable += " <col span='1' style='width:35%'>";
        foodItemTable += " <col span='1' style='width: 5%; '>";
        foodItemTable += " <col span='1' style='width: 5%; '>";

        foodItemTable += " </colgroup>";
        //var mytable = "<table id='lol' class='table table-hover'  cellspacing='0'>";

        foodItemTable += "<thead>";
        foodItemTable += "<tr>";
        foodItemTable += "<th></th>";
        foodItemTable += "<th></th>";
        foodItemTable += "<th></th>";
        foodItemTable += "<th></th>";
        foodItemTable += "</tr>";
        foodItemTable += "</thead>";
        foodItemTable += "</table>";

        foodItemTable += "<br />";

        document.write(foodItemTable);

    },

    SizeItemTable: function (tbleId) {
        var sizeItemtable = "<table id='" + tbleId + "' class='table table-hover'  cellspacing='0' style='width:10%'>";

        sizeItemtable += " <colgroup>";
        sizeItemtable += " <col span='1' style='width:10%'>";
        sizeItemtable += " <col span='1' style='width:10%'>";
        //mytable += " <col span='1' style='width: 5%; '>";
        //mytable += " <col span='1' style='width: 5%; '>";

        sizeItemtable += " </colgroup>";
        //var mytable = "<table id='lol' class='table table-hover'  cellspacing='0'>";

        sizeItemtable += "<thead>";
        sizeItemtable += "<tr>";
        sizeItemtable += "<th>Test</th>";
        sizeItemtable += "<th>Script</th>";
        //mytable += "<th></th>";
        //mytable += "<th></th>";
        sizeItemtable += "</tr>";
        sizeItemtable += "</thead>";
        sizeItemtable += "</table>";

        sizeItemtable += "<br />";

        document.write(sizeItemtable);

    },


    AddToOrder: function () {

        alert(modalItems.slice(0, 2) + "\n" + modalItems.slice(2, modalItems.length) +
            "\n total added to order: £" + totalModalSum + "\n \n TODO: Implementation of adding to final order");


    }

}

