import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Spinner,
  Input
} from "reactstrap";
import axios from "axios";
import { ORDERS_URL, ORDER_CANCEL_URL, ORDER_STATUS_URL } from "../../utils/urlUtils";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

interface Order {
  id: number;
  confirmation_number: string;
  total: string;
  delivery_date: string;
  delivery_type: string;
  created_at: string;
  status: string;
  customer_name: string; // Include customer name for salesman view
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [cancelLoading, setCancelLoading] = useState<boolean>(false);
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<{ [key: string]: string }>({}); // Store selected statuses

  const isSalesman = localStorage.getItem('user_type') === 'salesman'; // Check if the user is a salesman
  const isAdmin = localStorage.getItem('user_type') === 'admin'; // Check if the user is a salesman

  // Fetch orders
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response: any = await axios.get(ORDERS_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Handle viewing order details
  const handleViewDetails = async (confirmation_number: string) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response: any = await axios.get(`${ORDER_STATUS_URL}/${confirmation_number}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedOrder(response.data);
      setShowDetailsModal(true);
    } catch (error) {
      console.error("Error fetching order details:", error);
      setError("Error fetching order details.");
    } finally {
      setLoading(false);
    }
  };

  // Handle cancelling the order
  const handleCancelOrder = async (confirmation_number: string) => {
    setCancelLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${ORDER_CANCEL_URL}/${confirmation_number}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Swal.fire({
        title: "Order Cancelled Successfully!",
        icon: "success",
        text: "Order Cancelled and Money will be refunded in 3-5 days."
      });
      setOrders(orders.filter(order => order.confirmation_number !== confirmation_number));
      setShowDetailsModal(false);
    } catch (error) {
      Swal.fire({
        title: "Order Cancellation Failed!",
        icon: "error",
        text: "Order Cancellation Failed and Try Returning the Item post delivery."
      });
    } finally {
      setCancelLoading(false);
    }
  };

  // Handle updating order status for salesmen
  const handleUpdateOrderStatus = async (confirmation_number: string) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${ORDER_STATUS_URL}/${confirmation_number}`, {
        status: selectedStatus[confirmation_number]
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Swal.fire({
        title: "Order Status Updated!",
        icon: "success",
        text: "Order status updated successfully."
      });
    } catch (error) {
      Swal.fire({
        title: "Failed to Update Status!",
        icon: "error",
        text: "Unable to update order status."
      });
    }
  };

  return (
    <div className="order-management-page">
      <h1>{isSalesman ? "All Orders" : "My Orders"}</h1>
      {loading ? (
        <Spinner />
      ) : orders.length === 0 ? (
        <p>{isSalesman || isAdmin ? "No orders to display." : "You have no orders yet."}</p>
      ) : (
        <Table responsive>
          <thead>
            <tr>
              <th>Order #</th>
              {isSalesman && <th>Customer</th>}
              <th>Total</th>
              <th>Delivery Type</th>
              <th>Delivery Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td>
                  <Link to={`/orders/${order.confirmation_number}`}>
                    {order.confirmation_number}
                  </Link>
                </td>
                {isSalesman || isAdmin && <td>{order.customer_name}</td>}
                <td>${order.total}</td>
                <td>{order.delivery_type === "home_delivery" ? "Home Delivery" : "Store Pickup"}</td>
                <td>{new Date(order.delivery_date).toLocaleDateString()}</td>
                <td>
                  {isSalesman || isAdmin ? (
                    <Input
                      type="select"
                      value={selectedStatus[order.confirmation_number] || order.status}
                      onChange={(e) => setSelectedStatus({ ...selectedStatus, [order.confirmation_number]: e.target.value })}
                    >
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </Input>
                  ) : (
                    order.status || "Pending"
                  )}
                </td>
                <td>
                  {isSalesman || isAdmin ? (
                    <Button
                      color="info"
                      onClick={() => handleUpdateOrderStatus(order.confirmation_number)}
                    >
                      Update Status
                    </Button>
                  ) : (
                    <Button
                      color="danger"
                      onClick={() => handleCancelOrder(order.confirmation_number)}
                      disabled={cancelLoading}
                    >
                      {cancelLoading ? <Spinner size="sm" /> : "Cancel Order"}
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Modal isOpen={showDetailsModal} toggle={() => setShowDetailsModal(false)}>
        <ModalHeader toggle={() => setShowDetailsModal(false)}>
          Order Details
        </ModalHeader>
        <ModalBody>
          {selectedOrder ? (
            <div>
              <p>Order ID: {selectedOrder.confirmation_number}</p>
              <p>Total: ${selectedOrder.total}</p>
              <p>Delivery Type: {selectedOrder.delivery_type}</p>
              <p>Delivery Date: {selectedOrder.delivery_date}</p>
            </div>
          ) : (
            <Spinner />
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setShowDetailsModal(false)}>
            Close
          </Button>
        </ModalFooter>
      </Modal>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default Orders;
