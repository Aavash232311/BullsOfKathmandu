using Data_API.Server.Data;
using Data_API.Server.Services;
using Data_API.Server.TempModels;
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
                .Where(x => x.CompanyName.ToLower().Contains(name.ToLower()))
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

        [Route("company_price_history")]
        [HttpGet]
        [EnableRateLimiting("RateLimitingPolicy")]
        public async Task<IActionResult> GetCompanyById(string comapnyName, DateOnly? from, DateOnly? to)
        {
            // we get the company name, and all the object from database and plot the chart based on the range
            IQueryable<CombinedPriceHistory> getCompany = _context.CombinedPriceHistories;
            if (from is not null && to is not null && from > to)
                (from, to) = (to, from); // just swap them
            if (from is null && to is null)
            {
                getCompany = getCompany.Where(x => x.CompanyName == comapnyName);
            }

            if (from is null && to is not null)
            {
                getCompany = getCompany.Where(x => x.CompanyName == comapnyName);
            }
            if (from is not null && to is null)
            {
                getCompany = getCompany.Where(x => x.CompanyName == comapnyName && x.DateAdded >= from);
            }
            if (from is not null && to is not null)
            {
                getCompany = getCompany.Where(x => x.CompanyName == comapnyName && x.DateAdded >= from && x.DateAdded <= to);
            }
            var result = await getCompany.Select(o => new
            {
                o.Id,
                o.High,
                o.Low,
                o.Ltp,
                o.CompanyName,
                o.Qty,
                o.PercentChange,
                o.Turnover,
                o.DateAdded

            }).ToListAsync();

            var cleaned = result
                .DistinctBy(x => x.DateAdded)  // if dublicate date then the library in client side will yell at us.
                .OrderBy(x => x.DateAdded) // accending order.
                .ToList();

            return Ok(cleaned);
        }

        [Route("sector")]
        [HttpGet] // if someone is seeing like a tech-recruter, they might be wondering why write rate limiter here, declare global and only mention for expeption, that might work but for right now no time to test.
        [EnableRateLimiting("SearchOptionsRateLimiting")] // this rate limitor is little lower because if someone overrides the client side then they can easily slow it down.
        public async Task<IActionResult> SearchSector(string name)
        {
            var sector = await _context.CompanyLists.Where(
                    x => x.Sector.ToLower().Contains(name.ToLower())
                )
                .GroupBy(s => s.Sector)
                .Select(s => new
                {
                    Id = s.Select(x => x.Id).FirstOrDefault(), 
                    name = s.Key
                })
                .Distinct()
                .Take(10)
                .ToListAsync();
            return Ok(sector);
        }

        [Route("market-cap")]
        [HttpGet]
        [EnableRateLimiting("RateLimitingPolicy")]
        public async Task<IActionResult> MarketCapData(string name)
        {
            var marketCapRes = await _context.CompanyLists 
                .Where(s => s.Sector != null && s.MarketCapitalizationRs != null && s.Sector == name) // even though that is almost perfect name according to clinet side logic, until and unless someone brute forces that one right there.
                .Select(s => new
                {
                    as_of = s.AsOf,
                    market_cap = s.MarketCapitalizationRs,
                    ltp = s.Ltp,
                    paid_up = s.PaidUpRs, // I am not a finance person
                    sector = s.Sector,
                    listed_share = s.ListedShare
                })
                .OrderBy(a => a.as_of)
                .ToListAsync();
            var cleaned = marketCapRes
                .DistinctBy(x => x.as_of); // It's important to understand why this does not work in SQL level but I will do that after my finals are over.


            // Lets also give LTP by sector in this API since we are searching from sector here.
            // we want to group by date as well as sector.
            var ltpBySector = await _context.CombinedPriceHistories
                .Where(s => s.Sector != null && s.Sector == name)
                .GroupBy(g => g.Sector)
                .Select(o => new
                {
                    label = o.Key,
                    avgLtp = o.Average(a => a.Ltp),
                    avgHigh = o.Average(a => a.High),
                    avgLow = o.Average(a => a.Low),
                    avgTurnOver = o.Average(a => a.Turnover)
                })
               .ToListAsync(); // we want to plot the sector based LTP, high, and lows.
            return Ok(new
            {
                marketCap = cleaned,
                ltpBySector
            });
        }
    }
}
