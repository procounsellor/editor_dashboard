import React from 'react';
import NewsForm from './newsEditor/NewsForm';
import NewsList from './newsEditor/NewsList';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="app-container">
      <div className="app-content">
        <NewsList />
        <NewsForm />
      </div>
    </div>
  );
};

export default App;