# Paper Trading Web App

## About Project

A paper trading platform that allows users to paper trade stocks.

### Technologies Used

- React
- Flask
- PostgreSQL
- Redis

## Getting Started

### Requirements

- Python
- Yarn
- Node.js
- Redis

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

### Usage

Enter the following secret keys in the `backend` folder in a .env file.

```env
DATABASE_URI=YOUR_POSTGRES_DATABASE_URI
SECRET_KEY=ANY_SECRET_KEY
```

This platform makes use of two different API keys. One is for the Finnhub API and other is for the Alpha Vantage API.

Enter the API keys in the `frontend` folder in a .env file.

```env
ALPHAVANTAGE_API_KEY=YOUR_ALPHAVANTAGE_API_KEY
FINNHUB_API_KEY=YOUR_FINNHUB_API_KEY
```

### Running

Run the following command in the backend folder to run the Flask application.

```
$ python app.py
```

Then run the following command in the frontend folder to run the React app.

```
$ yarn start
```

The web browser should automatically open to: [http://localhost:3000/](http://localhost:3000)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
