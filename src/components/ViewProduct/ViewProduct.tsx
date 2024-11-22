import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  Col,
  Container,
  Input,
  Row,
  Spinner,
} from "reactstrap";
import Swal from "sweetalert2";
import { FullProduct, getSingleProduct } from "../../sevices/ProductService";
import { CART_URL, REVIEWS_URL, SEARCH_REVIEWS } from "../../utils/urlUtils";
import AccessoryItem from "../AccessoryItem/AccessoryItem";

interface Review {
  _id: string;
  product_id: string;
  user_id: string;
  username: string;
  order_id: string;
  price: number;
  rating: number;
  comment: string;
  created_at: string;
}

const ViewProduct = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<FullProduct | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [cumulativeRating, setCumulativeRating] = useState<number | null>(null);
  const [loadingReviews, setLoadingReviews] = useState<boolean>(false);
  const [reviewQuery, setReviewQuery] = useState("");

  function truncateText(text: string, maxLength: number) {
    if (text.length <= maxLength) {
      return text; // If the text is shorter than maxLength, return it as is.
    }
    return text.substring(0, maxLength) + "... Read More";
  }

  // Fetch product details and reviews
  useEffect(() => {
    if (id) {
      // Fetch product details
      getSingleProduct(id).then(
        (res) => {
          console.log("SINGLE PRODUCT", res);
          setProduct(res);
        },
        (err) => {
          console.log("ERROR", err);
        }
      );

      // Fetch reviews
      fetchReviews(id);
    }
  }, [id]);

  // Fetch product reviews
  const fetchReviews = async (productId: string) => {
    setLoadingReviews(true);
    try {
      const response: any = await axios.get(`${REVIEWS_URL}/${productId}`);
      const fetchedReviews = response.data;
      setReviews(fetchedReviews);

      // Calculate cumulative rating
      const totalRating = fetchedReviews.reduce(
        (sum: number, review: Review) => sum + review.rating,
        0
      );
      const avgRating =
        fetchedReviews.length > 0 ? totalRating / fetchedReviews.length : null;
      setCumulativeRating(avgRating);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    } finally {
      setLoadingReviews(false);
    }
  };

  // Add item to cart
  const addToCart = async (isAccessory: boolean, id: string) => {
    try {
      const token = localStorage.getItem("token"); // Assuming token is stored in localStorage
      const body = isAccessory
        ? { accessory_id: id, quantity: 1 } // Add accessory
        : { product_id: id, quantity: 1 }; // Add product

      const response = await axios.post(CART_URL, body, {
        headers: {
          Authorization: `Bearer ${token}`, // Send the token for authentication
        },
      });

      console.log("RESPONSE :_ ", response);

      Swal.fire({
        title: "Success!",
        icon: "success",
        text: "Cart Updated Successfully!",
      });
    } catch (err) {
      console.error("Error adding to cart:", err);
      Swal.fire({
        title: "Error!",
        icon: "error",
        text: "Failed to add item to cart!",
      });
    }
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  const searchReviews = async () => {
    setLoadingReviews(true);
    await axios
      .post(SEARCH_REVIEWS, {
        queryText: reviewQuery,
        productId: id,
      })
      .then(
        (res: any) => {
          console.log("RES :_ ", res);
          setReviews(res.data.results);
        },
        (err) => {
          console.log("ERR :_ ", err);
        }
      );
    setLoadingReviews(false);
  };

  return (
    <Container style={{ marginTop: "20px" }}>
      <Row>
        {/* Product Image Section */}
        <Col lg="6" sm="12">
          <div style={{ textAlign: "center" }}>
            <img
              src={product.imageUrl}
              alt={product.name}
              style={{
                maxWidth: "100%",
                maxHeight: "500px",
                objectFit: "contain",
                border: "1px solid #ddd",
                padding: "10px",
                backgroundColor: "#fff",
              }}
            />
          </div>
        </Col>

        {/* Product Details Section */}
        <Col lg="6" sm="12">
          <div>
            <h1>{product.name}</h1>
            <p>{product.description}</p>
            <h4 style={{ color: "#b12704" }}>${parseFloat(product.price)}</h4>
            <p>
              <strong>Manufacturer:</strong> {product.manufacturer}
            </p>

            {product.on_sale && (
              <p style={{ color: "green" }}>
                <strong>On Sale!</strong>
              </p>
            )}

            {product.warranty ? (
              <p>
                <strong>Warranty:</strong> Included
              </p>
            ) : (
              <p>
                <strong>Warranty:</strong> Not Included
              </p>
            )}

            {/* Cumulative Rating */}
            {cumulativeRating !== null && (
              <p>
                <strong>Overall Rating:</strong> {cumulativeRating.toFixed(1)} /
                5
              </p>
            )}

            <div style={{ marginTop: "20px" }}>
              <Button
                color="primary"
                size="lg"
                block
                onClick={() => addToCart(false, product.id)}
              >
                Add to Cart
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {/* Accessories Section */}
      {product.accessories && product.accessories.length > 0 && (
        <>
          <h3 style={{ marginTop: "30px" }}>Accessories</h3>
          <Row>
            {product.accessories.map((accessory, index) => (
              <Col lg="4" sm="6" key={index} style={{ marginBottom: "20px" }}>
                <div
                  style={{
                    padding: "10px",
                    backgroundColor: "#fff",
                    textAlign: "center",
                  }}
                >
                  <AccessoryItem
                    id={accessory.id}
                    product_id={accessory.product_id}
                    price={accessory.price}
                    name={accessory.name}
                    description={accessory.description}
                    imageUrl={accessory.imageUrl}
                    onClick={() => addToCart(true, accessory.id)}
                  />
                </div>
              </Col>
            ))}
          </Row>
        </>
      )}

      {/* Reviews Section */}
      <Card
        style={{
          marginTop: "20px",
        }}
      >
        <CardBody>
          <Row>
            <h3>Customer Reviews</h3>
            <div
              style={{
                marginTop: "10px",
                marginBottom: "10px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <Input
                type="text"
                value={reviewQuery}
                onChange={(e) => setReviewQuery(e.target.value)}
                placeholder={"Search Reviews..."}
                style={{
                  borderRadius: "30px",
                  flex: 4,
                }}
              />
              <Button
                onClick={searchReviews}
                color={"primary"}
                style={{
                  flex: 1,
                  borderRadius: "10px",
                }}
                disabled={reviewQuery || loadingReviews ? false : true}
              >
                {loadingReviews ? <Spinner size="sm" /> : "Search Reviews"}
              </Button>
            </div>
            {loadingReviews ? (
              <Spinner />
            ) : reviews.length === 0 ? (
              <p>No reviews yet.</p>
            ) : (
              reviews
                .filter((product) => product.product_id === id)
                .map((review, index) => (
                  <Col lg={"4"} key={index}>
                    <Card key={review._id} style={{ marginBottom: "20px" }}>
                      <CardBody>
                        <CardTitle tag="h5">
                          User - {review.rating} / 5
                        </CardTitle>
                        <p>{truncateText(review.comment, 100)}</p>
                      </CardBody>
                    </Card>
                  </Col>
                ))
            )}
          </Row>
        </CardBody>
      </Card>
    </Container>
  );
};

export default ViewProduct;
