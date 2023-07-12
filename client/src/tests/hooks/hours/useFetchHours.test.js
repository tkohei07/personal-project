import { render } from "@testing-library/react";
import { useFetchHours } from "../../../hooks/hours/useFetchHours";
import hoursService from "../../../services/hoursService";

jest.mock("../../../services/hoursService", () => ({
  fetchHours: jest.fn(),
}));

describe("Hours Hook", () => {
  it("useFetchHours fetches hours", async () => {
    const TestComponent = ({ id }) => {
      const { hours } = useFetchHours(id);
      return <div>{hours.length}</div>;
    };

    const mockHours = [{}, {}, {}];
    hoursService.fetchHours.mockResolvedValue(mockHours);

    const { findByText } = render(<TestComponent id="1" />);

    expect(await findByText(mockHours.length.toString())).toBeInTheDocument();
  });

  it("useFetchHours sets error on failure", async () => {
    console.error = jest.fn();

    const TestComponent = ({ id }) => {
      const { hours, error } = useFetchHours(id);
      return error ? <div>{error.message}</div> : <div>{hours.length}</div>;
    };

    const mockError = new Error('Fetch failed');
    hoursService.fetchHours.mockRejectedValue(mockError);

    const { findByText } = render(<TestComponent id="1" />);

    expect(await findByText(mockError.message)).toBeInTheDocument();
  });
});
