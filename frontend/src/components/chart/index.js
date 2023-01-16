import React, { useEffect, useRef } from 'react';
import './style.css';

let tvScriptLoadingPromise;

export default function StockChart(stock) {
  const onLoadScriptRef = useRef();

  const tradingViewLink = "https://www.tradingview.com/symbols/NASDAQ-" + stock.ticker + "/"

  useEffect(
    () => {
      onLoadScriptRef.current = createWidget;

      if (!tvScriptLoadingPromise) {
        tvScriptLoadingPromise = new Promise((resolve) => {
          const script = document.createElement('script');
          script.id = 'tradingview-widget-loading-script';
          script.src = 'https://s3.tradingview.com/tv.js';
          script.type = 'text/javascript';
          script.onload = resolve;

          document.head.appendChild(script);
        });
      }

      tvScriptLoadingPromise.then(() => onLoadScriptRef.current && onLoadScriptRef.current());

      return () => onLoadScriptRef.current = null;

      function createWidget() {
        if (document.getElementById('tradingview_3d9ff') && 'TradingView' in window) {
          new window.TradingView.widget({
            autosize: true,
            symbol: "NASDAQ:" + stock.ticker,
            interval: "D",
            timezone: "Etc/UTC",
            theme: "light",
            style: "1",
            locale: "en",
            toolbar_bg: "#f1f3f6",
            enable_publishing: false,
            hide_top_toolbar: true,
            save_image: false,
            container_id: "tradingview_3d9ff"
          });
        }
      }
    },
    [stock.ticker]
  );

  return (
    <div className='stockChartContainer'>
      <div id='tradingview_3d9ff' />
      <div className="tradingview-widget-copyright">
        <a href={tradingViewLink} rel="noopener" target="_blank"><span className="blue-text">{stock.ticker} stock chart</span></a> by TradingView
      </div>
    </div>
  );
}