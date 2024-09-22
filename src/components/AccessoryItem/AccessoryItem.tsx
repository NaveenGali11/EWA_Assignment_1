import {FC} from "react";
import {Button, Card, CardBody, CardText, CardTitle} from "reactstrap";

interface ProductAccessory {
    id: string,
    product_id: string,
    price: number,
    name: string,
    description: string,
    imageUrl: string
}

const AccessoryItem: FC<ProductAccessory> = ({name, description, price, imageUrl}) => {
    return (
        <Card
            style={{
                width: '18rem',
                padding: '10px',
            }}
        >
            <img
                alt="image"
                src={imageUrl ? imageUrl : "https://picsum.photos/300/200"}
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
                    Add To Cart
                </Button>
            </CardBody>
        </Card>
    );
};

export default AccessoryItem;