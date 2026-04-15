import { useMutation, useQuery } from '@tanstack/react-query'
import { fetchPositions, fetchProfile } from '../../api/userApi'
import { useEffect, useState } from 'react';
import {closePosition, getStocksQuotes} from '../../api/stockApi';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {PositionPublic, Quote, StockPublic, WatchedStockPublic} from "../../entities/types";
import httpClient from "../../api/httpClient";

const Positions = () => {
    const { data: positions, isFetched: positionsFetched } = useQuery({
      queryKey: ['positions'],
      queryFn: () => fetchPositions(),
      initialData: []
    })
  
    const { data: profile, isFetched: profileFetched } = useQuery({
      queryKey: ['profile'],
      queryFn: () => fetchProfile()
    })

    const { data: quotes, refetch: refetchQuotes } = useQuery({
        queryKey: ['positions_quotes'],
        queryFn: () => getStocksQuotes(positions.map((position: PositionPublic) => position.stock_id)),
        enabled: false
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
        await refetchQuotes()

        let net: number = 0;
  
        const updatedChanges = quotes?.map((quote: Quote, index: number) => {
          const latestPrice: number = quote.c;
          const change: number = positions ? parseFloat(((latestPrice - positions[index].average_price) / latestPrice * 100).toFixed(2)) : 0;
          return change;
        });
  
        const currValueChanges = quotes?.map((quote: Quote, index: number) => {
          const latestPrice: number = quote.c;
          const currValue: number = positions ? parseFloat((positions[index].quantity * latestPrice).toFixed(2)) : 0;
          net += currValue;
          return currValue;
        });
  
        setCurrValues(currValueChanges);
        setChanges(updatedChanges);
        profile && setNetBalance(net + profile?.balance);
        setIsFinished(true);
    };

    useEffect(() => {
        document.title = "Paper Trading Application";
        if (positionsFetched) {
            setChanges(positions.map(_ => 1))
          updatePrices().then(r => console.log("UPDATING PRICES"));
        }
      }, [positionsFetched]);

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