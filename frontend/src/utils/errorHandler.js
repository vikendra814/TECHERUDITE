import { toast } from "react-toastify";

export const handleApiError = (error, navigate) => {
  if (!error.response) {
    toast.error("Network error. Please check your connection.");
    return null;
  }

  const { status, data } = error.response;

  if (status === 400) {
    return data.errors?.length ? data.errors : [{ message: data.message }];
  }

  if (status === 404) {
    if (navigate) navigate("/not-found");
    return null;
  }

  if (status === 409) {
    toast.error(data.message || "Something went wrong");
    return null;
  }

  toast.error("Something went wrong. Please try again.");
  return null;
};
