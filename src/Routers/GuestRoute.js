import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function GuestRoute({ children, ...rest }) {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

    if (isAuthenticated) {
        return <Navigate to="/home" replace />;
    }

    return children;
}

export default GuestRoute;
