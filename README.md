# Express.js Stock Market Application

This is a simple Express.js application for managing stock data and favorites. 
Users can view top stocks, search for stocks by name, mark stocks as favorites, view favorite stocks, and remove stocks from favorites.

## Prerequisites

Before running the application, make sure you have the following installed:

- Node.js
- MongoDB Atlas account (or local MongoDB instance)
- npm or yarn

## Installation

1. Clone the repository:



## Install Dependencies
1. cd express-stock-market
2. npm install

Make sure you have two folders namely "converted" and "download" in your current directory.

## API' s 

1. A GET route for the top 10 stocks.
## http://localhost:3000/top-stocks
    Stocks are sorted on the basis of their closing amount in reverse, and we are fetching top 10 by setting LIMIT to 10.

2. A GET route to find stocks by name.
## http://localhost:3000/stocks/ARE&M
    Stocks are seached on the basis of their name.

3.  GET router to get stock price history list for UI graph.
## http://localhost:3000/stock-history/500008
    In this we first create two folders download, converted in which, in download folder we extract zip file from website and download and store it, then convert it into csv format. Now, search using stock price name.


4. A POST route to add a stock to favourites.
## http://localhost:3000/add-favorites/ARE&M
    This is searching for the given stock and making favorites(as stored in mongo) of that stock as true.

5. A GET route to see favourite stocks.
## http://localhost:3000/favorites
    This will return all the stocks for which favorites is true


6. A DELETE route to remove a stock from favourites.
## http://localhost:3000/delete-favorites/ARE&M
This is searching for the given stock and making favorites(as stored in mongo) of that stcok as false.





