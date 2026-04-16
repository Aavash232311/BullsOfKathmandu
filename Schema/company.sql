CREATE TABLE IF NOT EXISTS company_list (
     id UUID PRIMARY KEY,
     sector VARCHAR(255) NULL,
     serial_number VARCHAR(255) NULL,
     symbol_link VARCHAR(255) NULL,
     symbol_text VARCHAR(255) NULL,
     symbol VARCHAR(255) NULL,
     symbol_1 VARCHAR(255) NULL,
     company_link VARCHAR(255) NULL,
     company_text VARCHAR(255) NULL,
     company VARCHAR(255) NULL,
     listed_share DECIMAL NULL,
     paid_up_rs DECIMAL NULL,
     total_paid_up_capital_rs DECIMAL NULL,
     market_capitalization_rs DECIMAL NULL,
     date_of_operation DATE NULL,
     ltp DECIMAL NULL,
     as_of DATE NULL
);