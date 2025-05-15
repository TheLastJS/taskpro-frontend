import * as Yup from "yup";

export const userLoginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Email must be a valid")
    .required("Email is a required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .max(20, "Password must not exceed 20 characters")
    .required("Password is required"),
});
