import { useMutation, useQuery } from '@tanstack/react-query'
import { fetchPositions } from '../../api/userApi'
import { useEffect, useState } from 'react';
import {closePosition } from '../../api/stockApi';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import { PositionPublic } from "../../entities/types";

const Positions = () => {
    const { data: positions, isFetched: positionsFetched, refetch } = useQuery({
      queryKey: ['positions'],
      queryFn: () => fetchPositions(),
      initialData: []
    })
  
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
        refetch();
      }
    })
  
    useEffect(() => {
        document.title = "Paper Trading Application";
      }, []);

  return (
    <div className="portfolio">
    <div className="portfolio-container">
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
              <tr key={i} onClick={() => navigate(`/stock/${position.symbol}`, { state: { id: position.stock_id }})}>
                <td>{position.symbol}</td>
                <td>{position.quantity}</td>
                <td style={
                  position.pc >= 0 ? styles.positive : styles.negative
                }>{position.pc}%</td>
                <td>{position.average_price}</td>
                <td>{position.current_value}</td>
                <td style={
                  position.current_value - position.average_price - position.quantity >= 0 ? styles.positive : styles.negative
                }>
                  {(position.current_value - position.average_price - position.quantity).toFixed(2)}
                </td>
                {/* <td className="crossIcon" onClick={() => closePosition(position.stockSymbol)}><CloseIcon /></td> */}
                <td className="crossIcon" onClick={(e) => {e.stopPropagation(); setOpenModal(true); setSelId(position.id)}}><CloseIcon /></td>
              </tr>
            ))}
          </tbody>
        </table>
    </div>

    {openModal && 
    <>
      <div className="overlay" />
      <div className="modal">
        <div className="modal-container">
          <div>Are you sure that you want to close this position?</div>
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
