# Paper Trading Web App

## About Project

A Paper Trading web application that allows users to paper trade US market stocks.

### Technologies Used

- React
- Flask
- PostgreSQL
- Redis

## Quick Start

### Requirements

- Python
- Yarn

### Installation

Clone and `cd` into the `paper-trading-application` directory.

Navigate to the `backend` folder, and install the dependencies by typing the following command:

```
$ pip install -r requirements.txt
```

Then navigate to the `frontend` folder, and install the dependencies by typing the following command:

```
$ yarn install
```

Enter the following secret keys in the `backend` folder in a .env file.

```env
DATABASE_URI=YOUR_POSTGRES_DATABASE_URI
SECRET_KEY=ANY_SECRET_KEY
```

Enter the following secret keys in the `frontend` folder in a .env file.

```env
API_KEY = YOUR_ALPHAVANTAGE_API_KEY
REACT_APP_FINNHUB_API_KEY = YOUR_FINNHUB_API_KEY
```