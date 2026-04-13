import { useMutation, useQuery } from '@tanstack/react-query'
import { fetchPositions, fetchProfile } from '../../api/userApi'
import { useEffect, useState } from 'react';
import { closePosition } from '../../api/stockApi';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {PositionPublic, StockPublic, WatchedStockPublic} from "../../entities/types";
import httpClient from "../../api/httpClient";

interface Quote {
    "c": number;
    "h": number;
    "l": number;
    "o": number;
    "pc": number;
    "t": number;
}

const Positions = () => {
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
    const [selId, setSelId] = useState<number>(0);
    
    const navigate = useNavigate();
  
    const styles = {
      negative: { color: '#d31a24' },
      positive: { color: '#3f8f29'},
    }
  
    const { mutateAsync: closePositionMutation } = useMutation({
      mutationFn: closePosition,
      onSuccess: () => {
        setOpenModal(false);
      }
    })
  
    const updatePrices = async () => {
      try {
        const requests: any = positions?.map(async (position: PositionPublic) => {
            try {
                const stock = (await httpClient.get<StockPublic>(`/api/stocks/${position.stock_id}`)).data;
                return axios.get<Quote>(`https://finnhub.io/api/v1/quote?symbol=${stock.ticker}&token=${process.env.REACT_APP_FINNHUB_API_KEY}`)
            } catch (error) {
                console.log("error fetching stock")
            }
            return 0;
        });
  
        const responses = await Promise.all(requests);
  
        let net: number = 0;
  
        const updatedChanges = responses?.map((response: any, index: number) => {
          const { c: latestPrice } = response.data;
          const change: number = positions ? parseFloat(((latestPrice - positions[index].average_price) / latestPrice * 100).toFixed(2)) : 0;
          return change;
        });
  
        const currValueChanges = responses.map((response: any, index: number) => {
          const { c: latestPrice } = response.data;
          const currValue: number = positions ? parseFloat((positions[index].quantity * parseFloat(latestPrice)).toFixed(2)) : 0;
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
          updatePrices();
        }
      }, [isLoadingPositions, isLoadingProfile]);

  return (
    <div className="portfolio">
    <div className="portfolio-container">
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
            {positions?.map((position: PositionPublic, i: number) => (
              <tr key={i} onClick={() => navigate(`/stock/${position.stock_id}`, { state: { id: position.id }})}>
                {/*<td>{position.stock_id}</td>*/}
                  <td>temp stock ticker</td>
                <td>{position.quantity}</td>
                <td style={
                  changes[i] >= 0 ? styles.positive : styles.negative
                }>{changes[i]}%</td>
                <td>{position.average_price}</td>
                <td>{currValues[i]}</td>
                <td style={
                  position.average_price * position.quantity - currValues[i] >= 0 ? styles.positive : styles.negative
                }>
                  {(position.average_price * position.quantity - currValues[i]).toFixed(2)}
                </td>
                {/* <td className="crossIcon" onClick={() => closePosition(position.stockSymbol)}><CloseIcon /></td> */}
                <td className="crossIcon" onClick={() => {setOpenModal(true); setSelId(position.id)}}><CloseIcon /></td>
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
                await closePositionMutation(selId)
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
  )
}

export default Positions