CREATE TABLE IF NOT EXISTS combined_price_history (
     id UUID PRIMARY KEY,
     symbol VARCHAR(255) NULL,
     company_name VARCHAR(255) NULL,
     sector VARCHAR(255) NULL,
     symbol_link VARCHAR(255) NULL,
     serial_number VARCHAR(255) NULL,
     date_added DATE NULL,
     unlocked BIGINT NULL,
     high BIGINT NULL,
     low BIGINT NULL,
     ltp BIGINT NULL,
     percent_change INT NULL,
     qty INT NULL,
     turnover INT NULL
)