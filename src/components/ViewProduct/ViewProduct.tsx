import React, {useEffect, useState} from "react";
import {Button, Col, Container, Row} from "reactstrap";
import {useParams} from "react-router-dom";
import {FullProduct, getSingleProduct} from "../../sevices/ProductService";
import AccessoryItem from "../AccessoryItem/AccessoryItem";

const ViewProduct = () => {
    const {id} = useParams<{ id: string }>();
    const [product, setProduct] = useState<FullProduct | null>(null);

    useEffect(() => {
        if (id) {
            getSingleProduct(id).then((res) => {
                console.log("SINGLE PRODUCT", res);
                setProduct(res); // Assuming the response returns an object with a "product" key
            }, (err) => {
                console.log("ERROR", err);
            })
        }
    }, [id]);

    if (!product) {
        return <div>Loading...</div>;
    }

    return (
        <Container style={{marginTop: '20px'}}>
            <Row>
                {/* Product Image Section */}
                <Col lg="6" sm="12">
                    <div style={{textAlign: 'center'}}>
                        <img
                            src={product.imageUrl}
                            alt={product.name}
                            style={{
                                maxWidth: '100%',
                                maxHeight: '500px',
                                objectFit: 'contain',
                                border: '1px solid #ddd',
                                padding: '10px',
                                backgroundColor: '#fff'
                            }}
                        />
                    </div>
                </Col>

                {/* Product Details Section */}
                <Col lg="6" sm="12">
                    <div>
                        <h1>{product.name}</h1>
                        <p>{product.description}</p>
                        <h4 style={{color: '#b12704'}}>${parseFloat(product.price)}</h4>
                        <p><strong>Manufacturer:</strong> {product.manufacturer}</p>

                        {product.on_sale && (
                            <p style={{color: 'green'}}><strong>On Sale!</strong></p>
                        )}

                        {product.warranty ? (
                            <p><strong>Warranty:</strong> Included</p>
                        ) : <p><strong>Warranty:</strong> Not Included</p>}

                        <div style={{marginTop: '20px'}}>
                            <Button color="primary" size="lg" block>Add to Cart</Button>
                        </div>
                    </div>
                </Col>
            </Row>

            {/* Accessories Section */}
            {product.accessories && product.accessories.length > 0 && (
                <>
                    <h3 style={{marginTop: '30px'}}>Accessories</h3>
                    <Row>
                        {product.accessories.map((accessory, index) => (
                            <Col lg="4" sm="6" key={index} style={{marginBottom: '20px'}}>
                                <div style={{
                                    
                                    padding: '10px',
                                    backgroundColor: '#fff',
                                    textAlign: 'center'
                                }}>
                                    <AccessoryItem id={accessory.id} product_id={accessory.product_id}
                                                   price={accessory.price} name={accessory.name}
                                                   description={accessory.description} imageUrl={accessory.imageUrl}/>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </>
            )}
        </Container>
    );
}

export default ViewProduct;
