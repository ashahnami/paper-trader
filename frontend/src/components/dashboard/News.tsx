import { useEffect } from 'react'
import { useQuery } from "@tanstack/react-query";
import { getNews } from "@/api/stockApi";
import { NewsItem } from "@/entities/types";


const News = () => {
    const { data: news } = useQuery({
        queryKey: ['news'],
        queryFn: () => getNews(),
    })

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
    }, [])
      
  return (
    <div className='newsTable'>
        {news?.slice(0, 5).map((newsItem: NewsItem, index: number) => (
        <div key={index} onClick={() => window.location.replace(newsItem.url)} className='row'>
            <img src={newsItem.image} className='newsImage' />

            <div className='content'>
                <div><span className='source'>{newsItem.source}</span> {calculateTime(newsItem.datetime)}</div>

                <div>{newsItem.headline}</div>
            </div>
        </div>
        ))}
    </div>
  )
}

export default News