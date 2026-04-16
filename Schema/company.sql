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
     listed_share BIGINT NULL,
     paid_up_rs BIGINT NULL,
     total_paid_up_capital_rs BIGINT NULL,
     market_capitalization_rs BIGINT NULL,
     date_of_operation DATE NULL,
     ltp BIGINT NULL,
     as_of DATE NULL
);