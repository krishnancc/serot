import { useState } from "react";

import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";

import {
  ArrowForward,
  Lock,
  Person,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useFormik } from "formik";
import * as Yup from "yup";
import { authSignIn } from "../api/login"; // adjust path
import AuthLeft from "./AuthLeft";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      identifier: "",
      password: "",
    },

    validationSchema: Yup.object({
      identifier: Yup.string().required("Email or Member ID is required"),

      password: Yup.string()
        .required("Password is required")
        .min(6, "Password must be minimum 6 characters"),
      rememberMe: false,
    }),

    onSubmit: async (values) => {
      setLoading(true);

      try {
        console.log("Form Values:", values);

        // Call Login API
        const response = await authSignIn("/api/auth/signin", values);

        console.log("API Response:", response);

        // Handle API Error
        if (!response || response.error) {
          toast.error(
            response?.error?.message || "Login failed. Please try again.",
          );
          return;
        }

        const resData = response.data;

        // Handle Unverified Account
        if (resData?.requiresVerification) {
          sessionStorage.setItem("signup_email", resData.identifier);

          toast.info("Account not verified. OTP has been sent to your email.");

          // Navigate to Verify OTP page if required
          // navigate("/verify-otp");
          return;
        }

        // Validate Access Token
        if (!resData?.accessToken) {
          toast.error("Authentication failed. Access token not received.");
          return;
        }

        // Store Token
        localStorage.setItem("token", resData.accessToken);

        if (values.rememberMe) {
          localStorage.setItem("token", resData.accessToken);

          if (resData.user) {
            localStorage.setItem("serot_user", JSON.stringify(resData.user));
          }
        } else {
          sessionStorage.setItem("token", resData.accessToken);

          if (resData.user) {
            sessionStorage.setItem("serot_user", JSON.stringify(resData.user));
          }
        }
        // Optional: Store User Details
        if (resData.user) {
          localStorage.setItem("unison_user", JSON.stringify(resData.user));
        }

        // Optional: Clear Form
        // reset();

        // toast.success("Logged in successfully ✅");
        navigate("/");
      } catch (error) {
        console.error("Login Error:", error);

        toast.error(
          error?.response?.data?.message ||
            error?.message ||
            "Something went wrong. Please try again.",
        );
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
          xs: "linear-gradient(180deg,#eef4ff 0%,#ffffff 50%,#f8fafc 100%)",
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
            md: "rgba(255,255,255,.75)",
          },
          backdropFilter: {
            md: "blur(30px)",
          },
          border: {
            xs: "none",
            md: "1px solid rgba(255,255,255,.6)",
          },
          boxShadow: {
            xs: "none",
            md: "0 40px 100px rgba(15,23,42,.15)",
          },
        }}
      >
        {/* LEFT SECTION */}
        <AuthLeft />

        {/* RIGHT LOGIN SECTION */}
        <Box
          sx={{
            flex: 1,

            display: "flex",

            alignItems: {
              xs: "flex-start",
              md: "center",
            },

            justifyContent: "center",

            px: {
              xs: 2,
              sm: 3,
              md: 8,
            },

            pt: {
              xs: 4,
              sm: 2,
              md: 0,
            },

            pb: {
              xs: 4,
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
              <Box
                sx={{
                  width: { xs: 56, sm: 70 },

                  height: { xs: 56, sm: 70 },

                  borderRadius: 4,

                  display: "flex",

                  alignItems: "center",

                  justifyContent: "center",

                  fontSize: { xs: 26, sm: 32 },

                  fontWeight: 900,

                  color: "#fff",

                  background: "linear-gradient(135deg,#2563eb,#7c3aed)",

                  boxShadow: "0 15px 35px rgba(37,99,235,.35)",
                }}
              >
                S
              </Box>

              <Typography mt={2} fontSize={{ xs: 19, sm: 22 }} fontWeight={800}>
                Serot
              </Typography>
            </Box>

            <Typography
              sx={{
                fontSize: {
                  xs: 24,
                  sm: 28,
                  md: 42,
                },
                fontWeight: 800,
                textAlign: {
                  xs: "center",
                  md: "left",
                },
              }}
            >
              Welcome Back 👋
            </Typography>

            <Typography
              color="text.secondary"
              sx={{
                mt: 1,
                mb: 4,
                fontSize: { xs: 14, sm: 15 },
                textAlign: {
                  xs: "center",
                  md: "left",
                },
              }}
            >
              Login with your email or member ID
            </Typography>
            <Box
              component="form"
              onSubmit={formik.handleSubmit}
              sx={{ width: "100%", maxWidth: 430 }}
            >
              <TextField
                fullWidth
                name="identifier"
                placeholder="Enter email or member ID"
                value={formik.values.identifier}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.identifier && Boolean(formik.errors.identifier)
                }
                helperText={
                  formik.touched.identifier && formik.errors.identifier
                }
                sx={{
                  mb: 2.5,
                  "& .MuiOutlinedInput-root": {
                    height: {
                      xs: 50,
                      sm: 54,
                      md: 58,
                    },
                    borderRadius: 3,
                    fontSize: { xs: 14, sm: 16 },
                  },
                }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person
                          color="action"
                          sx={{
                            fontSize: 20,
                          }}
                        />
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <TextField
                fullWidth
                name="password"
                placeholder="Enter password"
                type={showPassword ? "text" : "password"}
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.password && Boolean(formik.errors.password)
                }
                helperText={formik.touched.password && formik.errors.password}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    height: {
                      xs: 50,
                      sm: 54,
                      md: 58,
                    },
                    borderRadius: 3,
                    fontSize: { xs: 14, sm: 16 },
                  },
                }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock
                          sx={{
                            fontSize: 20,
                          }}
                        />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={() => setShowPassword((prev) => !prev)}
                          onMouseDown={(e) => e.preventDefault()}
                          edge="end"
                        >
                          {showPassword ? (
                            <VisibilityOff
                              sx={{
                                fontSize: 20,
                              }}
                            />
                          ) : (
                            <Visibility
                              sx={{
                                fontSize: 20,
                              }}
                            />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <Box
                sx={{
                  display: "flex",

                  flexDirection: {
                    xs: "column",
                    sm: "row",
                  },

                  justifyContent: "space-between",

                  alignItems: {
                    xs: "flex-start",
                    sm: "center",
                  },

                  gap: {
                    xs: 1,
                    sm: 0,
                  },

                  mt: 1,
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      size="small"
                      name="rememberMe"
                      checked={formik.values.rememberMe}
                      onChange={formik.handleChange}
                    />
                  }
                  label="Remember me"
                  sx={{
                    "& .MuiFormControlLabel-label": {
                      fontSize: { xs: 13, sm: 14 },
                    },
                  }}
                />

                <Typography
                  color="primary"
                  sx={{
                    cursor: "pointer",
                  }}
                  onClick={() => navigate("/request-password-reset")}
                  fontSize={{ xs: 13, sm: 14 }}
                  fontWeight={600}
                >
                  Forgot password?
                </Typography>
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                endIcon={!loading && <ArrowForward />}
                sx={{
                  mt: 3,
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
                  "Log In"
                )}
              </Button>
            </Box>
            <Box
              sx={{
                display: "flex",

                flexDirection: {
                  xs: "column",
                  sm: "row",
                },

                alignItems: "center",

                justifyContent: "center",

                mt: 4,

                gap: {
                  xs: 0.5,
                  sm: 1,
                },
              }}
            >
              <Typography
                color="text.secondary"
                fontSize={{
                  xs: 14,
                  sm: 16,
                }}
              >
                Don't have an account?
              </Typography>

              <Typography
                color="primary"
                fontWeight={700}
                sx={{
                  cursor: "pointer",
                }}
                fontSize={{
                  xs: 14,
                  sm: 16,
                }}
                onClick={() => navigate("/signup")}
              >
                Create Account
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
