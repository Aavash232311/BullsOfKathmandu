namespace Data_API.Server.Services
{
    public class PaginationResult<T>
    {
        public int totalPages { get; set; }
        public List<T> data { get; set; }
        public int totalObjects { get; set; }
    }
    public class Helper
    {
        public PaginationResult<T> NormalPagination<T>(int pageSize, int page, IQueryable<T> dbo)// this is for the normal pagination that takes place 
        {
            try
            {
                var totalObjects = dbo.Count();
                var takeSkip = dbo.Skip((page - 1) * pageSize).Take(pageSize).ToList();
                int totalPages = (int)Math.Ceiling(totalObjects / (double)pageSize);
                return new PaginationResult<T> { totalPages = totalPages, data = takeSkip, totalObjects = totalObjects };
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}
