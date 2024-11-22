import {FC, MouseEventHandler} from "react";
import {Button, Card, CardBody, CardText, CardTitle} from "reactstrap";
import {SuccessfullProduct} from "../../sevices/ProductService";

interface ProductItemProps extends SuccessfullProduct {
    onViewClick: MouseEventHandler<HTMLButtonElement>,
}

const ProductItem: FC<ProductItemProps> = ({name, imageUrl, description, price, onViewClick}) => {
    return (
        <Card
            style={{
                width: '18rem',
                padding: '10px',
            }}
        >
            <img
                alt={name}
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
                    $ {price}
                </CardText>
                <Button color="primary" onClick={onViewClick}>
                    View
                </Button>
            </CardBody>
        </Card>
    );
};

export default ProductItem;