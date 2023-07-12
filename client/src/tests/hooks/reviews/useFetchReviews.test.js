import { render } from "@testing-library/react";
import { useFetchReviewsByBuildingId, useFetchReviewsByUserId } from "../../../hooks/reviews/useFetchReviews";
import reviewsService from "../../../services/reviewsService";

// Mock the reviewsService
jest.mock("../../../services/reviewsService", () => ({
  fetchReviewsByBuildingId: jest.fn(),
  fetchReviewsByUserId: jest.fn(),
}));

describe("Reviews Hooks", () => {
  it("useFetchReviewsByBuildingId fetches reviews", async () => {
    const TestComponent = () => {
      const reviews = useFetchReviewsByBuildingId('1');
      return <div>{reviews.length}</div>;
    };

    reviewsService.fetchReviewsByBuildingId.mockResolvedValue([{}, {}, {}]);

    const { findByText } = render(<TestComponent />);

    expect(await findByText("3")).toBeInTheDocument();
  });

  it("useFetchReviewsByUserId fetches user reviews", async () => {
    const TestComponent = () => {
      const reviews = useFetchReviewsByUserId('1');
      return <div>{reviews.length}</div>;
    };

    reviewsService.fetchReviewsByUserId.mockResolvedValue([{}, {}, {}, {}, {}]);

    const { findByText } = render(<TestComponent />);

    expect(await findByText("5")).toBeInTheDocument();
  });
});
