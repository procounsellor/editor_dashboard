import React, { useState } from 'react';
import NewsList from './newsEditor/NewsList';
import Sidebar from './Components/Sidebar';
import FormRenderer from './Components/FormRendered';
import './App.css';
import Navbar from './navbar/Navbar';

const App: React.FC = () => {
  const [activeForm, setActiveForm] = useState('News');

  return (
    <div className="app-wrapper">
      <Navbar />

      <div className="app-container">
        <div className="app-content">

          {/* ✅ Wrap NewsList properly to apply CSS */}
          <div className="news-list-container">
            <NewsList />
          </div>

          {/* Form + Sidebar wrapper */}
          <div className="form-and-sidebar">

            {/* ✅ Make sure this has flex: 1 */}
            <div className="news-form-wrapper">
              <FormRenderer activeForm={activeForm} />
            </div>

            {/* ✅ Sidebar in scrollable container */}
            <div className="sidebar-wrapper">
              <Sidebar activeForm={activeForm} setActiveForm={setActiveForm} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
