import { useEffect, useRef, useState } from "react";

import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";

import { ArrowForward } from "@mui/icons-material";

import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { authSignIn } from "../api/login";
import AuthLeft from "./AuthLeft";
import LogoMobile from "./LogoMobile";
function maskEmail(email = "") {
  if (!email || !email.includes("@")) {
    return "";
  }

  const [name, domain] = email.split("@");

  if (name.length <= 2) {
    return `${name[0]}*@${domain}`;
  }

  return `${name[0]}${"*".repeat(name.length - 2)}${name.at(-1)}@${domain}`;
}

const VerifySignup = () => {
  const navigate = useNavigate();
  const email = sessionStorage.getItem("signup_email") || "";
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const [loading, setLoading] = useState(false);

  const otpRefs = useRef([]);
  useEffect(() => {
    if (!email) {
      navigate("/signin", { replace: true });
    }
  }, [email, navigate]);

  const handleOtpChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];

    newOtp[index] = value;

    setOtp(newOtp);

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const otpValue = otp.join("");

    if (otpValue.length !== 6) {
      toast.error("Please enter 6 digit OTP");
      return;
    }
    try {
      setLoading(true);
      console.log("OTP:", otpValue);
      // OTP API CALL HERE

      const result = await authSignIn("/api/auth/verify-signup-otp", {
        email,
        otp: otpValue,
      });

      if (result?.error) {
        toast.error(result.error?.message || "Verification failed");
        return;
      }

      sessionStorage.removeItem("signup_email");

      toast.success("OTP Verified Successfully");

      navigate("/signin");
    } catch (error) {
      console.error(error);

      toast.error(error?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

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
            xs: "#fff",
            md: "rgba(255,255,255,.75)",
          },

          boxShadow: {
            xs: "none",
            md: "0 40px 100px rgba(15,23,42,.15)",
          },
        }}
      >
        {/* LEFT SIDE */}

        <AuthLeft />

        {/* OTP SECTION */}

        <Box
          sx={{
            flex: 1,

            display: "flex",

            alignItems: {
              xs: "flex-start",
              sm: "center",
              md: "center",
            },

            justifyContent: "center",

            px: {
              xs: 3,
              sm: 4,
              md: 8,
            },

            py: {
              xs: 5,
              md: 0,
            },
          }}
        >
          <Box
            sx={{
              width: "100%",

              maxWidth: 430,

              textAlign: {
                xs: "center",
                md: "left",
              },
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
                  md: 42,
                },

                fontWeight: 800,
              }}
            >
              Verify Code 🔐
            </Typography>

            <Typography
              color="text.secondary"
              sx={{
                mt: 1,

                mb: 4,

                fontSize: { xs: 14, sm: 15 },

                wordBreak: "break-word",
              }}
            >
              Enter the 6-digit code sent to {maskEmail(email)} to verify your
              email.
            </Typography>

            <Box component="form" onSubmit={handleSubmit}>
              <Box
                sx={{
                  display: "flex",

                  justifyContent: "center",

                  gap: {
                    xs: 1,
                    sm: 1.5,
                  },

                  mb: 4,
                }}
              >
                {otp.map((digit, index) => (
                  <TextField
                    key={index}
                    inputRef={(el) => (otpRefs.current[index] = el)}
                    value={digit}
                    onChange={(e) => handleOtpChange(e.target.value, index)}
                    onKeyDown={(e) => handleOtpKeyDown(e, index)}
                    inputProps={{
                      maxLength: 1,

                      inputMode: "numeric",

                      style: {
                        textAlign: "center",

                        fontSize: 20,

                        fontWeight: 700,

                        padding: 0,
                      },
                    }}
                    sx={{
                      width: {
                        xs: 40,
                        sm: 50,
                        md: 55,
                      },

                      "& .MuiOutlinedInput-root": {
                        height: {
                          xs: 50,
                          sm: 55,
                          md: 60,
                        },

                        borderRadius: 3,
                      },
                    }}
                  />
                ))}
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
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
                  "Verify Account"
                )}
              </Button>
            </Box>

            <Typography
              sx={{
                mt: 4,
                cursor: "pointer",
                color: "primary.main",
                fontWeight: 700,
                fontSize: { xs: 14, sm: 16 },
                textAlign: "center",
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

export default VerifySignup;
