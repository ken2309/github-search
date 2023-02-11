import './App.css';
import AppProvider from './AppProvider';
import RouterConfig from './route';
function App() {
  return (
    <AppProvider>
      <RouterConfig />
    </AppProvider>
  );
}

export default App;
