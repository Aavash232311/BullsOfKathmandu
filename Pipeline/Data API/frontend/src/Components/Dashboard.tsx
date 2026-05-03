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

    state: { currentSearchNamePage: number, nameSearch: string, companyNames: StockData[] } = {
        currentSearchNamePage: 1,
        nameSearch: 'Nepal Finance Limited',
        companyNames: [],
    }


    componentDidMount() {
        fetch(`/stock/company_name?name=${this.state.nameSearch}&page=${this.state.currentSearchNamePage}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => response.json())
            .then(data => {
                var res: StockPaginationResult = data;
                this.setState({ companyNames: res.data });
            })
            .catch(error => {
                console.error('Error fetching company names:', error);
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
                        <div>
                            <form className="d-flex" role="search">
                                <input
                                    className="form-control me-2"
                                    type="search"
                                    placeholder="Search"
                                    aria-label="Search"
                                />
                                <button className="btn btn-outline-success" type="submit">
                                    Search
                                </button>
                            </form>
                        </div>
                    </div>

                </div>
            </React.Fragment>
        )
    }
}
