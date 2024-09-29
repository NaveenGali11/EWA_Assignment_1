import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Spinner,
  Button,
  FormGroup,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import axios from "axios";
import {
  ORDER_STATUS_URL,
  IMAGES_BASE_URL,
  REVIEWS_URL,
} from "../../utils/urlUtils";
import {
  FaShippingFast,
  FaBoxOpen,
  FaCheckCircle,
  FaClock,
} from "react-icons/fa";
import Swal from "sweetalert2";
import "./OrderOverview.css";

interface OrderItem {
  product_id: string | null;
  accessory_id: string | null;
  name: string;
  quantity: number;
  price: number;
  image: string;
  status: string;
  manufacturer: string;
}

interface OrderDetails {
  confirmation_number: string;
  subtotal: string;
  tax: string;
  delivery_fee: string;
  total: string;
  delivery_type: string;
  delivery_date: string;
  customer_name: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  payment_method: string;
  order_date: string;
  items: OrderItem[];
  status: string;
}

const OrderOverview: React.FC = () => {
  const { confirmation_number } = useParams<{ confirmation_number: string }>();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSalesman, setIsSalesman] = useState<boolean>(false);
  const [status, setStatus] = useState<string>("");

  // Review modal state
  const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false);
  const [reviewProduct, setReviewProduct] = useState<OrderItem | null>(null);
  const [reviewText, setReviewText] = useState<string>("");
  const [rating, setRating] = useState<number>(5);

  const navigate = useNavigate();

  const userType = localStorage.getItem("userType");

  const fetchOrderDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const response: any = await axios.get(
        `${ORDER_STATUS_URL}/${confirmation_number}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setOrder(response.data);
      setStatus(response.data.status);

      const userRole = localStorage.getItem("userType");
      if (userRole === "sales_man") {
        setIsSalesman(true);
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
      setError("Error fetching order details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, [confirmation_number]);

  const handleStatusChange = async (newStatus: string) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${ORDER_STATUS_URL}/${confirmation_number}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStatus(newStatus);
      Swal.fire({
        title: "Status Changed Successfully!",
        icon: "success",
        text: "Order Status Changed Successfully",
      }).then(() => {
        navigate("/orders");
      });
    } catch (error) {
      Swal.fire({
        title: "Status Change Failed!",
        icon: "error",
        text: "Status Change Failed!",
      });
    }
  };

  const openReviewModal = (item: OrderItem) => {
    setReviewProduct(item);
    setIsReviewModalOpen(true);
  };

  const submitReview = async (manufacturer?: string) => {
    if (!reviewProduct) return;

    try {
      const token = localStorage.getItem("token");
      const reviewData = {
        rating,
        comment: reviewText,
        orderid: confirmation_number,
        manufacturer,
        product_id: reviewProduct.product_id,
        price: reviewProduct.price,
      };

      // Send review to backend
      const response = await axios.post(
        `${REVIEWS_URL}/${
          reviewProduct.product_id || reviewProduct.accessory_id
        }`,
        reviewData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("RESPO :_ ", response);

      Swal.fire({
        title: "Review Submitted",
        text: "Thank you for your review!",
        icon: "success",
      });

      setIsReviewModalOpen(false);
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Failed to submit review",
        icon: "error",
      });
    }
  };

  if (loading) return <Spinner />;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!order) return <p>Order not found</p>;

  return (
    <Container className="order-view-page">
      <Row>
        <Col md={8}>
          <Card className="order-summary-card mb-3">
            <CardBody>
              <h3>Order Summary</h3>
              <p>
                <strong>Order Number:</strong> {order.confirmation_number}
              </p>
              <p>
                <strong>Order Date:</strong> {order.order_date}
              </p>
              <p>
                <strong>Delivery Type:</strong>{" "}
                {order.delivery_type === "home_delivery"
                  ? "Home Delivery"
                  : "Store Pickup"}
              </p>
              <p>
                <strong>Delivery Date:</strong>{" "}
                {new Date(order.delivery_date).toLocaleDateString()}
              </p>
              <p>
                <strong>Total:</strong> ${order.total}
              </p>
              {order.delivery_type === "home_delivery" && (
                <p>
                  <strong>Delivery Address:</strong> {order.address1 + "," + order.address2 + "," + order.city}
                </p>
              )}
            </CardBody>
          </Card>

          {order.items.map((item, index) => (
            <Card key={index} className="order-item-card mb-3">
              <CardBody>
                <Row>
                  <Col md={3}>
                    <img
                      src={`${IMAGES_BASE_URL}/${item.image}`}
                      alt={item.name}
                      className="img-fluid"
                    />
                  </Col>
                  <Col md={9}>
                    <h5>{item.name}</h5>
                    <p>
                      <strong>Quantity:</strong> {item.quantity}
                    </p>
                    <p>
                      <strong>Price per item:</strong> ${item.price}
                    </p>
                    <p>
                      <strong>Total:</strong> ${item.price * item.quantity}
                    </p>
                    <p>
                      <strong>Manufacturer:</strong> {item.manufacturer}
                    </p>
                    <p>
                      <strong>Status:</strong>{" "}
                      {status === "delivered" ? (
                        <span style={{ color: "green" }}>
                          <FaCheckCircle /> Delivered
                        </span>
                      ) : status === "pending" ? (
                        <span style={{ color: "blue" }}>
                          <FaClock /> Pending
                        </span>
                      ) : (
                        <span style={{ color: "orange" }}>
                          <FaShippingFast /> Shipping
                        </span>
                      )}
                    </p>

                    {userType === "customer" && status === "delivered" ? (
                      <Button
                        color="info"
                        onClick={() => openReviewModal(item)}
                      >
                        Write a Review
                      </Button>
                    ) : (
                      <></>
                    )}
                  </Col>
                </Row>
              </CardBody>
            </Card>
          ))}
        </Col>

        <Col md={4}>
          <Card className="price-breakdown-card">
            <CardBody>
              <h4>Pricing Breakdown</h4>
              <p>
                <strong>Subtotal:</strong> ${order.subtotal}
              </p>
              <p>
                <strong>Tax (2%):</strong> ${order.tax}
              </p>
              <p>
                <strong>Delivery Fee:</strong> ${order.delivery_fee}
              </p>
              <h4>
                <strong>Total:</strong> ${order.total}
              </h4>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Review Modal */}
      <Modal
        isOpen={isReviewModalOpen}
        toggle={() => setIsReviewModalOpen(false)}
      >
        <ModalHeader toggle={() => setIsReviewModalOpen(false)}>
          Write a Review
        </ModalHeader>
        <ModalBody>
          {reviewProduct && (
            <>
              <p>
                <strong>Product:</strong> {reviewProduct.name}
              </p>
              <p>
                <strong>Manufacturer:</strong> {reviewProduct.manufacturer}
              </p>
              <FormGroup>
                <label>Rating</label>
                <Input
                  type="select"
                  value={rating}
                  onChange={(e) => setRating(parseInt(e.target.value))}
                >
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                  <option value={5}>5</option>
                </Input>
              </FormGroup>
              <FormGroup>
                <label>Comment</label>
                <Input
                  type="textarea"
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                />
              </FormGroup>
            </>
          )}
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            onClick={() => submitReview(reviewProduct?.manufacturer)}
          >
            Submit Review
          </Button>
          <Button color="secondary" onClick={() => setIsReviewModalOpen(false)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </Container>
  );
};

export default OrderOverview;
