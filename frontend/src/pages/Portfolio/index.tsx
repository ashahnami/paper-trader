import { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import CloseIcon from '@mui/icons-material/Close';

import Navbar from "../../components/navbar";
import { fetchPositions, fetchProfile } from '../../api/userApi';
import { closePosition } from '../../api/stockApi';
import "../../assets/portfolio.css";
import { Position } from '../../entities/Position';

interface Quote {
    "c": number;
    "h": number;
    "l": number;
    "o": number;
    "pc": number;
    "t": number;
}

const Portfolio = () => {
  const { data: positions, isLoading: isLoadingPositions } = useQuery({
    queryKey: ['positions'],
    queryFn: () => fetchPositions(),
  })

  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['profile'],
    queryFn: () => fetchProfile(),
  })

  const [changes, setChanges] = useState<any>([]);
  const [currValues, setCurrValues] = useState<any>([]);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [netBalance, setNetBalance] = useState<number>(0);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [selTicker, setSelTicker] = useState<string>("");

  const styles = {
    negative: { color: 'red' },
    positive: { color: 'green'},
  }

  const { mutateAsync: closePositionMutation } = useMutation({
    mutationFn: closePosition,
    onSuccess: () => {
      setOpenModal(false);
    }
  })

  const updatePrices = async () => {
    try {
      const requests: any = positions?.map((position: Position) =>
        axios.get<Quote>(`https://finnhub.io/api/v1/quote?symbol=${position.symbol}&token=${process.env.REACT_APP_FINNHUB_API_KEY}`)
      );

      const responses = await Promise.all(requests);

      let net: number = 0;

      const updatedChanges = responses?.map((response: any, index: number) => {
        const { c: latestPrice } = response.data;
        const change: number = positions ? parseFloat(((latestPrice - positions[index].averagePrice) / latestPrice * 100).toFixed(2)) : 0;
        return change;
      });

      const currValueChanges = responses.map((response: any, index: number) => {
        const { c: latestPrice } = response.data;
        const currValue: number = positions ? parseFloat((positions[index].shares * parseFloat(latestPrice)).toFixed(2)) : 0;
        net += currValue;
        return currValue;
      });

      setCurrValues(currValueChanges);
      setChanges(updatedChanges);
      profile && setNetBalance(net + profile?.balance);
      setIsFinished(true);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    document.title = "Paper Trading Application";
    if (!isLoadingPositions && !isLoadingProfile) {
      console.log(positions)
      updatePrices();
    }
  }, [isLoadingPositions, isLoadingProfile]);

  return (
    <div className="portfolio">
      <div className="portfolio-container">
        <div className="portfolio-header">
          <h1>Portfolio</h1>
          <div className="balance">
            <div>
              <h4>Net Liquidity</h4>
              <div className="price">{netBalance}</div>
            </div>
            <div>
              <h4>Excess Liquidity</h4>
              <div className="price">{profile?.balance}</div>
            </div>
          </div>
        </div>
        {isFinished ? (
          <table className="portfolio-table">
            <thead>
              <tr className="header-row">
                <th>SYMBOL</th>
                <th>QUANTITY</th>
                <th>CHANGE</th>
                <th>AVG PRICE</th>
                <th>CURRENT VALUE</th>
                <th>UNREALISED P&amp;L</th>
              </tr>
            </thead>
            <tbody>
              {positions?.map((position: Position, i: number) => (
                <tr key={i}>
                  <td style={{ fontWeight: "bold" }}>{position.symbol}</td>
                  <td>{position.shares}</td>
                  <td>{changes[i]}%</td>
                  <td>{position.averagePrice.toFixed(2)}</td>
                  <td>{currValues[i]}</td>
                  <td style={
                    position.averagePrice * position.shares - currValues[i] >= 0 ? styles.positive : styles.negative
                  }>
                    {(position.averagePrice * position.shares - currValues[i]).toFixed(2)}
                  </td>
                  {/* <td className="crossIcon" onClick={() => closePosition(position.stockSymbol)}><CloseIcon /></td> */}
                  <td className="crossIcon" onClick={() => {setOpenModal(true); setSelTicker(position.symbol)}}><CloseIcon /></td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : "Loading positions..."}
      </div>

      {openModal && 
      <>
        <div className="overlay" />
        <div className="modal">
          <div className="modal-container">
            <div>Are you sure to want to sell this stock?</div>
            <div className="footer">
              <button onClick={() => setOpenModal(false)}>Cancel</button>
              <button className="continue" onClick={async () => {
                try {
                  await closePositionMutation(selTicker)
                } catch (e) {
                  console.log(e);
                }
              }}>Continue</button>
            </div>
          </div>
        </div>
      </>
      }

    </div>
  );
};

export default Portfolio;