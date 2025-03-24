import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { logRouteChange } from '../utils/debugUtils';

// Simple component to log route changes - helps with debugging
const RouteLogger = () => {
  const location = useLocation();
  
  useEffect(() => {
    logRouteChange(location);
  }, [location]);
  
  return null; // This component doesn't render anything
};

export default RouteLogger;
