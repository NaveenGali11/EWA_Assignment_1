import {FC} from "react";
import {Product} from "../../types";



const ProductItem: FC<Product> = ({name, price, description, image, accessories}) => {
    return (
        <div>
            <p>{name}</p>
            <p>{description}</p>
            <p>{image}</p>
            <p>{price}</p>
            {
                accessories && accessories?.length > 0 ? <p>Accessories are there</p> : <p>Accessories are not there!</p>
            }
        </div>
    );
};

export default ProductItem;