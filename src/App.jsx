import React from 'react';
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import RoutesComponent from './routes';
import ScrollToTop from "./Components/ScrollToTop";

function App() {
  return (
    <div className="App">
      <ScrollToTop />
      <Navbar />
      <RoutesComponent />
      <Footer />
    </div>
  );
}

export default App;
