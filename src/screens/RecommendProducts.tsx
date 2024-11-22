import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Col, Container, Input, Row, Spinner } from "reactstrap";
import ProductItem from "../components/ProductItem/ProductItem";
import {
  GENERATE_NEW_DESCRIPTIONS,
  IMAGES_BASE_URL,
  PROCESS_REVIEWS,
  RECOMMEND_PRODUCTS,
  SEARCH_REVIEWS,
} from "../utils/urlUtils";

type RecommendedProducts = {
  id: string;
  name: string;
  category: string;
  price: string;
  description: string;
  on_sale: number;
  manufacturer: string;
  warranty: number;
  retailer_discount: number;
  manufacturer_rebate: number;
  created_at: string;
  image: string;
  stock_quantity: number;
};

const RecommendProducts = () => {
  const [query, setQuery] = useState("");
  const [recommendedProducts, setRecommendedProducts] = useState<
    RecommendedProducts[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const processProducts = async () => {
    await axios.get(GENERATE_NEW_DESCRIPTIONS).then(
      (res) => {
        console.log("RES :_ ", res);
      },
      (err) => {
        console.log("ERR :_ ", err);
      }
    );
  };
  const processReviews = async () => {
    await axios.get(PROCESS_REVIEWS).then(
      (res) => {
        console.log("RES :_ ", res);
      },
      (err) => {
        console.log("ERR :_ ", err);
      }
    );
  };

  const searchReviews = async () => {
    await axios
      .post(SEARCH_REVIEWS, {
        queryText: "clear video and reliable connection",
        productId: "1726952900911764",
      })
      .then(
        (res) => {
          console.log("RES :_ ", res);
        },
        (err) => {
          console.log("ERR :_ ", err);
        }
      );
  };

  const getProductsRecommendations = async () => {
    setIsLoading(true);
    if (query) {
      await axios
        .post(RECOMMEND_PRODUCTS, {
          query,
        })
        .then(
          (res: any) => {
            setRecommendedProducts(res.data.results);
            setIsLoading(false);
          },
          (err) => {
            console.log("ERR :_ ", err);
            setIsLoading(false);
          }
        );
    }
  };

  return (
    <Container>
      <h3>Get Product Recommendations</h3>
      <div
        style={{
          marginTop: "10px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={"Type Your Need..."}
          style={{
            borderRadius: "30px",
            flex: 4,
          }}
        />
        <Button
          onClick={getProductsRecommendations}
          color={"primary"}
          style={{
            flex: 1,
            borderRadius: "10px",
          }}
          disabled={query || isLoading ? false : true}
        >
          {isLoading ? <Spinner size="sm" /> : "Recommend Products"}
        </Button>
      </div>
      {/* <Button onClick={processProducts}>Process Products</Button> */}
      <Button onClick={processReviews}>Process Reviews</Button>
      {/* <Button onClick={searchReviews}>Search Reviews</Button> */}
      <div
        style={{
          marginTop: "20px",
        }}
      >
        <h5>Search Results</h5>
        <Row>
          {recommendedProducts.map((rp, index) => {
            return (
              <Col lg="3" sm="6" key={index}>
                <ProductItem
                  onViewClick={() => navigate("/products/" + rp.id)}
                  id={rp.id}
                  category={rp.category}
                  description={rp.description}
                  image={rp.image}
                  imageUrl={IMAGES_BASE_URL + "/" + rp.image}
                  manufacturer={rp.manufacturer}
                  manufacturer_rebate={rp.manufacturer_rebate}
                  name={rp.name}
                  on_sale={rp.on_sale}
                  price={rp.price}
                  retailer_discount={rp.retailer_discount}
                  warranty={rp.warranty}
                />
              </Col>
            );
          })}
        </Row>
      </div>
    </Container>
  );
};

export default RecommendProducts;
