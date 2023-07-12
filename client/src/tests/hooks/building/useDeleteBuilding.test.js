import { render, fireEvent, waitFor } from "@testing-library/react";
import useDeleteBuilding from "../../../hooks/buildings/useDeleteBuilding";
import buildingsService from "../../../services/buildingsService";

// Test component that uses the hook
function TestComponent() {
  const { deleteBuilding, isLoading, error } = useDeleteBuilding();
  
  const handleDelete = async () => {
    await deleteBuilding("1");
  };

  return (
    <div>
      <button onClick={handleDelete}>Delete Building</button>
      {isLoading && <p>Loading...</p>}
      {error && <p>{error.message}</p>}
    </div>
  );
}

// Mock the buildingsService
jest.mock("../../../services/buildingsService", () => ({
  deleteBuilding: jest.fn(),
}));

describe("useDeleteBuilding hook", () => {
  let originalConfirm;

  beforeEach(() => {
    buildingsService.deleteBuilding.mockResolvedValue("1");
    originalConfirm = window.confirm;
    window.confirm = jest.fn(() => true);
  });

  afterEach(() => {
    window.confirm = originalConfirm;
  });

  it("deletes a building", async () => {
    const { getByRole, queryByText } = render(<TestComponent />);

    fireEvent.click(getByRole("button", { name: "Delete Building" }));

    // Wait for any async actions to finish
    await waitFor(() => {
      expect(buildingsService.deleteBuilding).toHaveBeenCalledWith("1");
      expect(queryByText("Loading...")).not.toBeInTheDocument();
    });
  });

  it("sets error state when deleting a building fails", async () => {
    buildingsService.deleteBuilding.mockRejectedValue(new Error("Test error"));
    const { getByRole, findByText } = render(<TestComponent />);
    fireEvent.click(getByRole("button", { name: "Delete Building" }));

    expect(await findByText("Test error")).toBeInTheDocument();
  });
});
