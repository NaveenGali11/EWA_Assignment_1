import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Table,
  Button,
  Input,
  Card,
  CardBody,
  Spinner,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import axios from "axios";
import { CART_URL, PLACE_ORDER_URL, STORE_LOCATIONS_URL, IMAGES_BASE_URL } from "../../utils/urlUtils";
import "./Cart.css";
import Swal from "sweetalert2";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  item_type: string;
  imageUrl: string;
}

interface CartTotals {
  subtotal: string;
  tax: string;
  delivery_fee: string;
  total: string;
  discount ?: string;
}

interface StoreLocation {
  id: number;
  name: string;
  street: string;
  city: string;
  state: string;
  zip_code: string;
}

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totals, setTotals] = useState<CartTotals | null>(null);
  const [loading, setLoading] = useState<{ [key: number]: boolean }>({});
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [deliveryType, setDeliveryType] = useState("home_delivery");
  const [address, setAddress] = useState("");
  const [selectedStore, setSelectedStore] = useState<number | null>(null);
  const [storeLocations, setStoreLocations] = useState<StoreLocation[]>([]);
  const [addressDetails, setAddressDetails] = useState({
    address1: "",
    address2: "",
    city: "",
    state: "",
    zip: ""
  });
  const [customerDetails, setCustomerDetails] = useState({
    name: "",
    email: "",
    payment_method: "credit_card",
    card_number: "",
    card_expiry: "",
    card_cvv: ""
  });

  // Fetch cart items from the backend
  const fetchCartItems = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("user_id");
      const response: any = await axios.get(CART_URL + "/" + userId, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCartItems(response.data.items);
      setTotals({
        subtotal: response.data.subtotal,
        tax: response.data.tax,
        delivery_fee: response.data.delivery_fee,
        total: response.data.total,
        discount: response.data.discount
      });
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  // Fetch store locations from the backend
  const fetchStoreLocations = async () => {
    try {
      const response:any = await axios.get(STORE_LOCATIONS_URL);
      setStoreLocations(response.data); // Set store locations from the backend
    } catch (error) {
      console.error("Error fetching store locations:", error);
    }
  };

  // Open the checkout modal and fetch store locations (if needed)
  const openCheckoutModal = () => {
    setShowCheckoutModal(true);
    if (storeLocations.length === 0) {
      fetchStoreLocations(); // Fetch store locations only once
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  const handleQuantityChange = async (id: number, newQuantity: number) => {
    try {
      setLoading((prev) => ({ ...prev, [id]: true }));
      const token = localStorage.getItem("token");

      if (newQuantity === 0) {
        await axios.delete(CART_URL + "/" + id, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        await axios.put(
          CART_URL + "/" + id,
          { quantity: newQuantity },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      fetchCartItems();
    } catch (error) {
      console.error("Error updating cart item:", error);
    } finally {
      setLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handlePlaceOrder = async () => {
  try {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("user_id");

    const orderData = {
      user_id: userId,
      cart_items: cartItems.map((item) => ({
        product_id: item.item_type === "Product" ? item.id : null,
        accessory_id: item.item_type === "Accessory" ? item.id : null,
        quantity: item.quantity,
        price: item.price,
      })),
      delivery_type: deliveryType,
      store_id: deliveryType === "store_pickup" ? selectedStore : null,
      customer_details: {
        name: customerDetails.name,
        email: customerDetails.email,
        address1: deliveryType === "home_delivery" ? addressDetails.address1 : null,
        address2: deliveryType === "home_delivery" ? addressDetails.address2 : null,
        city: deliveryType === "home_delivery" ? addressDetails.city : null,
        state: deliveryType === "home_delivery" ? addressDetails.state : null,
        zip: deliveryType === "home_delivery" ? addressDetails.zip : null,
        payment_method: customerDetails.payment_method,
        card_number: customerDetails.payment_method === "credit_card" ? customerDetails.card_number : null,
        card_expiry: customerDetails.payment_method === "credit_card" ? customerDetails.card_expiry : null,
        card_cvv: customerDetails.payment_method === "credit_card" ? customerDetails.card_cvv : null
      },
    };

    const response: any = await axios.post(PLACE_ORDER_URL, orderData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    Swal.fire({
      title: "Order Placed Successfully",
      icon: "success",
      text: `Order Placed With Status Number : ${response.data.confirmation_number}`
    });
    setShowCheckoutModal(false);
    fetchCartItems(); // Clear cart after placing the order
  } catch (error) {
    console.error("Error placing order:", error);
  }
  };


  return (
    <Container className="cart-page">
      <Row>
        <Col>
          <h1>Your Cart</h1>
        </Col>
      </Row>

      {cartItems.length === 0 ? (
        <Row>
          <Col>
            <p>Your cart is empty.</p>
          </Col>
        </Row>
      ) : (
        <Row>
          <Col md={8}>
            <Table responsive>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Type</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="cart-item-info">
                        <img
                          src={IMAGES_BASE_URL + "/" + item.imageUrl}
                          alt={item.name}
                          className="cart-item-image"
                        />
                        <div>{item.name}</div>
                      </div>
                    </td>
                    <td>{item.item_type}</td>
                    <td>${item.price}</td>
                    <td>
                      <div className="cart-quantity-controls">
                        <Button
                          color="secondary"
                          disabled={loading[item.id] || item.quantity <= 1}
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        >
                          {loading[item.id] ? <Spinner size="sm" /> : "-"}
                        </Button>
                        <Input
                          type="text"
                          value={item.quantity}
                          readOnly
                          style={{ width: "50px", textAlign: "center", margin: "0 10px" }}
                        />
                        <Button
                          color="secondary"
                          disabled={loading[item.id] || item.quantity >= 10}
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        >
                          {loading[item.id] ? <Spinner size="sm" /> : "+"}
                        </Button>
                      </div>
                    </td>
                    <td>${(item.price * item.quantity).toFixed(2)}</td>
                    <td>
                      <Button
                        color="danger"
                        disabled={loading[item.id]}
                        onClick={() => handleQuantityChange(item.id, 0)}
                      >
                        {loading[item.id] ? <Spinner size="sm" /> : "Delete"}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>

          <Col md={4}>
            {totals && (
              <Card>
                <CardBody>
                  <h3>Cart Summary</h3>
                  <hr />
                  <p>Subtotal: ${totals.subtotal}</p>
                  <p>Tax (2%): ${totals.tax}</p>
                  <p>Delivery Fee (1%): ${totals.delivery_fee}</p>
                  <p>Discount (3%): ${totals.discount}</p>
                  <hr />
                  <h2>Total: ${totals.total}</h2>
                  <Button color="primary" onClick={openCheckoutModal}>
                    Proceed to Checkout
                  </Button>
                </CardBody>
              </Card>
            )}
          </Col>
        </Row>
      )}

      {/* Checkout Modal */}
      <Modal isOpen={showCheckoutModal} toggle={() => setShowCheckoutModal(false)}>
        <ModalHeader toggle={() => setShowCheckoutModal(false)}>
          Checkout
        </ModalHeader>
        <ModalBody>
          <h5>Delivery Type</h5>
          <Input
            type="select"
            value={deliveryType}
            onChange={(e) => setDeliveryType(e.target.value)}
          >
            <option value="home_delivery">Home Delivery</option>
            <option value="store_pickup">Store Pickup</option>
          </Input>

          {deliveryType === "home_delivery" ? (
            <>
             <h5>Address Line 1</h5>
    <Input
      type="text"
      placeholder="Enter Address Line 1"
      value={addressDetails.address1}
      onChange={(e) => setAddressDetails((prev) => ({ ...prev, address1: e.target.value }))}
    />
    <h5>Address Line 2</h5>
    <Input
      type="text"
      placeholder="Enter Address Line 2"
      value={addressDetails.address2}
      onChange={(e) => setAddressDetails((prev) => ({ ...prev, address2: e.target.value }))}
    />
    <h5>City</h5>
    <Input
      type="text"
      placeholder="Enter City"
      value={addressDetails.city}
      onChange={(e) => setAddressDetails((prev) => ({ ...prev, city: e.target.value }))}
    />
    <h5>State</h5>
    <Input
      type="text"
      placeholder="Enter State"
      value={addressDetails.state}
      onChange={(e) => setAddressDetails((prev) => ({ ...prev, state: e.target.value }))}
    />
    <h5>ZIP Code</h5>
    <Input
      type="text"
      placeholder="Enter ZIP Code"
      value={addressDetails.zip}
      onChange={(e) => setAddressDetails((prev) => ({ ...prev, zip: e.target.value }))}
    />
            </>
          ) : (
            <>
              <h5>Select Store</h5>
              <Input
                type="select"
                value={selectedStore || ""}
                onChange={(e) => setSelectedStore(Number(e.target.value))}
              >
                <option value="">Select a store</option>
                {storeLocations.map((store) => (
                  <option key={store.id} value={store.id}>
                    {store.name} - {store.street}, {store.city}, {store.state}, {store.zip_code}
                  </option>
                ))}
              </Input>
            </>
          )}

          <h5>Customer Details</h5>
          <Input
            type="text"
            placeholder="Name"
            value={customerDetails.name}
            onChange={(e) => setCustomerDetails((prev) => ({ ...prev, name: e.target.value }))}
          />
          <Input
            type="email"
            placeholder="Email"
            value={customerDetails.email}
            onChange={(e) => setCustomerDetails((prev) => ({ ...prev, email: e.target.value }))}
          />

          <h5>Payment Method</h5>
          <Input
            type="select"
            value={customerDetails.payment_method}
            onChange={(e) => setCustomerDetails((prev) => ({ ...prev, payment_method: e.target.value }))}
          >
            <option value="credit_card">Credit Card</option>
            <option value="paypal">PayPal</option>
          </Input>

          {customerDetails.payment_method === "credit_card" && (
            <>
              <h5>Card Number</h5>
              <Input
                type="text"
                placeholder="Enter your card number"
                value={customerDetails.card_number}
                onChange={(e) => setCustomerDetails((prev) => ({ ...prev, card_number: e.target.value }))}
              />
              <h5>Card Expiry</h5>
              <Input
                type="text"
                placeholder="MM/YY"
                value={customerDetails.card_expiry}
                onChange={(e) => setCustomerDetails((prev) => ({ ...prev, card_expiry: e.target.value }))}
              />
              <h5>Card CVV</h5>
              <Input
                type="text"
                placeholder="Enter CVV"
                value={customerDetails.card_cvv}
                onChange={(e) => setCustomerDetails((prev) => ({ ...prev, card_cvv: e.target.value }))}
              />
            </>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handlePlaceOrder}>
            Place Order
          </Button>
          <Button color="secondary" onClick={() => setShowCheckoutModal(false)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </Container>
  );
};

export default Cart;
