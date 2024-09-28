import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  Col,
  Container,
  Row,
  Spinner,
} from "reactstrap";
import { useParams } from "react-router-dom";
import { FullProduct, getSingleProduct } from "../../sevices/ProductService";
import AccessoryItem from "../AccessoryItem/AccessoryItem";
import Swal from "sweetalert2";
import axios from "axios";
import { CART_URL, REVIEWS_URL } from "../../utils/urlUtils";

interface Review {
  _id: string;
  user_id: string;
  username: string;
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
      const totalRating = fetchedReviews.reduce((sum: number, review: Review) => sum + review.rating, 0);
      const avgRating = fetchedReviews.length > 0 ? totalRating / fetchedReviews.length : null;
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
                <strong>Overall Rating:</strong> {cumulativeRating.toFixed(1)} / 5
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
      <Card style={{
              marginTop: "20px"
            }}>
        <CardBody>
          <Row>
            <h3>Customer Reviews</h3>
            {loadingReviews ? (
              <Spinner />
            ) : reviews.length === 0 ? (
              <p>No reviews yet.</p>
            ) : reviews.map((review) => (
                <Col lg={"4"}>
                  <Card key={review._id} style={{ marginBottom: "20px" }}>
                    <CardBody>
                      <CardTitle tag="h5">
                        User - {review.rating} / 5
                      </CardTitle>
                      <p>{review.comment}</p>
                      <p>
                        <small>
                          Reviewed on {new Date(review.created_at).toLocaleDateString()}
                        </small>
                      </p>
                    </CardBody>
                  </Card>
                </Col>
              )
            )}
          </Row>
        </CardBody>
      </Card>
    </Container>
  );
};

export default ViewProduct;
