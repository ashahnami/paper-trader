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
    
      useEffect(() => {
        document.title = "Home";
        fetchNews();
      }, [])
      
  return (
    <table>
        <tbody>
            {news?.slice(0, 5).map((newsItem, index) => (
            <tr key={index} onClick={() => window.location.replace(newsItem.url)}>
                <td className="image">
                    <img src={newsItem.image} width={200} />
                </td>

                <td className="headline">
                    <div>{newsItem.headline}</div>
                </td>
            </tr>
            ))}
        </tbody>
    </table>
  )
}

export default News