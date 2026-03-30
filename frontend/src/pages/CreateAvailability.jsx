import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { generateLink } from "../services/api";
import { handleApiError } from "../utils/errorHandler";
import Spinner from "../components/Spinner";

const today = new Date().toISOString().split("T")[0];
const toMins = (t) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

const CreateAvailability = () => {
  const navigate = useNavigate();

  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [errors, setErrors] = useState({});
  const [savedList, setSavedList] = useState([]);
  const [generating, setGenerating] = useState(false);

  const validate = () => {
    const errs = {};
    if (!date) errs.date = "Please select a date";
    else if (date < today) errs.date = "Date cannot be in the past";
    if (!startTime) errs.startTime = "Please select a start time";
    if (!endTime) errs.endTime = "Please select an end time";
    if (startTime && endTime) {
      if (toMins(startTime) >= toMins(endTime))
        errs.endTime = "End time must be after start time";
      else if (toMins(endTime) - toMins(startTime) < 30)
        errs.endTime = "Please select at least a 30 minute window";
    }
    return errs;
  };

  const handleAddDate = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    if (savedList.some((s) => s.date === date)) {
      setErrors({ date: "You already added this date" });
      return;
    }
    const slotCount = Math.floor((toMins(endTime) - toMins(startTime)) / 30);
    setSavedList([...savedList, { date, startTime, endTime, slotCount }]);
    setDate("");
    setStartTime("");
    setEndTime("");
    setErrors({});
    toast.success("Date added!");
  };

  const handleGenerateLink = async () => {
    if (!savedList.length) {
      toast.error("Add at least one date first");
      return;
    }
    setGenerating(true);
    try {
      const res = await generateLink(
        savedList.map(({ date, startTime, endTime }) => ({ date, startTime, endTime }))
      );
      toast.success("Booking link generated!");
      navigate("/created", {
        state: { bookingUrl: res.data.bookingUrl, dateSlots: res.data.dateSlots },
      });
    } catch (err) {
      handleApiError(err, navigate);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-vh-100 bg-light py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-7 col-lg-5">

            <div className="card shadow-sm mb-4">
              <div className="card-body p-4">
                <h5 className="mb-1">Set Your Availability</h5>
                <p className="text-muted small mb-4">Pick a date and time range, then click Add.</p>

                <form onSubmit={handleAddDate} noValidate>
                  <div className="mb-3">
                    <label className="form-label">Date</label>
                    <input
                      type="date"
                      className={`form-control ${errors.date ? "is-invalid" : ""}`}
                      min={today}
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />
                    {errors.date && <div className="invalid-feedback">{errors.date}</div>}
                  </div>

                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="form-label">Start Time</label>
                      <input
                        type="time"
                        className={`form-control ${errors.startTime ? "is-invalid" : ""}`}
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                      />
                      {errors.startTime && <div className="invalid-feedback">{errors.startTime}</div>}
                    </div>
                    <div className="col-6">
                      <label className="form-label">End Time</label>
                      <input
                        type="time"
                        className={`form-control ${errors.endTime ? "is-invalid" : ""}`}
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                      />
                      {errors.endTime && <div className="invalid-feedback">{errors.endTime}</div>}
                    </div>
                  </div>

                  <button type="submit" className="btn btn-outline-primary w-100">
                    + Add Date
                  </button>
                </form>
              </div>
            </div>

            {savedList.length > 0 && (
              <div className="card shadow-sm">
                <div className="card-body p-4">
                  <h6 className="mb-3">
                    Added Dates{" "}
                    <span className="badge bg-primary">{savedList.length}</span>
                  </h6>

                  <table className="table table-sm table-bordered align-middle mb-3">
                    <thead className="table-light">
                      <tr>
                        <th>Date</th>
                        <th>Start</th>
                        <th>End</th>
                        <th>Slots</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {savedList.map((item) => (
                        <tr key={item.date}>
                          <td>{item.date}</td>
                          <td>{item.startTime}</td>
                          <td>{item.endTime}</td>
                          <td>{item.slotCount}</td>
                          <td>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() =>
                                setSavedList(savedList.filter((s) => s.date !== item.date))
                              }
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <button
                    className="btn btn-primary w-100"
                    onClick={handleGenerateLink}
                    disabled={generating}
                  >
                    {generating ? <><Spinner /> Generating...</> : "Generate Booking Link"}
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAvailability;
