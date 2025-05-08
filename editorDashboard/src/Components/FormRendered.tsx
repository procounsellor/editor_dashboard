// FormRenderer.tsx
import React from 'react';
import NewsForm from '../newsEditor/NewsForm';
import EventsForm from '../Events/EventsForm';
import ExamsForm from '../Exams/ExamsForm';
import DeadlinesForm from '../Deadlines/DeadlinesForm';
import CollegesForm from '../College/CollegesForm';
import CoursesForm from '../Courses/CoursesForm';
import FormFillingForm from '../FormFilling/FormFillingForm';
import StressManagementForm from '../StressManagement/StressManagementForm';
import TimeManagementForm from '../TimeManagement/TimeManagementForm';
import MentalWellnessForm from '../MentalWellness/MentalWellnessForm';
import PersonalGrowthForm from '../PersonalGrowth/PersonalGrowthForm';


interface FormRendererProps {
  activeForm: string;
}

const FormRenderer: React.FC<FormRendererProps> = ({ activeForm }) => {
  switch (activeForm) {
    case 'News':
      return <NewsForm />;
    case 'Events':
      return <EventsForm />;
    case 'Deadlines':
      return <DeadlinesForm />;
    case 'Colleges':
      return <CollegesForm />;
    case 'Courses':
      return <CoursesForm />;
    case 'Exams':
      return <ExamsForm />;
    case 'Form Filling':
      return <FormFillingForm />;
    case 'Stress Management':
      return <StressManagementForm />;
    case 'Time Management':
      return <TimeManagementForm />;
    case 'Mental Wellness':
      return <MentalWellnessForm />;
    case 'Personal Growth':
      return <PersonalGrowthForm />;
    default:
      return <div>Select a form from the sidebar</div>;
  }
};

export default FormRenderer;
