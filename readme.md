# CSC 330 final Project Presentation 
<small>
    <b>Avash Lamichhane</b>
</small>

Small database project to cover fundamental concepts.

Dataset:- Stock Market dataset of Nepal.

Files:- `combined_price_history.csv` and `comapny_list.csv`
Source:- Kaggle.

Technologies: Python3, PostgresSQL, .NET Core, .NET 10, C#, typescript, React, pandas, Material UI, bootstrap, CSS, Entity Framework Core, Postman, Beekeeper Studio, Visual Studio 2026, VS Code, Pycharm Professional, lightweight charts

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

`debouncer` in software engineering is used to limit a rate in which a function is executed. We don't want to execute a database query everytime a user presses their keyboard to search something. So it adds certain ms buffer in the between.


`Rate limiter`: debouncer is combined with rate limiter in the backend. 

