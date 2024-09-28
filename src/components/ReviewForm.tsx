import React, { useState } from "react";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Spinner,
  Card,
  CardBody,
  Row,
  Col,
} from "reactstrap";
import axios from "axios";
import { REVIEWS_URL } from "../utils/urlUtils";

interface ReviewFormProps {
  productId?: string; // Ensure productId is always passed
  onReviewAdded: () => void; // Callback to refresh the reviews after submission
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  productId,
  onReviewAdded,
}) => {
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      if (!rating || !comment) {
        setError("Rating and comment are required");
        return;
      }

      const reviewData = {
        rating,
        comment,
      };

      // Send the POST request to add a review for the specific product
      await axios.post(`${REVIEWS_URL}/${productId}`, reviewData, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the JWT token
        },
      });

      onReviewAdded(); // Refresh the reviews after submission
      setRating(null); // Reset the form fields
      setComment("");
      setError(null); // Clear any existing errors
    } catch (error: any) {
      console.error("Error submitting review:", error);
      setError("Error submitting review. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      style={{
        marginTop: "10px",
      }}
    >
      <CardBody>
        <div className="review-form">
          <h3>Add a Review</h3>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label for="rating">Rating</Label>
              <Input
                type="select"
                name="rating"
                id="rating"
                value={rating || ""}
                onChange={(e) => setRating(Number(e.target.value))}
                required
              >
                <option value="" disabled>
                  Select a rating
                </option>
                <option value="1">1 - Poor</option>
                <option value="2">2 - Fair</option>
                <option value="3">3 - Good</option>
                <option value="4">4 - Very Good</option>
                <option value="5">5 - Excellent</option>
              </Input>
            </FormGroup>

            <FormGroup>
              <Label for="comment">Comment</Label>
              <Input
                type="textarea"
                name="comment"
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
              />
            </FormGroup>

            <Button type="submit" color="primary" disabled={loading}>
              {loading ? <Spinner size="sm" /> : "Submit Review"}
            </Button>
          </Form>
        </div>
      </CardBody>
    </Card>
  );
};

export default ReviewForm;
