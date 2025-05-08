// Sidebar.tsx
import React from 'react';

const sidebarItems = [
  'News',
  'Events',
  'Deadlines',
  'Colleges',
  'Courses',
  'Exams',
  'Form Filling',
  'Stress Management',
  'Time Management',
  'Mental Wellness',
  'Personal Growth',
];

interface SidebarProps {
  activeForm: string;
  setActiveForm: (form: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeForm, setActiveForm }) => {
  return (
    <div className="sidebar-cards">
      {sidebarItems.map((item) => (
        <div
          key={item}
          className={`sidebar-card ${activeForm === item ? 'active' : ''}`}
          onClick={() => setActiveForm(item)}
        >
          {item}
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
