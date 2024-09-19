import React from 'react';
import './App.css';
import Header from "./components/Header";
import Carousel from "./components/Carousel";
import ProductGrid from "./components/ProductGrid/ProductGrid";

function App() {
  return (
    <div className="App">
        <Header />
        <Carousel />
        <ProductGrid />
    </div>
  );
}

export default App;
