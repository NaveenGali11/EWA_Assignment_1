import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Col, Container, Row } from "reactstrap";
import { getProducts, SuccessfullProduct } from "../../sevices/ProductService";
import { FILTER_PRODUCTS_URL, IMAGES_BASE_URL } from "../../utils/urlUtils";
import ProductItem from "../ProductItem/ProductItem";

const ProductGrid: React.FC = () => {
  const [productsMap, setProductsMap] = useState<
    Map<string, SuccessfullProduct[]>
  >(new Map());
  const [trendingProducts, setTrendingProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getProducts().then((res) => {
      console.log(res);
      const productsByCategory = groupByCategoryUsingMap(res.products);
      setProductsMap(productsByCategory);
    });
    getTrendingProducts();
  }, []);

  const getTrendingProducts = async () => {
    try {
      const response: any = await axios.get(FILTER_PRODUCTS_URL, {
        params: { filter: "trending" },
      });
      console.log("RESPONSE TRENDING :_ ", response.data);

      setTrendingProducts(response.data);
    } catch (err) {
      console.log("ERR :_ ", err);
    }
  };

  const groupByCategoryUsingMap = (products: SuccessfullProduct[]) => {
    const productMap = new Map<string, SuccessfullProduct[]>();

    products.forEach((product) => {
      const category = product.category || "Uncategorized"; // Default to 'Uncategorized' if no category
      if (!productMap.has(category)) {
        productMap.set(category, []);
      }
      productMap.get(category)?.push(product);
    });

    return productMap;
  };

  // Function to capitalize the first letter of each category
  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  return (
    <Container>
      {/* Loop through each category */}
      <h2>Trending Products</h2>
      <Row>
        {trendingProducts.splice(0, 3).map((tp: any, index) => (
          <Col
            lg="3"
            sm="6"
            key={index}
            style={{
              marginBottom: "10px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ProductItem
              name={tp.name}
              price={tp.price}
              description={tp.description}
              onViewClick={() => navigate("/products/" + tp.id)}
              id={""}
              category={""}
              imageUrl={IMAGES_BASE_URL + "/" + tp.image}
              manufacturer={tp.manufacturer}
              manufacturer_rebate={tp.manufacturer_rebate}
              on_sale={tp.on_sale}
              retailer_discount={tp.retailer_discount}
              warranty={tp.warranty}
              image={tp.image}
            />
          </Col>
        ))}
      </Row>
      {Array.from(productsMap.keys()).map((category, categoryIndex) => (
        <div key={categoryIndex}>
          <h2>{capitalizeFirstLetter(category)}</h2>{" "}
          {/* Capitalize the first letter of the category */}
          <Row>
            {/* Render the products in the current category */}
            {productsMap.get(category)?.map((product, productIndex) => (
              <Col
                lg="3"
                sm="6"
                key={productIndex}
                style={{
                  marginBottom: "10px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <ProductItem
                  name={product.name}
                  price={product.price}
                  description={product.description}
                  onViewClick={() => navigate("/products/" + product.id)}
                  id={""}
                  category={""}
                  imageUrl={product.imageUrl}
                  manufacturer={product.manufacturer}
                  manufacturer_rebate={product.manufacturer_rebate}
                  on_sale={product.on_sale}
                  retailer_discount={product.retailer_discount}
                  warranty={product.warranty}
                  image={product.image}
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
