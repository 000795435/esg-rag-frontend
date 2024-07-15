import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter as Router, Route, Navigate, Routes } from 'react-router-dom';

import Chatbot from './page/Chatbot';
import PDF from './page/PDF';
import NavBar from './component/NavBar';

function App() {
  return (
    <div className="App">
      <Router>
        <NavBar />

        <Routes>
          <Route path='/' exact element={<Chatbot />} />
          <Route path='/pdf/' exact element={<PDF />} />
          <Route path='*' element={<Navigate to='/' replace={true} />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
