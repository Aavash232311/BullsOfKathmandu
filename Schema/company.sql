CREATE TABLE companies (
    symbol VARCHAR(15) PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    sector VARCHAR(100),
    listed_shares NUMERIC,
    paid_up_value NUMERIC(10, 2)
)