# CSC 330 final Project Presentation 
<small>
    <b>Avash Lamichhane</b>
</small>

Small database project to cover fundamental concepts.

My background:- <b>Beginner in tech, freshman year project</b>.

Dataset:- Stock Market dataset of Nepal.

Files:- `combined_price_history.csv` and `comapny_list.csv`
Source:- Kaggle.

Entity Framework Core is an object relational mapper (ORM) which lets you write C# and converts that into SQL and executes it.
It's useful for writing Application Programming Interface (API) in the backend. Different programming language have their own ORM.

<hr />

### Database Structure
One reason for using an OLAP-style structure is to simplify scaffolding. Since our pipeline cleans and loads data directly into a SQL table that is then scaffolded into C# classes, splitting the tables would add unnecessary complexity for a project of this scale.


<hr />

`data_pipeline.ipynb` and `data_loading.ipynb` are cleaning and loading script for a csv file to be loaded into SQL tables.

`analysis.ipynb`, `stock_analysis.ipynb` are the files that inspects the SQL table using SQL queries.

`orm_query.ipynb` is a file that inspects the ORM equivalent SQL query from the respective API itself

`Schema` folder has the database schema itself.

`Pipeline` has the full stack project for web interface.

<hr />

### Backend Structure
`Data API.Server` is the folder for the backend.
Inside the server folder we can find:-

`Controller`: API for the backend.

`Data`: Binding the C# class so that it behaves like SQL table. We define SQL related constrains and logic in that file called `ApplicationDbContext.cs`. When we are scaffolding the existing SQL table the code is automatically generated.

`Models`: C# class that acts as a database schema.

`Migration`: Contains local migration code for the database. Hidden in the GitHub workflow.

`Program.cs`: .NET backend configuration file, that handle things like database connection, rate limitor policy, authentication policy etc.

`appsettings.json`: Holds JSON value in our case is <b> Database connection string </b> which is a bad practice in production. That should be in environment variable or GitHub secrets. But for this school it is generally fine, epically when it's a local database.

### Frontend Structure

Nothing is interesting here for a database project. The only <b>clever engineering</b> to reduce the load on database is concept called `debouncer`.
It's not flashy and shiny but gets the job done in demonstrating something.

`debouncer` in software engineering is used to limit a rate in which a function is executed. We don't want to execute a database query everytime a user presses their keyboard to search something. So it adds certain ms buffer in the between.


`Rate limiter`: debouncer is combined with rate limiter in the backend. Never trust client side.

### Concepts covered

- SQL
  - Fundamentals
  - Data loading
  - Writing database schema
  - ORM equivalent of schemas
  - Loading a CSV file
  - Connect Learned
    - Conducting a query
    - Grouping and aggregating
    - Joins
- Software Engineering
  - Basic introduction to backend.
  - Connecting a postgres SQL database server to .NET Core.
  - Understanding the fundamentals of ORM (Object Relational Mappers).
  - API design.
  - Writing a database schema from C#.
  - Scaffolding an existing database schema to C# class.
  - Rate Limiting in backend.
  - Routing of URL in backend.
  - Local Proxy of client and backend URL.
  - Dependency Injection and reusing business logic.
  - Rendering basic charts in typescript
  - React typescript
  - Fetching data from the database from the client side.
  - React hooks
  - React DOM events
  - debouncer concept
  - Responsive Design
  - LINQ in C#
- System Design
    - Rate limiting
    - Efficient query
- Workflows
    - Git
    - GitHub
    - Managing temporary migration and IDE folders
    - Storing connection string in env
- Data pipeline
    - Automated script to load the csv files into the database using pandas.
    - Manipulating a dataframe to make data ready for SQL.
    - Executing a SQL query using `psycopg2`
    - Managing environment variable like the database connection string in python.
    - Conversion of datatypes in dataframe in pandas.
    - Exporting dataframe as a csv.
    - Reading a csv as a dataframe.

## Technology used

- Python3
- Pandas
- PostgresSQL
- .NET Core
- .NET 10
- C#
- Typescript
- React Typescript
- MaterialUI
- Bootstrap
- CSS
- Entity Framework Core (ORM)
- Postman
- Beekeeper Studio
- Visual Studio 2026
- VS Code
- Pycharm Professional
- Lightweight charts
- Jupyter notebook