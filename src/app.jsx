import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './Header/header';
import DisplayVinyl from './vinyls/displayVinyls'
import VinylInfo from './vinyls/vinylInfo';
import './app.css'

export function App() {
  return (
    <Router>
      <Header />
      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border-2 border-gray-300 rounded-xl p-4 shadow-lg">
            <Routes>
              <Route path="/" element={<DisplayVinyl />} />
              <Route path="/vinyl/:id" element={<VinylInfo />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}