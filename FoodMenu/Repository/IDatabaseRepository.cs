using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FoodMenu.Models;

namespace FoodMenu.Repository
{
    public interface IDatabaseRepository
    {
        List<FoodItems> GetFoodItems(string category, string name, string priceBracket);

    }
}
