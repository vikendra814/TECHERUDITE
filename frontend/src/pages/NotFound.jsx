import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="min-vh-100 bg-light d-flex flex-column align-items-center justify-content-center text-center px-3">
    <h1 className="display-1 fw-bold text-primary">404</h1>
    <h5 className="mb-2">Page not found</h5>
    <p className="text-muted mb-4">This booking link doesn't exist or has expired.</p>
    <Link to="/" className="btn btn-primary">Go Home</Link>
  </div>
);

export default NotFound;
