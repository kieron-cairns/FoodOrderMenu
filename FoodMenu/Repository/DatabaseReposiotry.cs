using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Data.SqlClient;
using FoodMenu.Models;


namespace FoodMenu.Repository
{
    public class DatabaseReposiotry : IDatabaseRepository
    {
        private readonly MainDbContext mainDbContext;
        //private readonly IHubContext<CustomersHub> signalContext;
        string connectionString = "";



        public DatabaseReposiotry(MainDbContext mainDbContext, IConfiguration configuration)
        {
            this.mainDbContext = mainDbContext;
            connectionString = configuration.GetConnectionString("DefaultConnection");

        }

        public List<FoodItems> GetFoodItems(string category, string name, string priceBracket)
        {
            //This is the main method that will pull releveant indormation for all food items, ranging from food category menus
            //to sides and extras.

            //All results within the SQL table that correlate with the given category variable will be shown.

            //By default, when the main index page loads, each food category will be passed so the main page can display
            //menues for each food category.


            //SQL command variable 

            string commandText = "";

            //If name is null, then it means that a food item category table 
            //needs to be displayed.

            if (!category.Contains("Sizes"))
            {
                commandText = "SELECT * FROM " + category;
            }

            else if (category.Contains("Sizes"))
            {

                commandText = "SELECT * FROM " + category + " WHERE Bracket = '" + priceBracket + "'";

            }           

            else
            {
                commandText = "SELECT * FROM " + category;

            }

            var results = new List<FoodItems>();

            using (SqlConnection conn = new SqlConnection(connectionString))
            {

                //Establish SQL connection and dependencies.

                conn.Open();

                SqlDependency.Start(connectionString);

                SqlCommand cmd = new SqlCommand(commandText, conn);
                SqlDependency dependency = new SqlDependency(cmd);

              

                //Execute reader
                var reader = cmd.ExecuteReader();

                //Read all rows until null
                while (reader.Read())
                {


                    if (category == "PizzaSizes" || category == "BurgerSizes")
                    {
                        var result = new FoodItems
                        {
                            //Assign class objects with the fields in search results table.

                            Size = reader["Size"].ToString(),
                            Bracket = reader["Bracket"].ToString(),
                            SizePrice = double.Parse(reader["SizePrice"].ToString())
                        };

                        

                        results.Add(result);


                    }

                    else if (category == "PizzaBases")
                    {
                        var result = new FoodItems
                        {
                            //Assign class objects with the fields in search results table.
                            BaseType = reader["BaseType"].ToString()
                        };

                        results.Add(result);
                    }


                    else if (category == "BurgerSauces")
                    {
                        var result = new FoodItems
                        {
                            //Assign class objects with the fields in search results table.

                            SauceName = reader["SauceName"].ToString(),
                            SaucePrice = double.Parse(reader["SaucePrice"].ToString()),
                        };

                        //Add class objects to the final search results list.

                        results.Add(result);
                    }

                    else if(category == "PizzaExtras" || category == "BurgerExtras")
                    {
                        var result = new FoodItems
                        {
                            ExtraName = reader["ExtraName"].ToString(),
                            ExtraPrice = double.Parse(reader["ExtraPrice"].ToString())
                        };

                        results.Add(result);
                    }

                    else if(category == "Pizzas" || category == "Burgers")
                    {

                        var result = new FoodItems
                        {
                            //Assign class objects with the fields in search results table.

                            Name = reader["Name"].ToString(),
                            Description = reader["Description"].ToString(),
                            InitPrice = double.Parse(reader["InitPrice"].ToString()),
                            SizePriceBracket = reader["SizePriceBracket"].ToString()
                        };


                        //Add class objects to the final search results list.

                        results.Add(result);
                    }
                }
            }
            //return search results
            
            return results;
        }

    
    }
}
