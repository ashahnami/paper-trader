import { useEffect, useState } from 'react'
import axios from 'axios'

interface News {
    "category": string;
    "datetime": number;
    "headline": string;
    "id": number;
    "image": string;
    "related": string;
    "source": string;
    "summary": string;
    "url": string;
}

const News = () => {
    const [news, setNews] = useState<News[]>();

    const fetchNews = async () => {
        const { data: news } = await axios.get(`https://finnhub.io/api/v1/news?category=general&token=${process.env.REACT_APP_FINNHUB_API_KEY}`);
        setNews(news);
    }

    function calculateTime(timestamp : number) {
        const now = Math.floor(Date.now() / 1000);

        const minuteDifference = Math.floor((now - timestamp) / 60);
        if (minuteDifference < 60) {
            return `${minuteDifference}m`;
        }

        const hourDifference = Math.floor(minuteDifference / 60);
        if (hourDifference < 24) {
            return `${hourDifference}h`;
        }

        const dayDifference = Math.floor(hourDifference / 24);
        return `${dayDifference}d`;
    }
    
    useEffect(() => {
    document.title = "Home";
    fetchNews();
    }, [])
      
  return (
    <table>
        <tbody>
            {news?.slice(0, 5).map((newsItem, index) => (
            <tr key={index} onClick={() => window.location.replace(newsItem.url)}>
                <img src={newsItem.image} className='newsImage' />

                <td className='content'>
                    <div><span className='source'>{newsItem.source}</span> {calculateTime(newsItem.datetime)}</div>

                    <div>{newsItem.headline}</div>
                </td>
            </tr>
            ))}
        </tbody>
    </table>
  )
}

export default News