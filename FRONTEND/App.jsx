import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import EventList from "./components/EventList";
import EventForm from './components/EventForm';
import EventDetail from './pages/EventDetail';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<EventList />} />
          <Route path="/create" element={<EventForm />} />
          <Route path="/edit/:id" element={<EventForm />} />
          <Route path="/event/:id" element={<EventDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;