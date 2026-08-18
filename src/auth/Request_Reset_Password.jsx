import { useState } from "react";

import {
  Box,
  Button,
  CircularProgress,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { authSignIn } from "../api/login"; // adjust path

import { ArrowForward, Email } from "@mui/icons-material";

import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useFormik } from "formik";
import * as Yup from "yup";

import AuthLeft from "./AuthLeft";
import LogoMobile from "./LogoMobile";
// import { forgotPassword } from "../api/login";

const RequestResetPassword = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
    },

    validationSchema: Yup.object({
      email: Yup.string()
        .email("Please enter a valid email")
        .required("Email is required"),
    }),

    onSubmit: async (values) => {
      setLoading(true);
      try {
        console.log(values);
        const res = await authSignIn("/api/auth/request-password-reset", {
          email: values.email,
        });
        console.log("Request Reset Pass ", res);
        if (res?.error) {
          toast.error(res.error?.message || "Request failed");
          return;
        }

        sessionStorage.setItem("reset_email", values.email);

        toast.success("OTP sent successfully");

        navigate("/reset-password");
      } catch (error) {
        toast.error(error.message || "Unable to send OTP");
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

        alignItems: {
          xs: "flex-start",
          md: "center",
        },

        justifyContent: "center",

        p: {
          xs: 0,
          sm: 2,
          md: 4,
        },

        background: {
          xs: "linear-gradient(180deg,#eef4ff,#ffffff)",

          md: `
                    radial-gradient(circle at 10% 20%,#dbeafe 0%,transparent 35%),
                    radial-gradient(circle at 90% 80%,#ede9fe 0%,transparent 35%),
                    #f8fafc
                    `,
        },
      }}
    >
      <Box
        sx={{
          width: "100%",

          maxWidth: 1280,

          minHeight: {
            xs: "100vh",
            sm: "auto",
            md: 720,
          },

          display: "flex",

          flexDirection: {
            xs: "column",
            md: "row",
          },

          overflow: "hidden",

          borderRadius: {
            xs: 0,
            md: 6,
          },

          background: {
            xs: "transparent",
            md: "rgba(255,255,255,0.75)",
          },

          backdropFilter: {
            md: "blur(30px)",
          },

          boxShadow: {
            md: "0 40px 100px rgba(15,23,42,.15)",
          },
        }}
      >
        {/* LEFT SIDE */}

        <AuthLeft />

        {/* RIGHT SIDE */}

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

            px: {
              xs: 2,
              sm: 5,
              md: 8,
            },

            py: {
              xs: 4,
              sm: 6,
              md: 0,
            },
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

                textAlign: {
                  xs: "center",
                  md: "left",
                },
              }}
            >
              Forgot your password?
            </Typography>

            <Typography
              color="text.secondary"
              sx={{
                mt: 2,

                mb: 4,

                lineHeight: 1.6,

                fontSize: { xs: 14, sm: 15 },

                textAlign: {
                  xs: "center",
                  md: "left",
                },
              }}
            >
              Enter your registered email address and we’ll send you a 6-digit
              verification code to reset your password.
            </Typography>

            <Box component="form" onSubmit={formik.handleSubmit}>
              <TextField
                fullWidth
                name="email"
                placeholder="Enter your email address"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
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
                        <Email fontSize="small" />
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
                  "Send Verification Code"
                )}
              </Button>
            </Box>
            <Typography
              sx={{
                mt: 4,

                textAlign: "center",

                color: "primary.main",

                fontWeight: 700,

                fontSize: { xs: 14, sm: 16 },

                cursor: "pointer",
              }}
              onClick={() => navigate("/signin")}
            >
              Back to Login
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default RequestResetPassword;
