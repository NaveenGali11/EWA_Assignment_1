import React from 'react';
import ProductItem from "../ProductItem/ProductItem";
import { Container, Row, Col } from 'reactstrap';
import {Accessory} from "../../types";

interface AccessoryGridProps {
    accessories: Accessory[];
}

const AccessoryGrid: React.FC<AccessoryGridProps> = ({accessories}) => {
    return (
        <Container>
            {accessories.map((accessory, accessoryIndex) => (
                <div key={accessoryIndex}>
                    <h2>{accessory.name}</h2>
                    <Row>
                        <Col sm="4" key={accessoryIndex}>
                            <ProductItem
                                name={accessory.name}
                                price={accessory.price}
                                description={accessory.description}
                                image={accessory.image}
                            />
                        </Col>
                    </Row>
                </div>
            ))}
        </Container>
    );
};

export default AccessoryGrid;
