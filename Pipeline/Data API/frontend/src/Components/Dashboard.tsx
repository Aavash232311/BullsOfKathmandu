import React, { Component, createRef } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Chart, LineSeries } from "lightweight-charts-react-components";

import '../static/dashboard.css';


export interface PaginationResult<T> {
    totalPages: number;
    totalObjects: number;
    data: T[];
} // If the data is paginted the asp.net server will return this.

export interface StockData {
    id: string;
    companyName: string;
}


export interface TimeFrameData {
    dateAdded: string;
    high: number;
    low: number;
    ltp: number;
    companyName: string;
    qty: number;
    turnover: number;
    id: string;
    percentageChange: number;
}


export type StockPaginationResult = PaginationResult<StockData>;



export interface DashboardProps {
    nameSearch: string;
    companyNames: StockData[];
    selectedCompanyName: string | null;
    dateFrom: string | null;
    dateTo: string | null;
    company: TimeFrameData[];
    chartTitle: string;
    sectorSearch: string;
    sectorNames: SectorData[];
    selectedSectorName: string | null;
    stockMarketCapOfSector: SectorMarketCapData[];
    groupedBySector: GroupedBySectorData[];
}


export interface PlotVariables {
    time: string;
    value: number;
}

export interface SectorData {
    Id: string;
    name: string;
}

export interface SectorMarketCapData {
    market_cap: number;
    ltp: number;
    paid_up: number;
    sector: string;
    listed_share: string;
}

export interface GroupedBySectorData {
    avgHigh: number;
    avgLow: number;
    avgLtp: number;
    avgTurnOver: number;
    label: string;
}

export default class Dashboard extends Component {

    constructor(props: any) {
        super(props);
    }

    private timer_company: any = null;
    private timer_sector: any = null;
    chartContainerRef = createRef<HTMLDivElement>();

    state: DashboardProps = {
        nameSearch: '',
        companyNames: [],
        selectedCompanyName: 'Citizens Bank International Limited',
        dateFrom: null,
        dateTo: null,
        company: [],
        chartTitle: '',
        sectorSearch: '',
        sectorNames: [],
        selectedSectorName: 'Hydropower',
        stockMarketCapOfSector: [],
        groupedBySector: [],
    };

    fetchCompanyNames = (name: string) => {
        if (name === '') return;
        fetch(`/stock/company_name?name=${name}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => response.json())
            .then(data => {
                var res: StockPaginationResult = data;
                this.setState({ companyNames: res });
            })
            .catch(error => {
                console.error('Error fetching company names:', error);
            });
    }


    componentDidMount() {
        this.searchCompany();
        this.fetchMarketCapOfSector();
    };


    companyNameSuggestionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value: string = e.currentTarget.value;

        if (value === '') {
            // if the value is empty, we will not search and clear the company names.
            this.setState({ companyNames: [] });
            return;
        }

        if (this.timer_company) clearTimeout(this.timer_company); // it's like waiting till the user stops tpying.

        if (value.length < 3) {
            this.setState({ results: [] });
            return;
        }
        this.setState({ nameSearch: value }, () => {
            // after setting the name, the state will be loaded and our search will be triggred.
            this.timer_company = setTimeout(() => {
                this.fetchCompanyNames(this.state.nameSearch);
            }, 300);

        });
    }


    selectedCompany = (companyName: string) => {
        this.setState({ selectedCompanyName: companyName, companyNames: [] }, () => {
            // not recomended I am out of time, I know there is a better way.
            const form: any = document.getElementById('companyNameInput'); // slap in ANY not a good idea but I am out of time.
            form.value = companyName;
        });
    }



    formatDate = (date: string | null): string | null => {
        if (!date) return null;
        const parsed = new Date(date);
        return parsed.toISOString().split("T")[0];
    };

    searchCompany = () => {
        let url = `/stock/company_price_history?comapnyName=${this.state.selectedCompanyName}`;

        if (this.state.dateFrom) url += `&from=${this.formatDate(this.state.dateFrom)}`;
        if (this.state.dateTo) url += `&to=${this.formatDate(this.state.dateTo)}`;

        fetch(url,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }

            }
        ).then(response => response.json())
            .then(data => {
                this.setState({ company: data, chartTitle: data[0].companyName });
            })
            .catch(error => {
                console.error('Error searching company:', error);
            });
    }

    SERIES_CONFIG = [
        { key: "ltp", color: "#2196F3", title: "LTP" },
        { key: "high", color: "#4CAF50", title: "High" },
        { key: "low", color: "#F44336", title: "Low" },
        { key: "percentageChange", color: "#00BCD4", title: "% Change" },
    ];

    TURNOVER_SERIES_CONFIG = [
        { key: "turnover", color: "#9C27B0", title: "Turnover" },
    ];

    MARKET_CAP_SERIES_CONFIG = [
        { key: "market_cap", color: "#FF9800", title: "Market Cap" },
        { key: "ltp", color: "#2196F3", title: "LTP" },
        { key: "paid_up", color: "#4CAF50", title: "Paid Up Value" },
    ];


    sectorNameSearch = (name: string) => {
        fetch(`/stock/sector?name=${name}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => response.json())
            .then(data => {
                var res: SectorData[] = data;
                this.setState({ sectorNames: res });
            })
            .catch(error => {
                console.error('Error fetching sector names:', error);
            });
    }

    sectorNameSuggestiongChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // We need the same clever engineering here. But remember never trust the client. It's just one protection layer.   
        const value: string = e.currentTarget.value;
        if (value === '') { this.setState({ sectorNames: [] }); return; }

        if (this.timer_sector) clearTimeout(this.timer_sector); // if that timer exists then clear it.

        if (value.length < 3) { this.setState({ results: [] }); return; } // if the input length is smaller then don't search and clear the results.
        this.setState({ sectorSearch: value }, () => {
            this.timer_sector = setTimeout(() => {
                this.sectorNameSearch(this.state.sectorSearch); // I might not need to add that to state, but this is for SQL course to intentionally just making it work here. 
            }, 300);
        });

    }


    fetchMarketCapOfSector = () => {
        const sector: string = this.state.selectedSectorName || '';
        if (sector === '') return;

        fetch(`/stock/market-cap?name=${sector}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => response.json())
            .then(data => {
                const res: SectorMarketCapData[] = data.marketCap;
                this.setState({ stockMarketCapOfSector: res, groupedBySector: data.ltpBySector });
            })
            .catch(error => {
                console.error('Error fetching sector market cap:', error);
            });
    }

    selectSector = (sectorName: SectorData) => {
        const selectedSectorName: string = sectorName.name;

        const form: any = document.getElementById('sector-name-input');
        this.setState({ sectorNames: [] }, () => {
            form.value = selectedSectorName;
            this.setState({ selectedSectorName: selectedSectorName });
        });
    }



    render() {
        const { company } = this.state;
        const mapData = (key: keyof TimeFrameData) =>
            company.map((item) => ({
                time: item.dateAdded.split("T")[0],
                value: item[key] as number,
            }));
        return (
            <React.Fragment>
                <div className="dashboard-container">
                    <Box sx={{ flexGrow: 1 }}>
                        <AppBar position="static" sx={{ backgroundColor: '#424242' }}>
                            <Toolbar variant="dense">
                                <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
                                    <MenuIcon />
                                </IconButton>
                                <Typography
                                    variant="h6"
                                    component="div"
                                    sx={{
                                        color: 'inherit',
                                    }}
                                >
                                    Data Dashboard { /* I don't want to define hooks and triggers and overengineer SQL course project. */}
                                </Typography>
                            </Toolbar>
                        </AppBar>
                    </Box>

                    <br />
                    <div className="dashboard-content">
                        <h2>Stock Dashboard Demo <small>(For a SQL course project, very basic)</small></h2>
                    </div>

                    <br />
                    <div className="dashboard-content-nav">
                        <div className="position-relative" style={{ width: '300px' }}>
                            <form onSubmit={(e: React.FormEvent<HTMLFormElement>) => { e.preventDefault(); this.searchCompany(); }} className="d-flex" role="search" id="searchForm">
                                <input
                                    className="form-control me-2"
                                    type="search"
                                    placeholder="Search"
                                    aria-label="Search"
                                    autoComplete="off"
                                    id="companyNameInput"
                                    required
                                    onChange={this.companyNameSuggestionChange}
                                />
                                <button className="btn btn-primary" type="submit">
                                    Search
                                </button>
                            </form>
                            {this.state.companyNames.length > 0 && (
                                <ul className="list-group position-absolute w-100 shadow-sm name-suggestion-list"
                                    style={{ zIndex: 1000, top: '100%' }}>

                                    {this.state.companyNames.map((item: StockData, index: number) => (
                                        <li
                                            key={item.id || index}
                                            className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => this.selectedCompany(item.companyName)}
                                        >
                                            <div>
                                                <strong>{item.companyName}</strong>

                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <div>
                            <div className="date-range-picker" >
                                <div>
                                    <div className='d-flex align-items-center gap-2'>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <label htmlFor="fromDate" className="form-label text-light  mb-0">
                                                <small>From </small>
                                            </label>

                                            <input
                                                className="form-control bg-dark text-light border-secondary"
                                                type="date"
                                                id='fromDate'
                                                onChange={(ev: React.ChangeEvent<HTMLInputElement>) => {
                                                    this.setState({ dateFrom: ev.currentTarget.value });
                                                }}
                                            />
                                        </LocalizationProvider>
                                    </div>
                                </div>
                                <div>
                                    <div className='d-flex align-items-center gap-2'>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <label htmlFor="toDate" className="form-label text-light mb-0"  >
                                                <small>To </small>
                                            </label>
                                            <input
                                                className="form-control bg-dark text-light border-secondary"
                                                type="date"
                                                id='toDate'
                                                onChange={(ev: React.ChangeEvent<HTMLInputElement>) => {
                                                    this.setState({ dateTo: ev.currentTarget.value });
                                                }}
                                            />
                                        </LocalizationProvider>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <hr style={{ visibility: 'hidden' }} />
                    <div className="chart-container">
                        {this.state.company.length > 0 && (
                            <>
                                <div className="chart-grids">
                                    <div>
                                        <h6>
                                            {this.state.chartTitle}
                                        </h6>
                                        <Chart options={{ width: 700, height: 400 }}>
                                            {this.SERIES_CONFIG.map((series) => {
                                                return (
                                                    (
                                                        <LineSeries
                                                            key={series.key}
                                                            data={mapData(series.key as keyof TimeFrameData)}
                                                            options={{
                                                                color: series.color,
                                                                title: series.title,
                                                            }}
                                                        />
                                                    )
                                                )
                                            })}
                                        </Chart>
                                    </div>

                                    <div>
                                        <h6>
                                            Turnover: {this.state.chartTitle}
                                        </h6>
                                        <Chart options={{ width: 700, height: 400 }}>
                                            {this.TURNOVER_SERIES_CONFIG.map((series) => {
                                                return (
                                                    <LineSeries
                                                        key={series.key}
                                                        data={mapData(series.key as keyof TimeFrameData)}
                                                        options={{
                                                            color: series.color,
                                                            title: series.title,
                                                        }}
                                                    />
                                                )
                                            })}
                                        </Chart>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                    <hr style={{ visibility: "hidden" }} />
                    <div className="dashboard-content-nav">
                        <div className='position-relative'>
                            <form action="" className="d-flex" role="search" onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                                e.preventDefault();
                                this.fetchMarketCapOfSector();
                            }}>
                                <input
                                    autoComplete='off'
                                    id='sector-name-input'
                                    onChange={this.sectorNameSuggestiongChange}
                                    style={{ width: "96%" }}
                                    type="text"
                                    className="form-control me-2"
                                    placeholder='search sector' />
                                <input type="submit" className='btn btn-primary' value="Search" />
                            </form>
                            <hr style={{ visibility: "hidden" }} />
                            {this.state.sectorNames.length > 0 && (
                                <ul className="list-group position-absolute w-100 shadow-sm name-suggestion-list"
                                    style={{ zIndex: 1000, top: '100%' }}>

                                    {this.state.sectorNames.map((item: SectorData, index: number) => (
                                        <li
                                            key={item.Id || index}
                                            className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => this.selectSector(item)}
                                        >
                                            <div>
                                                <strong>{item.name}</strong>

                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                    {this.state.stockMarketCapOfSector.length > 0 && (
                        <div className="chart-container-table">
                            <h6>
                                Market Cap of {this.state.selectedSectorName} Sector
                            </h6>
                            <table className="table table-success table-striped" style={{ width: "100%" }}>
                                <thead>
                                    <tr>
                                        <th scope="col">Market Cap</th>
                                        <th scope="col">LTP</th>
                                        <th scope="col">Paid up</th>
                                        <th scope="col">Sector</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.stockMarketCapOfSector.map((data, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>
                                                    {data.market_cap !== null ? (
                                                        <>
                                                            <b>Rs.</b> {data.market_cap}
                                                        </>
                                                    ) : 'N/A'}
                                                </td>
                                                <td>
                                                    {data.ltp !== null ? (
                                                        <>
                                                            <b>Rs.</b> {data.ltp}
                                                        </>
                                                    ) : 'N/A'}
                                                </td>
                                                <td>
                                                    {data.paid_up !== null ? (
                                                        <>
                                                            <b>Rs.</b> {data.paid_up}
                                                        </>
                                                    ) : 'N/A'}
                                                </td>
                                                <td>
                                                    {data.sector !== null ? (
                                                        <>
                                                            <b>Rs.</b> {data.sector}
                                                        </>
                                                    ) : 'N/A'}
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {this.state.groupedBySector.length > 0 && (
                        <>
                            <div className="chart-container-table">
                                <h6>
                                    Average LTP, High, Low and Turnover Grouped by Sector
                                </h6>
                                <table className="table table-success table-striped" style={{ width: "100%" }}>
                                    <thead>
                                        <tr>
                                            <th scope="col">Sector</th>
                                            <th scope="col">Average LTP</th>
                                            <th scope="col">Average High</th>
                                            <th scope="col">Average Low</th>
                                            <th scope="col">Average Turnover</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.groupedBySector.map((data, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td>{data.label}</td>
                                                    <td>
                                                        {data.avgLtp !== null ? (
                                                            <>
                                                                <b>Rs.</b> {data.avgLtp.toFixed(2)}
                                                            </>
                                                        ) : 'N/A'}
                                                    </td>
                                                    <td>
                                                        {data.avgHigh !== null ? (
                                                            <>
                                                                <b>Rs.</b> {data.avgHigh.toFixed(2)}
                                                            </>
                                                        ) : 'N/A'}
                                                    </td>
                                                    <td>
                                                        {data.avgLow !== null ? (
                                                            <>
                                                                <b>Rs.</b> {data.avgLow.toFixed(2)}
                                                            </>
                                                        ) : 'N/A'}
                                                    </td>
                                                    <td>
                                                        {data.avgTurnOver !== null ? (
                                                            <>
                                                                <b>Rs.</b> {data.avgTurnOver.toFixed(2)}
                                                            </>
                                                        ) : 'N/A'}
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </div>
            </React.Fragment>
        )
    }
}
