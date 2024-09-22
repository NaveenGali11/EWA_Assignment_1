import React, {useEffect, useState} from 'react';
import ProductItem from "../ProductItem/ProductItem";
import {Col, Container, Row} from 'reactstrap';
import {getProducts, SuccessfullProduct} from "../../sevices/ProductService";
import {useNavigate} from "react-router-dom";

const ProductGrid: React.FC = () => {
    const [products, setProducts] = useState<SuccessfullProduct[]>([]);
    const [groupedProducts, setGroupedProducts] = useState<{ [category: string]: SuccessfullProduct[] }>({});
    const navigate = useNavigate();

    useEffect(() => {
        getProducts().then((res) => {
            console.log(res);
            const productsByCategory = groupByCategory(res.products);
            setProducts(res.products);
            setGroupedProducts(productsByCategory);
        });
    }, []);

    // Function to group products by category
    const groupByCategory = (products: SuccessfullProduct[]) => {
        return products.reduce((acc, product) => {
            const category = product.category || 'Uncategorized';  // Default to 'Uncategorized' if no category
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(product);
            return acc;
        }, {} as { [category: string]: SuccessfullProduct[] });
    };

    // Function to capitalize the first letter of each category
    const capitalizeFirstLetter = (str: string) => {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };

    return (
        <Container>
            {/* Loop through each category */}
            {Object.keys(groupedProducts).map((category, categoryIndex) => (
                <div key={categoryIndex}>
                    <h2>{capitalizeFirstLetter(category)}</h2> {/* Capitalize the first letter of the category */}
                    <Row>
                        {/* Render the products in the current category */}
                        {groupedProducts[category].map((product, productIndex) => (
                            <Col lg="3" sm="6" key={productIndex} style={{
                                marginBottom: "10px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center"
                            }}>
                                <ProductItem
                                    name={product.name}
                                    price={product.price}
                                    description={product.description}
                                    onViewClick={() => navigate("/products/" + product.id)} id={''} category={''}
                                    imageUrl={product.imageUrl} manufacturer={product.manufacturer}
                                    manufacturer_rebate={product.manufacturer_rebate} on_sale={product.on_sale}
                                    retailer_discount={product.retailer_discount} warranty={product.warranty}
                                    image={product.image}/>
                            </Col>
                        ))}
                    </Row>
                </div>
            ))}
        </Container>
    );
};

export default ProductGrid;
