import './App.css';
import CompanyGrid from './Components/Grid';
import CustomTable from './Components/Custom/CustomTable';
import { Route, Routes, } from 'react-router-dom'
import GridPage from './Components/GridPage/GridPage';
import WorkBeanch from './Components/WorkBeanch/WorkBeanch';

function App() {
  return (
    // <Router>
    <Routes>
      <Route path="/" element={<CompanyGrid />} />
      <Route path="/details" element={<CustomTable />} />
      <Route path="/dashboard" element={<GridPage />} />
      <Route path="/workbeanch" element={<WorkBeanch />} />
    </Routes>
    // </Router>
  );
}

export default App;
