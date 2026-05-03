import React, { Component, createRef } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
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
    plotOn: string;
    plotVariables: PlotVariables[];
    chartTitle: string;
}


export interface PlotVariables {
    time: string;
    value: number;
}

export default class Dashboard extends Component {

    constructor(props: any) {
        super(props);
    }

    private timer: any = null;
    chartContainerRef = createRef<HTMLDivElement>();

    state: DashboardProps = {
        nameSearch: '',
        companyNames: [],
        selectedCompanyName: 'Nabil Bank Limited',
        dateFrom: null,
        dateTo: null,
        company: [],
        plotOn: 'ltp',
        plotVariables: [],
        chartTitle: ''
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
        // this.searchCompany();
    };


    companyNameSuggestionChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        const value: string = e.currentTarget.value;

        if (value === '') {
            // if the value is empty, we will not search and clear the company names.
            this.setState({ companyNames: [] });
            return;
        }

        if (this.timer) clearTimeout(this.timer); // it's like waiting till the user stops tpying.

        if (value.length < 3) {
            this.setState({ results: [] });
            return;
        }
        this.setState({ nameSearch: value }, () => {
            // after setting the name, the state will be loaded and our search will be triggred.
            this.timer = setTimeout(() => {
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


    plotChart = (data: TimeFrameData[], plotOn: string) => {
        const plotVariables: PlotVariables[] = [];
        let chartTitle: string = '';
        data.forEach((item: TimeFrameData) => {
            chartTitle = item.companyName;
            plotVariables.push({
                time: item.dateAdded,
                value: plotOn === 'ltp' ? item.ltp : plotOn === 'high' ? item.high : item.low
            })
        });
        this.setState({ plotVariables: plotVariables, chartTitle: chartTitle });
    }

    searchCompany = () => {

        var url: string = `/stock/company_price_history?comapnyName=${this.state.selectedCompanyName}`;
        if (this.state.dateFrom == null && this.state.dateTo == null) {
            url = `/stock/company_price_history?comapnyName=${this.state.selectedCompanyName}`;
        } else if (this.state.dateFrom == null && this.state.dateTo != null) {
            url = `/stock/company_price_history?comapnyName=${this.state.selectedCompanyName}&to=${this.state.dateTo}`;
        } else if (this.state.dateFrom != null && this.state.dateTo == null) {
            url = `/stock/company_price_history?comapnyName=${this.state.selectedCompanyName}&from=${this.state.dateFrom}`;
        }


        fetch(url,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }

            }
        ).then(response => response.json())
            .then(data => {
                this.setState({ company: data });
                this.plotChart(data, this.state.plotOn);
            })
            .catch(error => {
                console.error('Error searching company:', error);
            });
    }


    render() {
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
                        <h2>Stock Dashboard</h2>
                    </div>

                    <br />
                    <div className="dashboard-content-nav">
                        <div className="position-relative" style={{ width: '300px' }}>
                            <form onSubmit={(e: React.FormEvent<HTMLFormElement>) => {e.preventDefault(); this.searchCompany();}} className="d-flex" role="search" id="searchForm">
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
                            <div className="date-range-picker">
                                <div>
                                    <div>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DatePicker label="From Date" slotProps={{
                                                textField: {
                                                    size: 'small'
                                                }
                                            }}
                                                sx={{ backgroundColor: 'white', color: 'white', borderRadius: '4px' }}
                                                onChange={(date) => {
                                                    this.setState({ dateFrom: date });
                                                }}
                                            />
                                        </LocalizationProvider>
                                    </div>
                                </div>
                                <div>
                                    <div>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DatePicker label="To Date"
                                                slotProps={{
                                                    textField: {
                                                        size: 'small'
                                                    }
                                                }}
                                                onChange={(date) => {
                                                    this.setState({ dateTo: date });
                                                }}
                                                sx={{ backgroundColor: 'white', color: 'white', borderRadius: '4px' }}
                                            />
                                        </LocalizationProvider>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <hr style={{ visibility: 'hidden' }} />
                    <div className="chart-container">
                        {this.state.plotVariables.length > 0 && (
                            <>
                                <h6>
                                 {this.state.chartTitle}
                                </h6>
                                <Chart options={{ width: 800, height: 400 }}>
                                    <LineSeries data={this.state.plotVariables} />
                                </Chart>
                            </>
                        )}
                    </div>
                </div>
            </React.Fragment>
        )
    }
}
