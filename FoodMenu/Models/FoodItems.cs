using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace FoodMenu.Models
{

    //Class file FoodItems SQL Table Model

    public class FoodItems
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]

        //Standard Item Table Model

        public string Name { get; set; }
        public string Description { get; set; }
        public double InitPrice { get; set; }
        public string SizePriceBracket { get; set; }

        //Item Sizes Model

        public string Size { get; set; }
        public string Bracket { get; set; }
        public double SizePrice { get; set; }

        //Pizza Base Types Model

        public string BaseType { get; set; }

        //Pizza Extras Modal

        public string ExtraName { get; set; }
        public double ExtraPrice { get; set; }

        //Burger Sauces Model

        public string SauceName { get; set; }
        public double SaucePrice {get; set;}



    }
}
