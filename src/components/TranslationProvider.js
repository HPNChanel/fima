import React, { useContext } from 'react';
import { AppContext } from '../App';
import { createTranslator } from '../utils/translations';

// Higher-order component to provide translation function to components
export const withTranslation = (Component) => {
  return (props) => {
    const { language } = useContext(AppContext);
    const t = createTranslator(language);
    
    return <Component {...props} t={t} />;
  };
};

// React Hook for using translations in functional components
export const useTranslation = () => {
  const { language } = useContext(AppContext);
  return createTranslator(language);
};

// A component that injects translations into its children
export const TranslationProvider = ({ children }) => {
  const { language } = useContext(AppContext);
  const t = createTranslator(language);
  
  return React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { t });
    }
    return child;
  });
};

export default TranslationProvider;
