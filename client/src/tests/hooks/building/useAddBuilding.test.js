import { render, fireEvent, waitFor } from "@testing-library/react";
import useAddBuilding from "../../../hooks/buildings/useAddBuilding";
import buildingsService from "../../../services/buildingsService";

// Test component that uses the hook
function TestComponent() {
  const { building, handleChange, handleCheckboxChange, handleSubmit, error, isBuildingAdded } = useAddBuilding();
  
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name</label>
        <input id="name" name="name" value={building.name} onChange={handleChange} />

        <label htmlFor="isComputerRoom">Computer Room</label>
        <input type="checkbox" id="isComputerRoom" name="isComputerRoom" checked={building.isComputerRoom} onChange={handleCheckboxChange} />

        <button type="submit">Add Building</button>
      </form>
      {error && <p>{error}</p>}
      {isBuildingAdded && <p>Building added</p>}
    </div>
  );
}

// Mock the buildingsService
jest.mock("../../../services/buildingsService", () => ({
  addBuilding: jest.fn(),
}));

describe("useAddBuilding hook", () => {
  beforeEach(() => {
    buildingsService.addBuilding.mockResolvedValue({});
  });

  it("adds a new building and resets the form", async () => {
    const { getByLabelText, getByRole, queryByText } = render(<TestComponent />);

    fireEvent.input(getByLabelText("Name"), { target: { value: "Test Building" } });
    fireEvent.click(getByLabelText("Computer Room"));
    fireEvent.click(getByRole("button", { name: "Add Building" }));

    // Wait for any async actions to finish
    await waitFor(() => {
      expect(buildingsService.addBuilding).toHaveBeenCalled();
      expect(getByLabelText("Name").value).toBe("");
      expect(getByLabelText("Computer Room").checked).toBe(false);
      expect(queryByText("Building added")).toBeInTheDocument();
    });
  });

  it("sets error state when adding a building fails", async () => {
    buildingsService.addBuilding.mockRejectedValue(new Error("Test error"));
    const { getByRole, findByText } = render(<TestComponent />);
    fireEvent.click(getByRole("button", { name: "Add Building" }));

    expect(await findByText("Test error")).toBeInTheDocument();
  });
});
