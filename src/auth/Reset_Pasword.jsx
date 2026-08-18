import { useEffect, useState } from "react";

import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";

import {
  ArrowForward,
  Lock,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";

import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";

import { authSignIn } from "../api/login";
import AuthLeft from "./AuthLeft";
import LogoMobile from "./LogoMobile";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const storedEmail = sessionStorage.getItem("reset_email");

    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);
  const maskEmail = (email) => {
    if (!email || !email.includes("@")) {
      return "";
    }

    const [name, domain] = email.split("@");

    return (
      name.charAt(0) +
      "****************" +
      name.charAt(name.length - 1) +
      "@" +
      domain
    );
  };

  const formik = useFormik({
    initialValues: {
      code: "",
      password: "",
      confirmPassword: "",
    },

    validationSchema: Yup.object({
      code: Yup.string()
        .matches(/^[0-9]{6}$/, "OTP must be 6 digits")
        .required("Verification code is required"),

      password: Yup.string()
        .min(8, "Password must be minimum 8 characters")
        .required("Password is required"),

      confirmPassword: Yup.string()
        .required("Confirm password is required")
        .test("password-match", "Passwords must match", function (value) {
          return value === this.parent.password;
        }),
    }),

    onSubmit: async (values) => {
      setLoading(true);

      try {
        const payload = {
          email: email,

          otp: values.code,

          newPassword: values.password,
        };

        const res = await authSignIn("/api/auth/reset-password", payload);

        if (res?.error) {
          toast.error(res.message || "Reset password failed");

          return;
        }

        toast.success("Password reset successfully");

        sessionStorage.removeItem("reset_email");

        navigate("/signin");
      } catch (error) {
        toast.error(error.message || "Unable to reset password");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: { xs: 0, sm: 2, md: 4 },
        background: `
    radial-gradient(circle at 10% 20%,#dbeafe 0%,transparent 35%),
    radial-gradient(circle at 90% 80%,#ede9fe 0%,transparent 35%),
    #f8fafc
    `,
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 1280,
          minHeight: { xs: "100vh", sm: 720 },
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          overflow: "hidden",
          borderRadius: { xs: 0, sm: 6 },
          background: "rgba(255,255,255,.75)",
          backdropFilter: "blur(30px)",
          boxShadow: { xs: "none", sm: "0 40px 100px rgba(15,23,42,.15)" },
        }}
      >
        <AuthLeft />

        <Box
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: {
              xs: "flex-start",
              sm: "center",
              md: "center",
            },
            px: { xs: 3, sm: 5, md: 8 },
            py: { xs: 6, md: 0 },
          }}
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: 430,
            }}
          >
            {/* MOBILE LOGO */}

            <Box
              sx={{
                display: {
                  xs: "flex",
                  md: "none",
                },

                flexDirection: "column",

                alignItems: "center",

                mb: 4,
              }}
            >
              <LogoMobile />
            </Box>

            <Typography
              sx={{
                fontSize: {
                  xs: 24,
                  sm: 28,
                  md: 40,
                },
                fontWeight: 800,
                textAlign: "center",
              }}
            >
              Reset your password
            </Typography>

            <Typography
              color="text.secondary"
              sx={{
                mt: 2,
                mb: 4,
                textAlign: "center",
                lineHeight: 1.6,
                fontSize: { xs: 14, sm: 15 },
                wordBreak: "break-word",
              }}
            >
              Enter the code sent to <b>{maskEmail(email)}</b> to continue
            </Typography>

            <Box component="form" onSubmit={formik.handleSubmit}>
              {/* OTP */}

              <TextField
                fullWidth
                name="code"
                placeholder="Enter verification code"
                value={formik.values.code}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.code && Boolean(formik.errors.code)}
                helperText={formik.touched.code && formik.errors.code}
                sx={{
                  mb: 3,
                  "& .MuiOutlinedInput-root": {
                    height: { xs: 52, sm: 58 },
                    borderRadius: 3,
                    fontSize: { xs: 14, sm: 16 },
                  },
                }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock fontSize="small" />
                      </InputAdornment>
                    ),
                  },
                }}
              />

              {/* New Password */}

              <TextField
                fullWidth
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="New password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.password && Boolean(formik.errors.password)
                }
                helperText={formik.touched.password && formik.errors.password}
                sx={{
                  mb: 3,
                  "& .MuiOutlinedInput-root": {
                    height: { xs: 52, sm: 58 },
                    borderRadius: 3,
                    fontSize: { xs: 14, sm: 16 },
                  },
                }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock fontSize="small" />
                      </InputAdornment>
                    ),

                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <VisibilityOff fontSize="small" />
                          ) : (
                            <Visibility fontSize="small" />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />

              {/* Confirm Password */}

              <TextField
                fullWidth
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm password"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.confirmPassword &&
                  Boolean(formik.errors.confirmPassword)
                }
                helperText={
                  formik.touched.confirmPassword &&
                  formik.errors.confirmPassword
                }
                sx={{
                  mb: 3,
                  "& .MuiOutlinedInput-root": {
                    height: { xs: 52, sm: 58 },
                    borderRadius: 3,
                    fontSize: { xs: 14, sm: 16 },
                  },
                }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock fontSize="small" />
                      </InputAdornment>
                    ),

                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                        >
                          {showConfirmPassword ? (
                            <VisibilityOff fontSize="small" />
                          ) : (
                            <Visibility fontSize="small" />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <Button
                fullWidth
                type="submit"
                disabled={loading}
                variant="contained"
                endIcon={!loading && <ArrowForward />}
                sx={{
                  height: { xs: 52, sm: 60 },

                  borderRadius: 3,

                  textTransform: "none",

                  fontSize: { xs: 15, sm: 17 },

                  fontWeight: 700,

                  background: "linear-gradient(90deg,#2563eb,#7c3aed)",
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Reset Password"
                )}
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ResetPassword;
