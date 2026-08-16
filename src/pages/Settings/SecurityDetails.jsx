import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

import {
  ArrowBack,
  Lock,
  Save,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";

import { Form, Formik } from "formik";
import * as Yup from "yup";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";

import { postMethod } from "../../api/login";

/* =========================
   Validation Schema
========================= */

const PasswordSchema = Yup.object({
  currentPassword: Yup.string().required("Current password is required"),

  newPassword: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("New password is required"),

  confirmPassword: Yup.string().oneOf(
    [Yup.ref("newPassword"), null],
    "Passwords do not match",
  ),
});

/* =========================
   TextField Styles
========================= */
const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 2.5,
    backgroundColor: "#F8FAFC",
    transition: "background-color 120ms ease, box-shadow 120ms ease",

    "& fieldset": {
      borderColor: "#E2E8F0",
    },

    "&:hover fieldset": {
      borderColor: "#CBD5E1",
    },

    "&.Mui-focused": {
      backgroundColor: "#fff",
    },

    "&.Mui-focused fieldset": {
      borderColor: "#6366F1",
      borderWidth: 2,
    },
  },

  "& .MuiInputBase-input.Mui-disabled": {
    WebkitTextFillColor: "#94A3B8",
  },

  "& .MuiOutlinedInput-root.Mui-disabled": {
    backgroundColor: "#F1F5F9",
  },

  "& .MuiInputLabel-root": {
    fontWeight: 300,
  },
};

// Height reserved above the form on mobile so content doesn't sit
// underneath the fixed HeaderBar (see HeaderBar's `position: fixed` on xs).
const MOBILE_HEADER_OFFSET = 76;

const SecurityDetails = () => {
  const navigate = useNavigate();

  const [submittingExt, setSubmittingExt] = useState(false);

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const initialValues = {
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  };

  const submitPassword = async (values, { resetForm }) => {
    try {
      setSubmittingExt(true);

      const payload = {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      };

      const result = await postMethod("/api/user/change-password", payload);

      if (result?.error) {
        toast.error(result.error.message || "Failed to update password");
        return;
      }

      toast.success("Password updated");

      resetForm();
    } catch (error) {
      toast.error(error?.message || "Password update failed");
    } finally {
      setSubmittingExt(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const HeaderBar = () => (
    <Stack
      direction="row"
      alignItems="center"
      spacing={{ xs: 1.5, sm: 2 }}
      sx={{
        position: {
          xs: "fixed",
          sm: "static",
        },
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1200,
        bgcolor: {
          xs: "#FFFFFF",
          sm: "transparent",
        },
        px: {
          xs: 2,
          sm: 0,
        },
        py: {
          xs: 1.5,
          sm: 0,
        },
        boxShadow: {
          xs: "0 2px 8px rgba(0,0,0,0.08)",
          sm: "none",
        },
      }}
    >
      <Tooltip title="Go back">
        <IconButton
          onClick={handleBack}
          sx={{
            display: {
              xs: "flex",
              sm: "none",
            },
            width: 40,
            height: 40,
            borderRadius: 2.5,
            bgcolor: "#F1F5F9",
            color: "#334155",

            "&:hover": {
              bgcolor: "#E2E8F0",
            },
          }}
        >
          <ArrowBack />
        </IconButton>
      </Tooltip>

      <Box sx={{ minWidth: 0 }}>
        <Typography
          sx={{
            fontSize: {
              xs: 19,
              sm: 21,
              md: 24,
            },
            fontWeight: 600,
          }}
        >
          Security
        </Typography>

        <Typography
          color="text.secondary"
          sx={{
            fontSize: {
              xs: 12.5,
              sm: 13,
              md: 14,
            },
          }}
        >
          Update your password to keep your account secure.
        </Typography>
      </Box>
    </Stack>
  );

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={PasswordSchema}
      onSubmit={submitPassword}
    >
      {({ values, errors, touched, handleChange, handleBlur }) => (
        <Form>
          <HeaderBar />

          {/* Spacer so content isn't hidden behind the
                            fixed HeaderBar on mobile */}
          <Box
            sx={{
              display: { xs: "block", sm: "none" },
              height: MOBILE_HEADER_OFFSET,
            }}
          />

          <Divider
            sx={{
              mb: {
                xs: 1,
                md: 4,
              },
              mt: {
                xs: 0,
                md: 1.5,
              },
              display: {
                xs: "none",
                sm: "block",
              },
            }}
          />

          <Grid container spacing={{ xs: 2.5, sm: 3 }}>
            {/* Current Password */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Current Password"
                name="currentPassword"
                type={showCurrent ? "text" : "password"}
                value={values.currentPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                error={
                  touched.currentPassword && Boolean(errors.currentPassword)
                }
                helperText={touched.currentPassword && errors.currentPassword}
                sx={fieldSx}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ fontSize: 20 }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={() => setShowCurrent(!showCurrent)}
                          edge="end"
                        >
                          {showCurrent ? (
                            <VisibilityOff sx={{ fontSize: 20 }} />
                          ) : (
                            <Visibility sx={{ fontSize: 20 }} />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Grid>

            {/* New Password */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="New Password"
                name="newPassword"
                type={showNew ? "text" : "password"}
                value={values.newPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.newPassword && Boolean(errors.newPassword)}
                helperText={touched.newPassword && errors.newPassword}
                sx={fieldSx}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ fontSize: 20 }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={() => setShowNew(!showNew)}
                          edge="end"
                        >
                          {showNew ? (
                            <VisibilityOff sx={{ fontSize: 20 }} />
                          ) : (
                            <Visibility sx={{ fontSize: 20 }} />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Grid>

            {/* Confirm Password */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Confirm New Password"
                name="confirmPassword"
                type={showConfirm ? "text" : "password"}
                value={values.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                error={
                  touched.confirmPassword && Boolean(errors.confirmPassword)
                }
                helperText={touched.confirmPassword && errors.confirmPassword}
                sx={fieldSx}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ fontSize: 20 }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={() => setShowConfirm(!showConfirm)}
                          edge="end"
                        >
                          {showConfirm ? (
                            <VisibilityOff sx={{ fontSize: 20 }} />
                          ) : (
                            <Visibility sx={{ fontSize: 20 }} />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Grid>
          </Grid>

          <Box
            display="flex"
            justifyContent={{ xs: "stretch", sm: "flex-end" }}
          >
            <Button
              fullWidth={false}
              sx={{
                width: { xs: "100%", sm: "auto" },
                mt: { xs: 4, md: 5 },
                mb: { xs: 1, md: 0 },
                borderRadius: 2.5,
                py: 1.5,
                px: { xs: 3, sm: 4 },
                fontWeight: 700,
                textTransform: "none",
                fontSize: { xs: 14.5, md: 16 },
                boxShadow: "none",
                background: "linear-gradient(90deg,#6366F1,#8B5CF6)",
                "&:hover": {
                  background: "linear-gradient(90deg,#4F46E5,#7C3AED)",
                  boxShadow: "0 12px 28px rgba(99,102,241,.35)",
                },
                "&.Mui-disabled": {
                  background: "#E2E8F0",
                  color: "#94A3B8",
                },
              }}
              size="large"
              type="submit"
              variant="contained"
              startIcon={!submittingExt && <Save />}
              disabled={submittingExt}
            >
              {submittingExt ? (
                <CircularProgress size={22} color="inherit" />
              ) : (
                "Update Password"
              )}
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default SecurityDetails;
