import React from 'react';
import NewsForm from './newsEditor/NewsForm';
import NewsList from './newsEditor/NewsList';
import './App.css';
import Navbar from './navbar/Navbar';

const App: React.FC = () => {
  const sidebarItems = [
    "News",
    "Events",
    "Deadlines",
    "Colleges",
    "Courses",
    "Exams",
    "Form Filling",
    "Stress Management",
    "Time Management",
    "Mental Wellness",
    "Personal Growth"
  ];

  return (

    <div className="app-wrapper">
      <Navbar />
    <div className="app-container">
      <div className="app-content">
        <NewsList />

        <div className="form-and-sidebar">
          <NewsForm />
          
          <div className="sidebar-wrapper">
  <div className="sidebar-cards">
    {sidebarItems.map(item => (
      <div key={item} className="sidebar-card">{item}</div>
    ))}
  </div>
</div>

        </div>
      </div>
    </div>
    </div>
  );
};

export default App;
