import { render, fireEvent } from "@testing-library/react";
import useDeleteReview from "../../../hooks/reviews/useDeleteReview";
import reviewsService from "../../../services/reviewsService";

// Mock the reviewsService
jest.mock("../../../services/reviewsService", () => ({
  deleteReview: jest.fn(),
}));

describe("useDeleteReview Hook", () => {
  it("deleteReview deletes a review", async () => {
    console.error = jest.fn();
    
    const TestComponent = () => {
      const { deleteReview } = useDeleteReview();
      return <button onClick={() => deleteReview('1')}>Delete</button>;
    };

    reviewsService.deleteReview.mockResolvedValue();

    const { getByText } = render(<TestComponent />);
    fireEvent.click(getByText('Delete'));

    expect(reviewsService.deleteReview).toHaveBeenCalledWith('1');
  });

  it("deleteReview sets error on failure", async () => {
    const TestComponent = () => {
      const { deleteReview, error } = useDeleteReview();
      const handleClick = async () => {
        await deleteReview('1');
      };
      return (
        <div>
          <button onClick={handleClick}>Delete</button>
          {error && <div>{error.message}</div>}
        </div>
      );
    };

    const mockError = new Error('Delete failed');
    reviewsService.deleteReview.mockRejectedValue(mockError);

    const { getByText, findByText } = render(<TestComponent />);
    fireEvent.click(getByText('Delete'));

    expect(await findByText(mockError.message)).toBeInTheDocument();
  });
});
