using System;
using System.Collections.Generic;

namespace Data_API.Server.TempModels;

public partial class CompanyList
{
    public Guid Id { get; set; }

    public string? Sector { get; set; }

    public string? SerialNumber { get; set; }

    public string? SymbolLink { get; set; }

    public string? SymbolText { get; set; }

    public string? Symbol { get; set; }

    public string? Symbol1 { get; set; }

    public string? CompanyLink { get; set; }

    public string? CompanyText { get; set; }

    public string? Company { get; set; }

    public double? ListedShare { get; set; }

    public double? PaidUpRs { get; set; }

    public double? TotalPaidUpCapitalRs { get; set; }

    public double? MarketCapitalizationRs { get; set; }

    public DateOnly? DateOfOperation { get; set; }

    public double? Ltp { get; set; }

    public DateOnly? AsOf { get; set; }
}
