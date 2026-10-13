// Mirrors rock-diet-backend successResponse, with an added `success` flag.
export const successResponse = ({
  res,
  message = "done",
  status = 200,
  data,
}) => {
  return res.status(status).json({
    success: true,
    message,
    status,
    data,
  });
};
