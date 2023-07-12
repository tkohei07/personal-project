import { render, fireEvent, waitFor } from "@testing-library/react";
import useUpdateBuilding from "../../../hooks/buildings/useUpdateBuilding";
import buildingsService from "../../../services/buildingsService";

// Test component that uses the hook
function TestComponent() {
  const { updateBuilding, error } = useUpdateBuilding();
  
  const handleSubmit = async () => {
    await updateBuilding("1", { name: "Test Building", isComputerRoom: true });
  };

  return (
    <div>
      <button onClick={handleSubmit}>Update Building</button>
      {error && <p>{error}</p>}
    </div>
  );
}

// Mock the buildingsService
jest.mock("../../../services/buildingsService", () => ({
  updateBuilding: jest.fn(),
}));

describe("useUpdateBuilding hook", () => {
  beforeEach(() => {
    buildingsService.updateBuilding.mockResolvedValue({});
    originalError = console.error;
    console.error = jest.fn();
  });

  afterEach(() => {
    console.error = originalError;
  });

  it("updates a building", async () => {
    const { getByRole } = render(<TestComponent />);

    fireEvent.click(getByRole("button", { name: "Update Building" }));

    // Wait for any async actions to finish
    await waitFor(() => {
      expect(buildingsService.updateBuilding).toHaveBeenCalledWith("1", { name: "Test Building", isComputerRoom: true });
    });
  });

  it("sets error state when updating a building fails", async () => {
    buildingsService.updateBuilding.mockRejectedValue(new Error("Test error"));
    const { getByRole, findByText } = render(<TestComponent />);
    fireEvent.click(getByRole("button", { name: "Update Building" }));

    expect(await findByText("Test error")).toBeInTheDocument();
  });
});
