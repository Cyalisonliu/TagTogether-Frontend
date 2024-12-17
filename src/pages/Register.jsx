import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import Input from "../components/form/Input";
const apiUrl = import.meta.env.VITE_BACKEND_URL;

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isOldCustomer, setIsOldCustomer] = useState(false);

  const { setAlertClassName, setAlertMessage } = useOutletContext();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const payload = {
        user_name: username,
        password,
        is_old_customer: isOldCustomer,
      };
      console.log(payload);
      const response = await fetch(`${apiUrl}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log(data);
      if (response.ok) {
        setAlertClassName("hidden");
        setAlertMessage("");
        navigate("/login");
      } else {
        setAlertClassName(
          "bg-red-500 text-white p-4 rounded border border-red-700"
        );
        setAlertMessage(data.detail || "Register failed.");
      }
    } catch (error) {
      setAlertClassName(
        "bg-red-500 text-white p-4 rounded border border-red-700"
      );
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      setAlertMessage(`${errorMessage} occurred during Register.`);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen text-gray-200 bg-gray-900">
      <div className="w-full max-w-md p-8 bg-gray-800 rounded shadow-lg">
        <h2 className="mb-6 text-2xl font-bold text-center text-gold-400">
          Register
        </h2>
        <form onSubmit={handleSubmit} className="w-full">
          <div className="mb-4">
            <Input
              title="Username"
              type="text"
              name="username"
              className="w-full px-4 py-2 text-sm text-gray-200 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-600"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <Input
              title="Password"
              type="password"
              name="password"
              className="w-full px-4 py-2 text-sm text-gray-200 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-600"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex items-center mb-6">
            <input
              type="checkbox"
              id="oldCustomer"
              checked={isOldCustomer}
              onChange={(e) => setIsOldCustomer(e.target.checked)}
              className="w-5 h-5 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-2 focus:ring-purple-500 checked:bg-purple-600 checked:border-transparent"
            />
            <label
              htmlFor="oldCustomer"
              className="ml-3 text-sm text-gray-300 cursor-pointer"
            >
              I am an old customer
            </label>
          </div>
          <button
            type="submit"
            className="w-full py-3 text-lg font-semibold text-white transition bg-purple-600 rounded hover:bg-purple-700"
          >
            Register
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-gray-400">
          Already have an account?{" "}
          <span
            className="font-semibold text-purple-400 cursor-pointer hover:underline"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
