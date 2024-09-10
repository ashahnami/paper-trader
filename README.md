<h1 align="center">Paper trader</h1>

<p align="center">
<img alt="MIT License" src="https://img.shields.io/badge/License-MIT-yellow.svg">
</p>

A paper trading platform where users can trade stocks.

## Getting Started

### Prerequisites

Ensure the following software is installed:

- [Python](https://www.python.org/downloads/)
- [Node.js](https://nodejs.org/)
- [Yarn](https://classic.yarnpkg.com/en/docs/install)
- [Redis](https://redis.io/docs/latest/operate/oss_and_stack/install/install-redis/)

### Installation

#### Cloning the repository

Clone the repository over HTTPS by running the following:

```bash
git clone https://github.com/ashahnami/paper-trader.git
```

Navigate to the `backend` folder, and install the Python dependencies by typing the following command:

```bash
pip install -r requirements.txt
```

Then navigate to the `frontend` folder, and install the Yarn dependencies by typing the following command:

```bash
yarn install
```

### Usage

#### Backend

The project uses a PostgreSQL database in the backend, which can be run either locally or on the cloud.

In the `backend` folder, rename the file `.env.example` to `.env` and enter your secret keys.

```env
DATABASE_URI=YOUR_POSTGRES_DATABASE_URI
SECRET_KEY=ANY_SECRET_KEY
```

DATABASE_URI should be formatted as shown below:

```
postgresql+psycopg://[username]:[password]@[host]:[port]/[database_name]
```

#### Frontend

This platform makes use of two different API keys. One is for the Finnhub API and other is for the Alpha Vantage API.

In the `frontend` folder, rename the file `.env.example` to `.env` and enter your secret keys.

```env
ALPHAVANTAGE_API_KEY=YOUR_ALPHAVANTAGE_API_KEY
FINNHUB_API_KEY=YOUR_FINNHUB_API_KEY
```

### Running

Run the following command in the `backend` folder to run the Flask application.

```bash
flask run
```

Then run the following command in the `frontend` folder to run the React app.

```bash
yarn start
```

The web browser should automatically open to: [http://localhost:3000/](http://localhost:3000)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
