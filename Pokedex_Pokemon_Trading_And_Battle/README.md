# Homework 5 - Pokedex 2 - Project Specification
*Special thanks to Whitaker Brand and Melissa Hovik for the original version of this assignment.*

## Overview
This assignment is about using PHP together with SQL to create, modify, and query information in a database.

It is the first assignment where the primary focus is not a user interface but only the web service which will connect to a database to retrieve and modify data.

### Learning Objectives
* Continue to practice all of the CSE 154 learning objectives from previous assignments, including:
    * Carefully reading and following assignment specifications.
    * Reducing redundancy in your code while producing expected output.
    * Producing quality readable and maintainable code with unobtrusive PHP.
    * Clearly documenting your code as specified in the CSE 154 Code Quality Guide.
* Building an API that responds to GET and POST requests using the PHP language.
* Using the PHP language to read information from a database with SQL.
* Using the PHP language to write information to a database with SQL.

### Final Deliverables and Provided Files

You are to implement the following files and turn them in through your repository:

| File          | Repository file you will implement and turn in |
|---------------|------------------------------|
| `setup.sql` | A small SQL file that sets up your personal Pokedex table. |
| `getcreds.php` | A web service for retrieving your player credentials (PID and token). |
| `select.php` |  A web service for retrieving the Pokemon from your Pokedex table. |
| `insert.php` | A web service for adding a Pokemon to your Pokedex table. |
| `update.php` | A web service for naming a Pokemon in your Pokedex. |
| `delete.php` | A web service for removing Pokemon from your Pokedex table. |
| `trade.php` | A web service for updating your Pokedex list after a Pokemon "trade". |
| `common.php` | Shared PHP functions for your other PHP files. |

In this HW5 repository you will find the following provided files to help you test as you develop
your web service:

| File&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;    | Repository files |
|--------------------|------------------------------|
| `tester.html` |  The HTML for testing your web service. |
| `tester.js`   |  A JavaScript file for you to use to test your web service. |

These testers files were originally written by Kiet Sam (a student in 18sp) and updated work with our
most recent requirements. Note that they do not include exhaustive tests of everything your web
service will need to do, but it can help you identify errors in your code.

You may, if you wish, you may modify `tester.html` and `tester.js`
turn them in along side your other work to demonstrate you are thinking about how to test your API.
You will not be graded on this effort, but your tests may be incorporated into future versions of
the assignment, with your permission, of course!

Midway through your development cycle, we will push the following files into your repository for
additional testing. This will require you to do a "pull" in your repository to retrieve these files.
These files are to stay **unchanged** throughout your development cycle.

| File&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  | Repository files to stay unchanged |
|--------------------|------------------------------|
| `main.html`   | the main page of the application, which lets a user choose to start a game or trade Pokemon with another user and the pokedex/game view of the application, which lets a user choose a Pokemon to play with and then play a Pokemon card game with another player. |
| `main.min.js` | Minified JavaScript for `main.html`. |
| `lib.min.js` | Minified JavaScript for `main.html`. |
| `styles.css`   | The styles for `main.html` |


Your solution will be graded only on the eight files in the first table above. Any changes you
make to `main.html`, `styles.css`, `main.min.js`, or `lib.min.js` will be ignored.


## External Requirements - Web Service Behavior

### Database Setup
Before starting the PHP files, you will need to set up your own SQL database. In phpMyAdmin, you can
do so by clicking on the Databases tab, entering the database name in the appropriate edit box, then
pressing the Create button.  You could also run the following SQL command under the SQL tab:

```sql
CREATE DATABASE hw5db;
USE hw5db;
```

This is the database your web services will be using to keep track of which Pokemon you have caught. Storing
your Pokemon in a database (instead of in a DOM element as you did in HW3) allows us to maintain the state
after refreshing or exiting the web page.

Write a SQL file `setup.sql` that creates a table called `Pokedex` to store your collected Pokemon.
Your code in `setup.sql` must contain queries that you wrote yourself and were not generated
by exporting from phpMyAdmin or the like. This file should meet the following requirements:
* The `Pokedex` table should have three columns:
  * `name` for each Pokemon's name which also serves as the table's `PRIMARY KEY` (e.g., "bulbasaur")
  * `nickname` for each Pokemon's nickname (e.g., "Bulby")
  * `datefound` for the date and time you collected the Pokemon
*  The `name` and `nickname` columns should have `VARCHAR` data types and allow string lengths of `30` characters.
* To represent the date and time, use the `DATETIME` data type. In MySQL, this type represents a date and
time in the format `YYYY-MM-DD HH:MI:SS` (e.g., 2018-05-15 13:54:00 to represent 1:54 PM on May 15th,
2018).
* Your database name (`hw5db`), table name (`Pokedex`), column names (`name`, `nickname`, `datefound`) **must
match exactly those here in the spec**.

**NOTE:** While `/* ... */` are valid multi-line SQL comments, our testing scripts will result in errors on SQL
files using these. Therefore, do NOT use `/* ... */` comments in your `setup.sql` file. You must use SQL comments (`-- ` starting each comment line).

Note the following SQL commands that may prove useful if you using the command line interface for MySQL. You can also find similar functionality in the phpMyAdmin interface.

```
SOURCE setup.sql;       -- runs your setup.sql file
SHOW databases;         -- lists databases in your mysql
USE hw5db;              -- tells mysql to use your hw5db database
SHOW tables;            -- list tables in your currently active (hw5db) database
DESCRIBE <tablename>;   -- gives information about the columns of a table
DROP TABLE <tablename>; -- careful with this one, it deletes a table entirely
```

### Fetching Player Credentials - getcreds.php
**Request Format:** `getcreds.php`   
**Request Type:** `GET`   
**Returned Data Format:** plain text   
**Description:** This PHP file returns the user's player ID (PID) and token. For this assignment,
your PID will be your UW netid. These PID and token values will be used by the front-end code and
our game web service for verifying that players are who they say they are when they play moves in
battle mode, and trade with one another. You will need to generate your token to play games and
trade with other students on our server. To do so, visit
[https://oxford.cs.washington.edu/cse154/pokedex-2/uwnetid/generate-token.php](https://oxford.cs.washington.edu/cse154/pokedex-2/uwnetid/generate-token.php).
The PID and token values displayed should be carefully copy/pasted in your `getcreds.php` file. In
this PHP file, you should print the body containing your PID followed by your token, each on their own
line. Note that there are no query parameters for this file, so you print these values whenever
the web service is called.  
**Example Request:** `getcreds.php`  
**Example Output:** (bricker is the example PID):

```
bricker
poketoken_123456789.987654321
```

### Fetching Pokedex Data - select.php
**Request Format:** `select.php`  
**Request Type:** `GET`  
**Returned Data Format:** JSON  
**Description:** `select.php` should output a JSON response with a key "pokemon" mapping to an array of all Pokemon you have found (your Pokedex table), including the name, nickname, and found date/time for each Pokemon. The array should be empty if the Pokedex table happens to be empty. This PHP web service does not take any query parameters (ignore any parameters passed).  
**Example Request:** `select.php`    
**Example Output:** (abbreviated)  

```
{
"pokemon" : [
    {
      "name" : "bulbasaur",
      "nickname" : "Bulby",
      "datefound" : "2018-05-15 13:54:00"
    },
    {
      "name" : "charmander",
      "nickname" : "CHARMANDER",
      "datefound" : "2018-05-16 08:45:10"
    },
  ...
  ]
}
```

**Example Output** (when Pokedex table is empty)

```
{ "pokemon" : [] }
```

#### Adding a Pokemon to your Pokedex - insert.php
**Request Type:** `POST`  
**Request Parameters**:  
  * `name` - a name of a Pokemon to add
  * `nickname` (optional) - a nickname of added Pokemon  

**Returned Data Format:** JSON   
**Description:** `insert.php` adds a Pokemon to your Pokedex table, given a required `name`
parameter. The `name` should be added to your Pokedex in all-lowercase (for example,
a `name` POST parameter passed with the value `BulbaSAUR` should be saved as `bulbasaur` in the Pokedex table). If passed a `nickname`
parameter, this nickname should also be added with the Pokemon (don't modify the
anything to uppercase or lowercase for the nickname, just store it as it was given). Otherwise, the nickname for
the Pokemon in your Pokedex table should be set to the Pokemon's name in all uppercase (e.g., BULBASAUR
for `name` of `BulbaSAUR` when no nickname parameter is passed). You should also make sure to include the date/time you added the Pokemon. In PHP,
you can get the current date-time in the format for the previously-described SQL `DATETIME` data type using the
following code:

```php
date_default_timezone_set('America/Los_Angeles');
$time = date('y-m-d H:i:s');
```

You should add the result `$time` variable to add to your `datefound` table column.

**Expected Output Format:**
Upon success, you should output a JSON result in the format:
```json
{ "success" : "<name> added to your Pokedex!" }
```
If the Pokemon is already in the Pokedex (as determined by a duplicate name field), you should print a message
with a 400 error header in the JSON format:

```json
{ "error" : "<name> already found." }
```

Nothing should change anything in your Pokedex if there is an error due to a name collision. However, in both
success and error cases, `<name>` should be replaced with the value of the passed `name` (maintaining letter-casing).


### Removing a Pokemon from your Pokedex - delete.php
**Request Type:** `POST`  
**Request Parameters**:
  * `name` - a name of a Pokemon to remove, or
  * `mode` with value `removeall` - removes all Pokemon from your Pokedex  

**Returned Data Format:** JSON  
**Description:**
* If passed name, `delete.php` removes the Pokemon with the given name (case-insensitive) from your
Pokedex. For example, if you have a Charmander in your Pokedex table and a POST request to `delete.php` with
`name` passed as `charMANDER` is made, your Charmander should be removed from your table.
* Otherwise, if passed `mode` of `removeall`, all Pokemon should be removed from your Pokedex table. **Note**: You should
**not** accomplish this by dropping your Pokedex table and re-creating it.

**Expected Output Formats:**
Upon success in using the name parameter, you should print a JSON result in the format:
```json
{ "success" : "<name> removed from your Pokedex!" }
```

If passed a Pokemon name that is not in your Pokedex, you should print a message with a 400 error header in
JSON format:

```json
{ "error" : "<name> not found in your Pokedex." }
```

Your table should then not change as a result.

For both success and error cases, `<name>` in the message should be replaced with the value of the passed name
(maintaining letter-casing).

If instead `mode` is passed as a POST parameter with the value `removeall`, and all Pokemon are successfully removed
from your Pokedex table, you should print a JSON result in the format:

```json
{ "success" : "All Pokemon removed from your Pokedex!" }
```

If passed a mode other than `removeall`, you should print a message with a 400 error header with a message
in the JSON format:
```json
{ "error" : "Unknown mode <mode>." }
```
where `mode` is replaced with whatever value the user passed for this POST request parameter.


### Trading Pokemon - trade.php
**Request Type:** `POST`  
**Request Parameters**:
  * `mypokemon` - name of Pokemon to give up in trade
  * `theirpokemon` - name of Pokemon to receive in trade

**Returned Data Format:** JSON  
**Description:** `trade.php` takes a Pokemon to remove from your Pokedex `mypokemon` (case-insensitive) and a
Pokemon to add to your Pokedex `theirpokemon`.
When adding `theirpokemon` to your Pokedex, the Pokemon name should be added in all lowercase and the Pokemon
should have the default nickname format (i.e. the name in all UPPERCASE). Similar to the
behavior specified in `insert.php`, the date/time added should be that of when the Pokemon is added in _your_ Pokedex.

**Expected Output Formats:**
Upon success, you should print a JSON result in the format:

```json
{ "success" : "You have traded your <mypokemon> for <theirpokemon>!" }
```

If you do not have the passed `mypokemon` in your Pokedex table, you should print a 400 error header with the
following message in JSON format:

```json
{ "error" : "<mypokemon> not found in your Pokedex." }
```
Otherwise, if you already have the passed `theirpokemon` in your Pokedex, you should print a 400 error header
with the following message in JSON format:

```json
{ "error" : "You have already found <theirpokemon>." }
```

If either error occurs, your table should not be changed as a result. For any case, `<mypokemon>` and `<theirpokemon>`
in the JSON response should be replaced with the respective query parameter values (maintaining letter-casing).

### Renaming a Pokemon in your Pokedex - update.php
**Request Type:** `POST`  
**Request Parameters**:
  * `name` - name of Pokemon to rename
  * `nickname` (optional) - new nickname to give to Pokemon

**Returned Data Format:** JSON  
**Description:**
`update.php` updates a Pokemon in your Pokedex table with the given `name` (case-insensitive)
parameter to have the given `nickname` (overwriting any previous nicknames)
If missing the `nickname` POST parameter, the Pokemon's nickname should be replace with the UPPERCASE
version of the Pokemon's name (similar to the case in `insert.php`). So for example, if passed
`name` of `bulbasSAUR` (given you have a Bulbasaur in the table) and no `nickname` parameter is given,
any previous nickname should be replaced with `BULBASAUR`.

**Expected Output Formats:**
Upon success, you should print a JSON result in the format:

```json
{ "success" : "Your <name> is now named <nickname>!" }
```

As in the previous files, `name` and `nickname` should be printed in the same format as the
respective query parameters.

If you do not have the Pokemon with the passed `name` in your Pokedex, you should output the error behavior as
in the same case for `delete.php`. If you are not passed a nickname, your success message should then use the
uppercase version of the pokemon's name for the nickname (i.e. `BULBASAUR` as the format for `<nickname>`).


### common.php
You should factor any shared code into `common.php` and turn it in with the rest of your PHP files.
Recall that you can use `include 'common.php'` at the top of a PHP file to include all functions
that are found in a file called `common.php` (requiring it is in the same directory as the file
including it).

At a minimum, two subsections below should be refactored into `common.php`. You **should** look
for other parts of your code that belongs in this file as well.

#### Error-Handling for Database Connection (Service Unavailable)
Handle any errors related to database-connections (e.g. PDOExceptions) with a "HTTP/1.1 503 Service Unavailable" error and a message output in the JSON format:

```json
{ "error" : "A database error occurred. Please try again later." }
```

#### Error-Handling for Missing Parameters (Invalid Request)
Any of the following invalid request errors should be sent as a "HTTP/1.1 400 Invalid Request" error with descriptive messages having a JSON content type (note the difference between plain text error messages you used in HW4).

For any PHP web service with `POST` parameters, the expected JSON format of the message is specified as follows:

If only one required parameter is missing:

```json
{ "error" : "Missing <parametername> parameter."}
```

If multiple parameters are required and missing:

```json
{ "error" : "Missing <parameter1> and <parameter2> parameter."}
```

In the case that at least one of a number of parameters should be provided (e.g. the `mode` or `name` parameters for `delete.php`), but neither is, the error message should be of the form:

```json
{ "error" : "Missing <parameter1> or <parameter2> parameter."}
```

**These missing parameter error responses should take precedence over any other error for each web service.**

### Other External Requirements
* Your code in `setup.sql` must be valid MySQL - that is, if we were to import it into a database on phpMyAdmin, it would be run without any errors to create/populate the table(s). The `setup-wpl.sql` from Friday's lecture is an example SQL file that would be successfully populated when imported this way.
* All interactions between PHP and SQL should be made with the PDO object, as demonstrated in class. Use the `get_PDO()` function you complete in `common.php` to get a PDO object in your `.php` code. **Do not use other connection methods such as MySQLi**.
* Your PHP files should use `isset` to check for GET and POST parameters before using them.


## Development Strategies

### SQL
This homework should give you a lot of experience using the mysql program to keep track of what changes are
being made to your database.

* Test basic versions of your queries in the phpMyAdmin SQL tab or mysql terminal before
putting them into your PHP.
* Use `try/catch(PDOException $pdoex)` to catch PDO exceptions in your PHP code, and print them for
debugging (you must remove all debugging statements in your final submission though).

### Testing PHP Web Services
The provided front end (`main.html`/`main.min.js`/`lib.min.js`) for this homework is NOT a good
testing program. It assumes that your code works, and makes many calls against your code in quick
succession. We STRONGLY encourage you not to use this as a testing program, but more for a fun application using
your final work.

Instead we encourage you to call your PHP functions with other testing strategies before trying to use your code in concert with
the provided front-end files.

For `GET` requests (`getcreds.php` and `select.php`) the easiest thing to do is simply use a browser
to visit the URL and pass the query params.

For the other PHP files that you implement as `POST` requests, there are a few strategies we recommend, since
it's harder to simulate `POST` requests than `GET` requests. Here are some options:
* Make a dummy HTML page that lets you write JS fetch commands for POSTS, or use the JS console
(`tester.html`/`tester.js` is an example of this)
* Make a dummy HTML page with a form that submits to your PHP program.
* Use a program like Postman [https://www.getpostman.com/](https://www.getpostman.com/) to craft
POST requests against your API.
* One other way is to test with `GET`, and change to `POST` after you are satisfied that it works. However, you
should still test that the `POST` works before you turn your homework in, and for this reason, we encourage
you to use another testing strategy to get into the flow of actually testing POSTs.

### General Develompent Strategy
* Get your database setup, implement `setup.sql` and practice making some database SELECT, INSERT,
UPDATE, DELETE queries in the phpMyAdmin SQL command box or the mysql terminal
* Implement `getcreds.php` to get going on the PHP part of the assignment.
* As you work, be on the lookout for common code to factor into `common.php`
* Implement `select.php` using data that you have manually inserted into the DB
* Implement `insert.php`, and verify that it works first in the database, and then with `select.php`
* Implement `update.php` and `delete.php`
* Implement `trade.php`
* Review all of your files to make sure you've factored out any shared code into `common.php`

## Internal Requirements
For full credit, your page must not only match the external requirements listed above, but must also
demonstrate good use of PHP and SQL and overall code quality. This includes the following requirements:
* Your code in `setup.sql` should be valid MySQL as covered in lecture/section/lab. That is, importing it
in phpMyAdmin (on another computer) in a `hw5db` databse should not result in any errors.
* Your code in `setup.sql` **must** code that **you wrote yourself** and were not generated by exporting from phpMyAdmin or the like.
* Your PHP files should appropriately use GET and POST parameters, and may not use any other superglobals like SERVER or REQUEST.
* Your PHP files should specify the correct content type with the `header` function _before_
  outputting any response, and should only set this when necessary (it's common for students to set this multiple times in their first PHP programs).
* Do not construct a PDO object when you do not use it (e.g. do your checks for required GET/POST parameters first, then construct the PDO if the checks pass). See more information [here](https://courses.cs.washington.edu/courses/cse154/codequalityguide/_site/php/#min-db-calls). This also means you should not be creating more than one database (PDO) object for any single request.
* Decompose your PHP by writing smaller, more generic functions that complete one task rather than a few larger "do-everything" functions - no function should be more than 30 lines of code. Capture common operations as functions to keep code size and complexity from growing, and use `common.php` to factor out functionality shared between files (remember that the `include "common.php"` statement will load all functions defined in `common.php` for access in another file).
* Your PHP code for each file other than `getcreds.php` should have at least one function (if you have factored out any functions in `common.php` other than one that returns a PDO object, using that function in a PHP file will be sufficient).
* You must use the ensure that a users can not inject malicious SQL into your database by properly using PDO prepare/exec
statements for any insert, delete and update queries that use POST parameters sent by a client.
* Do not use the PHP `global` keyword or the `$GLOBAL` array, and localize your variables as much as possible.
* Do not define variables, parameters, or functions that are never used.
* Similar to JS, use `===` over `==` in PHP for strict equality checks.
* Your files should demonstrate consistent and readable source code aesthetics as demonstrated in class and detailed in the [CSE 154 Code Quality Guidelines](https://courses.cs.washington.edu/courses/cse154/codequalityguide/_site/). Part of your grade will come from using consistent indentation, proper naming conventions, curly brace locations, etc.
* Place a comment header **in each file** with your name, section, a brief description of the file (no two PHP files should have the same description)
* Document your PHP functions in a similar manner to our JSDoc requirements (e.g. `@param` and `@returns`). You may also use official [PHPDoc](https://en.wikipedia.org/wiki/PHPDoc) if you'd like.
* When documenting your SQL file, a brief header comment is sufficient with your student information and what your table represents. **Remember to use `--` for comments, not `/* ... */` to submit with GitGrade in this class**.
* Use consistent spacing and indentation with your SQL code (see [SQL Whitespace and Indentation](https://courses.cs.washington.edu/courses/cse154/codequalityguide/_site/sql/#new-line) in the Code
  Quality Guide)
* For your database, table, and columns, you must follow the naming conventions specified in the Database Setup part of this spec.
* Do not include any files in your final repository other than those outlined in "Final Deliverables and Provided Files"

## Grading
This assignment will be out of 30 points. The key areas we will be looking at assess directly relate
to the learning objectives, and your matching the specification for the external behavior as well as
the internal correctness of your code. **NOTE:** While we can not guarantee the same distribution of
points, past rubrics have been split with 60% of the points allocated to external correctness and
the 35% for internal. Thus a **potential** rubric **might be** summarized as:  

### External Correctness (18 pts)
* Database setup
* Web Services
  * player credentials
  * getting pokedex data
  * adding pokedex data
  * removing pokedex data
  * trading pokedex data
  * renaming pokemon
  * error-handling

### Internal Correctness (12 pts)
* PHP
  * Follows CSE 154 Code Quality Guidelines
  * Avoids redundancy, uses functions to encapsulate functionality, and factors out shared
    behavior using functions in `common.php`
  * All functions are documented well including parameters and return values
  * Sets header types appropriately before output
* `setup.sql` works as expected.
* Otherwise good quality code - a catch all for things like indentation, good identifier names, long lines, etc.

## Academic Integrity
All work submitted for your CSE 154 homework assignments must be your own and should not be shared with other students. This includes but is not limited to:
* You may not use code directly from any external sources (no copying and pasting from external sites), other than templates that are explicitly given to students for use in class.
* We expect that the homework you submit is your own work and that you do not receive any inappropriate help from other people or provide inappropriate help to others.
* You must not place your solution to a publicly-accessible web site, neither during nor after the school quarter is over.

Doing any of the above is considered a violation of our course [academic integrity](https://courses.cs.washington.edu/courses/cse154/19sp/syllabus/syllabus.html#academic-conduct)
policy. As a reminder, this page states:

  The Paul G Allen School has an entire page on
  [Academic Misconduct](https://www.cs.washington.edu/academics/misconduct) within the context of
  Computer Science, and the University of Washington has an entire page on how
  [Academic Misconduct](https://www.washington.edu/cssc/for-students/academic-misconduct/) is
  handled on their
  [Community Standards and Student Conduct](https://www.washington.edu/cssc/) Page. Please acquaint
  yourself with both of those pages, and in particular how academic misconduct will be reported to
  the University.
