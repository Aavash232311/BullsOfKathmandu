CREATE TABLE IF NOT EXISTS combined_price_history (
     id UUID PRIMARY KEY,
     symbol VARCHAR(255) NULL,
     company_name VARCHAR(255) NULL,
     sector VARCHAR(255) NULL,
     symbol_link VARCHAR(255) NULL,
     serial_number VARCHAR(255) NULL,
     date_added DATE NULL,
     unlocked FLOAT(53) NULL,
     high FLOAT(53) NULL,
     low FLOAT(53) NULL,
     ltp FLOAT(53) NULL,
     percent_change FLOAT(53) NULL,
     qty FLOAT(53) NULL,
     turnover FLOAT(53) NULL
)