import React, { Component } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
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

export type StockPaginationResult = PaginationResult<StockData>;

export default class Dashboard extends Component {

    constructor(props: any) {
        super(props);
    }

    private timer: any = null;

    state: { nameSearch: string, companyNames: StockData[] } = {
        nameSearch: '',
        companyNames: [],
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
                            <form className="d-flex" role="search">
                                <input
                                    className="form-control me-2"
                                    type="search"
                                    placeholder="Search"
                                    aria-label="Search"
                                    onChange={this.companyNameSuggestionChange}
                                />
                                <button className="btn btn-outline-success" type="submit">
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
                                        >
                                            <div>
                                                <strong>{item.companyName}</strong>
                                    
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>

                </div>
            </React.Fragment>
        )
    }
}
