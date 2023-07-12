import { render, fireEvent, waitFor } from "@testing-library/react";
import { useAuth } from "../../../hooks/auth/useAuth";
import authService from "../../../services/authService";

// Test component that uses the hook
function TestComponent() {
  const { setUsername, setPassword, registerUser, loginUser, error } = useAuth();
  
  const handleRegister = async () => {
    await registerUser({username: "test", password: "password"});
  };

  const handleLogin = async () => {
    await loginUser({username: "test", password: "password"});
  };

  return (
    <div>
      <input onChange={e => setUsername(e.target.value)} />
      <input onChange={e => setPassword(e.target.value)} />
      <button onClick={handleRegister}>Register</button>
      <button onClick={handleLogin}>Login</button>
      {error && <p>{error}</p>}
    </div>
  );
}

// Mock the authService
jest.mock("../../../services/authService", () => ({
  register: jest.fn(),
  login: jest.fn(),
}));

describe("useAuth hook", () => {
  beforeEach(() => {
    authService.register.mockResolvedValue({});
    authService.login.mockResolvedValue({});
  });

  it("registers a new user", async () => {
    const { getByRole } = render(<TestComponent />);
    fireEvent.click(getByRole("button", { name: "Register" }));

    await waitFor(() => {
      expect(authService.register).toHaveBeenCalledWith({ username: "test", password: "password" });
    });
  });

  it("logs in a user", async () => {
    const { getByRole } = render(<TestComponent />);
    fireEvent.click(getByRole("button", { name: "Login" }));

    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledWith({ username: "test", password: "password" });
    });
  });
});
