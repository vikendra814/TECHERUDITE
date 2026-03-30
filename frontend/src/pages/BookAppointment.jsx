import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getAvailability, createBooking } from "../services/api";
import { handleApiError } from "../utils/errorHandler";
import Spinner from "../components/Spinner";

const BookAppointment = () => {
  const { linkId } = useParams();
  const navigate = useNavigate();

  const [availability, setAvailability] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [bookingDone, setBookingDone] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getAvailability(linkId);
        setAvailability(res.data);
      } catch (err) {
        handleApiError(err, navigate);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [linkId]);

  const availableDates = availability?.dateSlots?.filter(
    (ds) =>
      ds.slots.some((s) => !s.isBooked) &&
      ds.date >= new Date().toISOString().split("T")[0]
  ) ?? [];

  const handleDateClick = (ds) => {
    setSelectedDate(ds);
    setSelectedSlot(null);
    setErrors({});
  };

  const validate = () => {
    const errs = {};
    if (!guestName.trim()) errs.guestName = "Name is required";
    else if (guestName.trim().length < 2) errs.guestName = "Name must be at least 2 characters";
    if (!guestEmail.trim()) errs.guestEmail = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestEmail))
      errs.guestEmail = "Please enter a valid email";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedSlot) {
      toast.error("Please select a time slot first");
      return;
    }

    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setErrors({});
    setSubmitting(true);

    try {
      await createBooking(linkId, {
        dateSlotId: selectedDate._id,
        slotId: selectedSlot._id,
        guestName,
        guestEmail,
      });
      setBookingDone(true);
      toast.success("You're booked!");
    } catch (err) {
      const fieldErrors = handleApiError(err, navigate);
      if (fieldErrors) {
        const mapped = {};
        fieldErrors.forEach((e) => { mapped[e.field] = e.message; });
        setErrors(mapped);
      } else {
        const res = await getAvailability(linkId).catch(() => null);
        if (res) setAvailability(res.data);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  if (!availability) return null;

  if (bookingDone) {
    return (
      <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center p-3">
        <div className="card shadow-sm text-center p-4" style={{ maxWidth: 420, width: "100%" }}>
          <div className="fs-1 mb-2">🎉</div>
          <h5 className="text-success mb-3">You're all set!</h5>
          <p className="text-muted mb-1">
            <strong>{guestName}</strong>, your appointment is confirmed.
          </p>
          <p className="text-muted mb-1">{selectedDate.date}</p>
          <p className="text-muted">{selectedSlot.startTime} – {selectedSlot.endTime}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-light py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-7 col-lg-5">
            <div className="card shadow-sm">
              <div className="card-body p-4">
                <h5 className="mb-4">Book an Appointment</h5>

                <p className="text-muted small mb-2">Select a date</p>
                {availableDates.length === 0 ? (
                  <div className="alert alert-warning">No available dates for this link.</div>
                ) : (
                  <div className="d-flex flex-wrap gap-2 mb-4">
                    {availableDates.map((ds) => {
                      const d = new Date(ds.date + "T00:00:00");
                      return (
                        <button
                          key={ds._id}
                          onClick={() => handleDateClick(ds)}
                          className={`btn btn-sm d-flex flex-column align-items-center px-3 py-2 ${selectedDate?._id === ds._id ? "btn-primary" : "btn-outline-secondary"}`}
                          style={{ minWidth: 56, lineHeight: 1.4 }}
                        >
                          <span className="fw-bold">{d.toLocaleDateString("en-US", { day: "2-digit" })}</span>
                          <span style={{ fontSize: 11 }}>{d.toLocaleDateString("en-US", { month: "short" })}</span>
                          <span style={{ fontSize: 10 }}>{d.toLocaleDateString("en-US", { weekday: "short" })}</span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {selectedDate && (
                  <>
                    <p className="text-muted small mb-2">Select a time slot</p>
                    <div className="d-flex flex-wrap gap-2 mb-4">
                      {selectedDate.slots
                        .filter((s) => !s.isBooked)
                        .map((slot) => (
                          <button
                            key={slot._id}
                            onClick={() => setSelectedSlot(slot)}
                            className={`btn btn-sm rounded-pill ${selectedSlot?._id === slot._id ? "btn-primary" : "btn-outline-secondary"}`}
                          >
                            {slot.startTime} – {slot.endTime}
                          </button>
                        ))}
                    </div>
                  </>
                )}

                {selectedSlot && (
                  <form onSubmit={handleSubmit} noValidate>
                    <p className="text-muted small mb-2">Your details</p>

                    <div className="mb-3">
                      <label className="form-label">Full Name</label>
                      <input
                        type="text"
                        className={`form-control ${errors.guestName ? "is-invalid" : ""}`}
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        placeholder="John Doe"
                      />
                      {errors.guestName && <div className="invalid-feedback">{errors.guestName}</div>}
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        className={`form-control ${errors.guestEmail ? "is-invalid" : ""}`}
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                        placeholder="john@example.com"
                      />
                      {errors.guestEmail && <div className="invalid-feedback">{errors.guestEmail}</div>}
                    </div>

                    <button type="submit" className="btn btn-primary w-100" disabled={submitting}>
                      {submitting ? <><Spinner /> Booking...</> : "Book Appointment"}
                    </button>
                  </form>
                )}

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;
