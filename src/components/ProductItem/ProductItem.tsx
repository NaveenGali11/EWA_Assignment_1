import {FC} from "react";
import {Product} from "../../types";
import {Button, Card, CardBody, CardText, CardTitle} from "reactstrap";


const ProductItem: FC<Product> = ({name, price, description, image, accessories}) => {
    return (
        <Card
            style={{
                width: '18rem',
                padding: '10px',
            }}
        >
            <img
                alt="Sample"
                src={image ? image : "https://picsum.photos/300/200"}
                style={{
                    height: '200px',
                    objectFit: "contain"
                }}
            />
            <CardBody>
                <CardTitle tag="h5">
                    {name}
                </CardTitle>
                <CardText>
                    {description}
                </CardText>
                <CardText>
                    $ {price}
                </CardText>
                <Button color="primary">
                    View
                </Button>
            </CardBody>
        </Card>
    );
};

export default ProductItem;