/**
 * Simple utility to log important app events
 */
export const logRouteChange = (location) => {
  console.log('Route changed:', location.pathname);
};

export const logComponentMount = (componentName) => {
  console.log(`Component mounted: ${componentName}`);
};
