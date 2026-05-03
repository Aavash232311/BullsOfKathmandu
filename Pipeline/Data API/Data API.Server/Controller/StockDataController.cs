using Data_API.Server.Data;
using Data_API.Server.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;


/* This project is for demonstration of
 * ORM in modern day software engineering. 
 If I had time then I would surely add authentication here from OAuth. 

 */

namespace Data_API.Server.Controller
{
    [Route("[controller]")]
    [ApiController]
    public class StockController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly Helper _helper;
        public StockController(ApplicationDbContext context, Helper helper)
        {
            _context = context;
            _helper = helper;
        }


        [Route("list")]
        [HttpGet]
        public async Task<IActionResult> GetCompany()
        {
            var company = await _context.CompanyLists.
                OrderByDescending(a => a.AsOf).Take(10).ToListAsync();
            return Ok(company);
        }

        // api to search company name.
        [Route("company_name")] // rate limiting should be little low here, or we need to design this seperately in the client side. Problem of system design but not necessary in SQL project.
        [HttpGet]
        [EnableRateLimiting("SearchOptionsRateLimiting")] // Good system design question, we can disucss some other sunny day.
        public async Task<IActionResult> GetCompanyName(string name)
        {
            if (string.IsNullOrEmpty(name))
            {
                return new JsonResult(Ok(new List<object>())); // just don't stress the database.
            }
            var getCompanyName = await _context.CombinedPriceHistories
                .Where(x => x.CompanyName.Contains(name))
                .GroupBy(c => c.CompanyName)
                .Select(s => new
                {
                    Id = s.Select(x => x.Id).FirstOrDefault(), // one from the group, now that we have grouped.
                    CompanyName = s.Key
                })
                .Distinct()
                .Take(10)
                .ToListAsync();


            return Ok(getCompanyName);
        }
        // todo: finish this chart, on demand and write SQL equivalent in jupyter notebook.
        // and we will see if we can do some createive analyis.
        // I don't want to spend time on React for SQL course. 
        // EF -> SQL equivalent is relivent demostrates real life procress.
    }
}
