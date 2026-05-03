using System;
using System.Collections.Generic;

namespace Data_API.Server.TempModels;

public partial class CombinedPriceHistory
{
    public Guid Id { get; set; }

    public string? Symbol { get; set; }

    public string? CompanyName { get; set; }

    public string? Sector { get; set; }

    public string? SymbolLink { get; set; }

    public string? SerialNumber { get; set; }

    public DateOnly? DateAdded { get; set; }

    public double? Unlocked { get; set; }

    public double? High { get; set; }

    public double? Low { get; set; }

    public double? Ltp { get; set; }

    public double? PercentChange { get; set; }

    public double? Qty { get; set; }

    public double? Turnover { get; set; }
}
