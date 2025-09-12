"""Stock-related routes."""

from flask import Blueprint, jsonify

from app.models.stock import Stock

bp = Blueprint('stocks', __name__, url_prefix='/stocks')


@bp.route("/", methods=["GET"])
def get_all_stocks():
    """Gets id, symbol and description of all stocks."""
    return jsonify({
        "stocks": [{"id": stock.id, "symbol": stock.ticker, "description": stock.description} 
                   for stock in Stock.query.all()]
    }), 200


@bp.route("/stock/<ticker>", methods=["GET"])
def get_stock_info(ticker):
    """Gets ticker, name and market for a singe stock."""
    stock = Stock.query.filter_by(ticker=ticker).first()

    if not stock:
        return jsonify({"error": "Stock not found"}), 404

    return jsonify({
        "ticker": ticker,
        "name": stock.name,
        "market": stock.market,
    })
