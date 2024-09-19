import React from 'react';
import productsData from '../../products.json';
import ProductItem from "../ProductItem/ProductItem";
import { Container, Row, Col } from 'reactstrap';

const ProductGrid: React.FC = () => {
    return (
        <Container>
            {productsData.categories.map((category, categoryIndex) => (
                <div key={categoryIndex}>
                    <h2>{category.name}</h2>
                    <Row>
                        {category.products.map((product, productIndex) => (
                            <Col lg="3" sm="6" key={productIndex} style={{
                                marginBottom: "10px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}>
                                <ProductItem
                                    name={product.name}
                                    price={product.price}
                                    description={product.description}
                                    image={product.image}
                                    accessories={product.accessories}
                                />
                            </Col>
                        ))}
                    </Row>
                </div>
            ))}
        </Container>
    );
};

export default ProductGrid;
