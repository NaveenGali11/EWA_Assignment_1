import ProductGrid from "../components/ProductGrid/ProductGrid";
import React from "react";
import Carousel from "../components/Carousel";

const Home: React.FC = () => {
    return (
        <div>
            <Carousel/>
            <ProductGrid/>
        </div>
    )
}

export default Home;