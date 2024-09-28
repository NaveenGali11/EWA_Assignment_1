import React, { useState } from 'react';
import { Button, Input, Spinner } from 'reactstrap';
import axios from 'axios';

interface CartItemQuantityProps {
  id: number;           // Cart item ID
  initialQuantity: number; // Initial quantity
  onQuantityChange: () => void; // Callback function to refresh the cart after quantity change
}

const CartItemQuantity: React.FC<CartItemQuantityProps> = ({ id, initialQuantity, onQuantityChange }) => {
  const [quantity, setQuantity] = useState<number>(initialQuantity); // State to store quantity
  const [loading, setLoading] = useState<boolean>(false);            // State to handle loading

  // Handle updating the quantity in the backend
  const updateQuantity = async (newQuantity: number) => {
    try {
      setLoading(true); // Set loading state to true to prevent multiple requests
      const token = localStorage.getItem('token'); // Assuming token is stored in localStorage

      if (newQuantity === 0) {
        // Remove the item from cart if the new quantity is 0 (user clicked - when quantity was 1)
        await axios.delete(`http://localhost:5000/cart/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      } else {
        // Update the quantity in the cart if it's greater than 0
        await axios.put(`http://localhost:5000/cart/${id}`, { quantity: newQuantity }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }

      onQuantityChange(); // Refresh the cart after update
    } catch (err) {
      console.error('Error updating cart quantity:', err);
    } finally {
      setLoading(false); // Reset loading state after the request is complete
    }
  };

  // Handle clicking the + button
  const handleIncrement = () => {
    if (quantity < 10 && !loading) { // Ensure quantity does not exceed 10
      const newQuantity = quantity + 1;
      setQuantity(newQuantity);
      updateQuantity(newQuantity);
    }
  };

  // Handle clicking the - button
  const handleDecrement = () => {
    if (!loading) {
      const newQuantity = quantity - 1;
      if (newQuantity === 0) {
        // If quantity reaches 0, remove the item
        updateQuantity(0);
      } else {
        setQuantity(newQuantity);
        updateQuantity(newQuantity);
      }
    }
  };

  return (
    <div className="cart-quantity-control">
      <Button color="secondary" disabled={loading || quantity <= 1} onClick={handleDecrement}>
        {loading && quantity === 1 ? <Spinner size="sm" /> : '-'}
      </Button>
      <Input
        type="text"
        value={quantity}
        readOnly
        style={{ width: '50px', textAlign: 'center', display: 'inline-block', margin: '0 10px' }}
      />
      <Button color="secondary" disabled={loading || quantity >= 10} onClick={handleIncrement}>
        {loading && quantity > 1 ? <Spinner size="sm" /> : '+'}
      </Button>
    </div>
  );
};

export default CartItemQuantity;
