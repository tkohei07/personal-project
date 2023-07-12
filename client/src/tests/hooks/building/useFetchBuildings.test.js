import { render } from "@testing-library/react";
import { useFetchBuildingsWithTodayHours, useFetchBuildings, useFetchBuildingById } from "../../../hooks/buildings/useFetchBuildings";
import buildingsService from "../../../services/buildingsService";

// Mock the buildingsService
jest.mock("../../../services/buildingsService", () => ({
  fetchBuildingsWithTodayHours: jest.fn(),
  getAllBuildings: jest.fn(),
  fetchBuildingById: jest.fn(),
}));

describe("Buildings Hooks", () => {
  it("useFetchBuildingsWithTodayHours fetches buildings", async () => {
    const TestComponent = () => {
      const buildings = useFetchBuildingsWithTodayHours();
      return <div>{buildings.length}</div>;
    };

    buildingsService.fetchBuildingsWithTodayHours.mockResolvedValue([{}, {}, {}]);

    const { findByText } = render(<TestComponent />);

    expect(await findByText("3")).toBeInTheDocument();
  });

  it("useFetchBuildings fetches all buildings", async () => {
    const TestComponent = () => {
      const buildings = useFetchBuildings();
      return <div>{buildings.length}</div>;
    };

    buildingsService.getAllBuildings.mockResolvedValue([{}, {}, {}, {}, {}]);

    const { findByText } = render(<TestComponent />);

    expect(await findByText("5")).toBeInTheDocument();
  });

  it("useFetchBuildingById fetches building by id", async () => {
    const TestComponent = ({ id }) => {
      const { building } = useFetchBuildingById(id);
      return <div>{building.name}</div>;
    };

    const mockBuilding = { name: 'Building1' };
    buildingsService.fetchBuildingById.mockResolvedValue(mockBuilding);

    const { findByText } = render(<TestComponent id="1" />);

    expect(await findByText(mockBuilding.name)).toBeInTheDocument();
  });
});
