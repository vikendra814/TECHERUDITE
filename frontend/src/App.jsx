import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import CreateAvailability from "./pages/CreateAvailability";
import LinkCreated from "./pages/LinkCreated";
import BookAppointment from "./pages/BookAppointment";
import NotFound from "./pages/NotFound";

const App = () => (
  <BrowserRouter>
    <ToastContainer position="top-right" autoClose={4000} />
    <Routes>
      <Route path="/" element={<Navigate to="/create" replace />} />
      <Route path="/create" element={<CreateAvailability />} />
      <Route path="/created" element={<LinkCreated />} />
      <Route path="/book/:linkId" element={<BookAppointment />} />
      <Route path="/not-found" element={<NotFound />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

export default App;
