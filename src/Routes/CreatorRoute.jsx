
import { Navigate } from "react-router";
import useRole from "../Hooks/useRole";

const CreatorRoute = ({ children }) => {
  const [role, loading] = useRole();

  if (loading) return <p>Loading...</p>;
  if (role !== 'creator') return <Navigate to="/" />;

  return children;
};

export default CreatorRoute;
