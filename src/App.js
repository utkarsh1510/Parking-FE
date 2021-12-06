import logo from './logo.svg';
import './App.css';
import Session from './components/Session';
import { Routes, Route} from 'react-router-dom';
import Dashboard from './components/Dashboard';

function App() {
  return (
      <Routes>
        <Route exact path="/" element={<Session/ >} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
  );
}

export default App;
