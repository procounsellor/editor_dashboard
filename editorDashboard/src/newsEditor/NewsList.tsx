import React, { useState, useEffect } from 'react';
import './NewsList.css';

interface NewsItem {
  newsId: string;
  descriptionParagraph: string;
  fullNews: string;
  imageUrl: string;
  date: {
    seconds: number;
    nanos: number;
  };
}

const NewsList: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8080/api/news');
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        setNews(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch news. Please try again later.');
        console.error('Error fetching news:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  // Format date from Firebase timestamp
  const formatDate = (seconds: number) => {
    const date = new Date(seconds * 1000);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="news-list-container">
      <h2 className="news-list-title">Recent News</h2>
      
      {loading && (
        <div className="news-list-loading">
          <div className="news-list-loader"></div>
          <p>Loading news...</p>
        </div>
      )}
      
      {error && (
        <div className="news-list-error">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="retry-button"
          >
            Retry
          </button>
        </div>
      )}
      
      {!loading && !error && news.length === 0 && (
        <div className="no-news">
          <p>No news articles available.</p>
        </div>
      )}
      
      <div className="news-items-container">
        {news.map((item) => (
          <div key={item.newsId} className="news-item">
            <div className="news-item-image">
              <img src={item.imageUrl} alt={item.descriptionParagraph} />
            </div>
            <div className="news-item-content">
              <h3 className="news-item-title">{item.descriptionParagraph}</h3>
              <p className="news-item-date">{formatDate(item.date.seconds)}</p>
              <p className="news-item-preview">
                {item.fullNews.substring(0, 100)}...
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsList;