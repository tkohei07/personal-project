import { useEffect, useState } from "react";
import { render, act } from "@testing-library/react";
import useDeleteHour from "../../../hooks/hours/useDeleteHour";
import hoursService from "../../../services/hoursService";

jest.mock("../../../services/hoursService", () => ({
  deleteHour: jest.fn(),
}));

describe("Delete Hour Hook", () => {
  it("useDeleteHour deletes hour", async () => {
    const TestComponent = () => {
      const { deleteHour, error } = useDeleteHour();
      const [hours, setHours] = useState([{id: 1}, {id: 2}]);
      useEffect(() => {
        deleteHour(1, hours, setHours);
      }, []);
      return error ? <div>{error}</div> : <div>{hours.length}</div>;
    };

    hoursService.deleteHour.mockResolvedValue();

    const { findByText } = render(<TestComponent />);

    expect(await findByText("1")).toBeInTheDocument();
  });

  it("useDeleteHour sets error on failure", async () => {
    console.error = jest.fn();

    const TestComponent = () => {
      const { deleteHour, error } = useDeleteHour();
      const [hours, setHours] = useState([{id: 1}, {id: 2}]);
      useEffect(() => {
        deleteHour(3, hours, setHours);
      }, []);
      return error ? <div>{error}</div> : <div>{hours.length}</div>;
    };

    const mockError = new Error('Delete failed');
    hoursService.deleteHour.mockRejectedValue(mockError);

    const { findByText } = render(<TestComponent />);

    expect(await findByText(mockError.message)).toBeInTheDocument();
  });
});
