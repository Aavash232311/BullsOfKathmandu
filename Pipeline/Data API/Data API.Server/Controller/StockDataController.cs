using Data_API.Server.Data;
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
    [EnableRateLimiting("RateLimitingPolicy")]
    public class StockController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public StockController(ApplicationDbContext context) 
        {
            _context = context;
        }


        [Route("list")]
        [HttpGet]
        public async Task<IActionResult> GetCompany()
        {
            var company = await _context.CompanyLists.
                OrderByDescending(a => a.AsOf).Take(10).ToListAsync();
            return Ok(company);
        }
    }
}
