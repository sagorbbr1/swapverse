import { useAuth } from "../AuthContext/AuthContext";

export const Dashboard = () => {
  const { user } = useAuth();

  return <h2>Welcome, {user?.fullname || "Guest"}!</h2>;
};
