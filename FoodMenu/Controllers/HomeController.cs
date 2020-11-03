using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FoodMenu.Services;
using FoodMenu.Repository;
using FoodMenu.Models;

namespace FoodMenu.Controllers
{
    public class HomeController : Controller 
    {
        private readonly IDatabaseRepository repository;
        private readonly IViewRenderService _viewRenderService;

        public HomeController(IDatabaseRepository repository, IViewRenderService viewRenderService)
        {
            //Initialise interface. 

            this.repository = repository;
            this._viewRenderService = viewRenderService;
        }


        public ActionResult GetFoodItems(string category, string name, string priceBracket)
        {
            //This method is the primary method fo retrieving all relevant information 
            //from the SQL database.

            //The method is also used to populate the modal that appears when a
            //user has selected a food item

            //If the name variable is NOT null, then it means that a modal associated with a food item name and
            //category needs to be loaded. The below will do this 

            if (name != null)
            {
                try
                {
                    //Pass category and name so SQL can find the record that matches.
                    var foodInfo = repository.GetFoodItems(category, name, priceBracket);

                    //render partial view with the retrived category and name information.
                    var html = _viewRenderService.RenderToStringAsync("Home/SizeAndExtrasPartialView", foodInfo);

                    //return result in JSON format.
                    return Json(new { success = true, html = html.Result });
                }
                //error exception in case of bad JSON retrival 
                catch (System.Exception ex)
                {
                    return Json(new { success = true, errorMessage = ex.ToString() });
                    throw;
                }
            }
            //if no modal needs to be loaded, then load the relevant table 
            //via the given category.
            else
            {

                var array = repository.GetFoodItems(category, name, priceBracket);
                return Json(new { success = true, html = array });
            }
        }
     

        public IActionResult Index()
        {
            //Main page view

            //Return view

            return View();
        }


    }
}
