import React from 'react';
import logo from './logo.svg';
import './App.css';
import Header from "./components/Header";
import Carousel from "./components/Carousel";
import Products from "./products.json";
import {Category, Product} from "./types";

function App() {
  return (
    <div className="App">
        <Header />
        <Carousel />
    </div>
  );
}

export default App;
