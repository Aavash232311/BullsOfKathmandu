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
     listed_share  FLOAT(53) NULL,
     paid_up_rs FLOAT(53) NULL,
     total_paid_up_capital_rs FLOAT(53) NULL,
     market_capitalization_rs FLOAT(53) NULL,
     date_of_operation DATE NULL,
     ltp FLOAT(53) NULL,
     as_of DATE NULL
);