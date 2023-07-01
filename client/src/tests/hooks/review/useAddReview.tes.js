import { render, act, fireEvent } from "@testing-library/react";
import { MemoryRouter as Router, Routes, Route } from "react-router-dom";
import useAddReview from "../../../hooks/reviews/useAddReview";
import reviewsService from "../../../services/reviewsService";

// Test component that uses the hook
function TestComponent({ buildingId, userId }) {
  const { addReview, error } = useAddReview(buildingId, userId);
  
  return (
    <div>
      <button onClick={() => addReview(5, "Test comment")}>Add review</button>
      {error && <p>{error}</p>}
    </div>
  );
}

jest.mock("../../../services/reviewsService", () => ({
  addReview: jest.fn(),
}));

describe("useAddReview hook", () => {

  beforeEach(() => {
    reviewsService.addReview.mockResolvedValue({});
  });

  it("sets error state when adding a review fails", async () => {
    reviewsService.addReview.mockRejectedValue(new Error("Test error"));

    const { getByText, findByText } = render(
      <Router initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<TestComponent buildingId={1} userId={1} />} />
        </Routes>
      </Router>
    );

    fireEvent.click(getByText("Add review"));

    await act(() => Promise.resolve()); 

    expect(await findByText("Test error")).toBeInTheDocument();
  });
});
