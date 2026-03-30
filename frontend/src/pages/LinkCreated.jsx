import { useLocation, Link } from "react-router-dom";
import { toast } from "react-toastify";

const LinkCreated = () => {
  const { state } = useLocation();

  if (!state?.bookingUrl) {
    return (
      <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center">
        <div className="text-center">
          <p className="text-muted mb-3">No booking link found.</p>
          <Link to="/create" className="btn btn-primary">Go back</Link>
        </div>
      </div>
    );
  }

  const copy = () =>
    navigator.clipboard.writeText(state.bookingUrl).then(() => toast.success("Copied!"));

  return (
    <div className="min-vh-100 bg-light py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-7 col-lg-5">

            <div className="card shadow-sm mb-4">
              <div className="card-body p-4">
                <h5 className="text-success mb-1">Booking Link Ready!</h5>
                <p className="text-muted small mb-3">Share this with anyone you want to book time with you.</p>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    value={state.bookingUrl}
                    readOnly
                  />
                  <button className="btn btn-primary" onClick={copy}>Copy</button>
                </div>
              </div>
            </div>

            {state.dateSlots?.length > 0 && (
              <div className="card shadow-sm mb-4">
                <div className="card-body p-4">
                  <h6 className="mb-3">Your Availability</h6>
                  <table className="table table-sm table-bordered align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Date</th>
                        <th>Start</th>
                        <th>End</th>
                        <th>Slots</th>
                      </tr>
                    </thead>
                    <tbody>
                      {state.dateSlots.map((ds, i) => (
                        <tr key={ds._id || i}>
                          <td>{ds.date}</td>
                          <td>{ds.startTime}</td>
                          <td>{ds.endTime}</td>
                          <td>{ds.slots?.length ?? 0}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <Link to="/create" className="btn btn-outline-secondary w-100">
              Create Another
            </Link>

          </div>
        </div>
      </div>
    </div>
  );
};

export default LinkCreated;
