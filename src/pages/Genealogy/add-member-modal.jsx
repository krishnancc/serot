import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";

import BadgeRoundedIcon from "@mui/icons-material/BadgeRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ErrorRoundedIcon from "@mui/icons-material/ErrorRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import MailRoundedIcon from "@mui/icons-material/MailRounded";
import PersonAddAltRoundedIcon from "@mui/icons-material/PersonAddAltRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";

import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Slide,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import { getMethod, postMethod } from "../../api/login";

/* ================= TRANSITION (mobile slide-up) ================= */

const SlideUpTransition = (props) => <Slide direction="up" {...props} />;

/* ================= VALIDATION ================= */

const addMemberSchema = Yup.object({
  username: Yup.string()
    .min(3, "Username minimum 3 characters")
    .required("Username is required"),

  phoneNo: Yup.string()
    .matches(/^[6-9]\d{9}$/, "Invalid phone number")
    .required("Phone number is required"),

  email: Yup.string().email("Invalid email").required("Email is required"),

  password: Yup.string()
    .min(8, "Minimum 8 characters")
    .required("Password is required"),

  referralId: Yup.string().required("Referral ID is required"),

  sendOTP: Yup.boolean(),

  verified: Yup.boolean(),
}).test(
  "otp-check",
  "Send OTP and Verified cannot both enabled",
  function (values) {
    if (values?.sendOTP && values?.verified) {
      return this.createError({
        path: "verified",
        message: "Send OTP and Verified cannot both enabled",
      });
    }
    return true;
  },
);

/* ================= COMPONENT ================= */

export function AddMemberModal({ open, referralId, onClose, onSuccess }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [showPassword, setShowPassword] = useState(false);
  const [sponsor, setSponsor] = useState(null);
  const [checkingSponsor, setCheckingSponsor] = useState(false);

  const hideVerifiedUser = import.meta.env.VITE_HIDE_VERIFIED_USER === "true";

  /* ================= TEXT FIELD STYLE ================= */

  const fieldSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: 2.5,
      backgroundColor: "#F8FAFC",
      transition: "background-color .2s ease, box-shadow .2s ease",

      "& fieldset": {
        borderColor: "#E2E8F0",
      },

      "&:hover fieldset": {
        borderColor: "#CBD5E1",
      },

      "&.Mui-focused": {
        backgroundColor: "#fff",
        boxShadow: "0 0 0 3px rgba(99,102,241,.12)",
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
      fontWeight: 400,
      color: "#64748B",
    },
  };

  const sectionLabelSx = {
    textTransform: "uppercase",
    letterSpacing: 0.6,
    fontWeight: 700,
    color: "#94A3B8",
    fontSize: 11.5,
    paddingTop: "10px",
  };

  const initialFormValues = {
    username: "",
    email: "",
    password: "",
    phoneNo: "",
    referralId: referralId || "",
    sendOTP: false,
    verified: false,
  };

  const formik = useFormik({
    initialValues: initialFormValues,

    validationSchema: addMemberSchema,

    onSubmit: async (values, { resetForm, setSubmitting }) => {
      if (!sponsor) {
        toast.error("Invalid sponsor referral ID");
        setSubmitting(false);
        return;
      }

      try {
        const res = await postMethod("/api/user/add-network-user", values);

        if (res?.error) {
          toast.error(res.error?.message || "Failed to add member");
          return;
        }

        toast.success("Member added successfully");

        resetForm({
          values: {
            ...initialFormValues,
            referralId: referralId || "",
          },
        });

        setSponsor(null);
        onSuccess?.();
        onClose();
      } catch (error) {
        toast.error(error.message || "Failed to add member");
      } finally {
        setSubmitting(false);
      }
    },
  });

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    setFieldValue,
    handleSubmit,
  } = formik;

  const HideVerification = process.env.REACT_APP_HIDE_VERIFIED_USER === "true";
  useEffect(() => {
    if (referralId) {
      setFieldValue("referralId", referralId);
    }
  }, [referralId]);

  const referralValue = values.referralId;

  /* ================= SPONSOR CHECK ================= */

  useEffect(() => {
    let timer;

    if (!open) {
      setSponsor(null);
      return;
    }

    if (!referralValue || referralValue.length < 5) {
      setSponsor(null);
      return;
    }

    timer = setTimeout(async () => {
      try {
        setCheckingSponsor(true);

        const res = await getMethod(
          `/api/user/lookup-by-superid/${referralValue}`,
        );

        setSponsor(res?.success ? res.data : null);
      } catch {
        setSponsor(null);
      } finally {
        setCheckingSponsor(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [referralValue, open]);

  const handleClose = (_e, reason) => {
    // avoid accidental dismissal mid-submit
    if (formik.isSubmitting && reason === "backdropClick") return;
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      fullScreen={isMobile}
      TransitionComponent={isMobile ? SlideUpTransition : undefined}
      PaperProps={{
        sx: {
          borderRadius: { xs: 0, sm: 4 },
          overflow: "hidden",
          ...(isMobile && {
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }),
        },
      }}
    >
      {/* ================= HEADER ================= */}
      <DialogTitle
        sx={{
          px: { xs: 2.5, sm: 4 },
          py: { xs: 2.25, sm: 3 },
          background: "linear-gradient(135deg,#6366F1,#8B5CF6)",
          color: "#fff",
          position: isMobile ? "sticky" : "static",
          top: 0,
          zIndex: 2,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(255,255,255,.15)",
              flexShrink: 0,
            }}
          >
            <PersonAddAltRoundedIcon />
          </Box>

          <Stack sx={{ minWidth: 0, flex: 1 }}>
            <Typography fontWeight={800} fontSize={{ xs: 17, sm: 22 }} noWrap>
              Add New Member
            </Typography>

            <Typography fontSize={13} sx={{ opacity: 0.85 }} noWrap>
              Create member under your network
            </Typography>
          </Stack>

          <IconButton
            onClick={onClose}
            size="small"
            sx={{
              color: "#fff",
              // background: "rgba(255,255,255,.12)",
              "&:hover": { background: "rgba(255,255,255,.22)" },
              flexShrink: 0,
            }}
          >
            <CloseRoundedIcon fontSize="small" />
          </IconButton>
        </Stack>
      </DialogTitle>

      {/* ================= CONTENT ================= */}
      <DialogContent
        sx={{
          px: { xs: 2.5, sm: 4 },
          py: 3,
          flex: { xs: 1, sm: "unset" },
          background: "#fff",
        }}
      >
        <form id="add-member-form" onSubmit={handleSubmit}>
          <Stack spacing={3.5}>
            {/* ---- Account details ---- */}
            <Typography sx={sectionLabelSx}>Account details</Typography>

            <Stack spacing={2}>
              <TextField
                sx={fieldSx}
                label="Username"
                name="username"
                fullWidth
                autoFocus={!isMobile}
                value={values.username}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.username && Boolean(errors.username)}
                helperText={touched.username && errors.username}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <BadgeRoundedIcon
                          sx={{ color: "#94A3B8" }}
                          fontSize="small"
                        />
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <TextField
                sx={fieldSx}
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                fullWidth
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password && errors.password}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockRoundedIcon
                          sx={{ color: "#94A3B8" }}
                          fontSize="small"
                        />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          edge="end"
                          size="small"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <VisibilityOffRoundedIcon fontSize="small" />
                          ) : (
                            <VisibilityRoundedIcon fontSize="small" />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />

              {/* ---- Contact details ---- */}

              <TextField
                sx={fieldSx}
                label="Phone Number"
                name="phoneNo"
                fullWidth
                inputProps={{ inputMode: "numeric", maxLength: 10 }}
                value={values.phoneNo}
                onChange={(e) => {
                  e.target.value = e.target.value
                    .replace(/\D/g, "")
                    .slice(0, 10);
                  handleChange(e);
                }}
                onBlur={handleBlur}
                error={touched.phoneNo && Boolean(errors.phoneNo)}
                helperText={touched.phoneNo && errors.phoneNo}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneRoundedIcon
                          sx={{ color: "#94A3B8", mr: -0.5 }}
                          fontSize="small"
                        />
                        <Divider
                          orientation="vertical"
                          flexItem
                          sx={{ mx: 1, borderColor: "#E2E8F0" }}
                        />
                        <Typography color="text.secondary">+91</Typography>
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <TextField
                sx={fieldSx}
                label="Email Address"
                name="email"
                type="email"
                fullWidth
                inputProps={{ inputMode: "email" }}
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <MailRoundedIcon
                          sx={{ color: "#94A3B8" }}
                          fontSize="small"
                        />
                      </InputAdornment>
                    ),
                  },
                }}
              />

              {/* ---- Sponsor ---- */}
              <Box>
                <TextField
                  sx={fieldSx}
                  label="Sponsor / Referral ID"
                  name="referralId"
                  fullWidth
                  inputProps={{ inputMode: "numeric" }}
                  value={values.referralId}
                  onChange={(e) => {
                    e.target.value = e.target.value.replace(/\D/g, "");
                    handleChange(e);
                  }}
                  onBlur={handleBlur}
                  error={touched.referralId && Boolean(errors.referralId)}
                  helperText={touched.referralId && errors.referralId}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Typography fontWeight={700} color="primary">
                            SR
                          </Typography>
                        </InputAdornment>
                      ),
                      endAdornment: checkingSponsor && (
                        <InputAdornment position="end">
                          <CircularProgress size={16} />
                        </InputAdornment>
                      ),
                    },
                  }}
                />

                {/* ---- sponsor status, directly under the field it validates ---- */}
                {!checkingSponsor && sponsor && (
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{
                      mt: 1,
                      p: 1.25,
                      borderRadius: 2,
                      background: "#ECFDF5",
                      color: "#059669",
                    }}
                  >
                    <CheckCircleRoundedIcon fontSize="small" />
                    <Typography variant="body2">
                      Sponsor: <b>{sponsor.username || sponsor.phoneNo}</b>
                    </Typography>
                  </Stack>
                )}

                {!checkingSponsor && referralValue && !sponsor && (
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{
                      mt: 1,
                      p: 1.25,
                      borderRadius: 2,
                      background: "#FEF2F2",
                      color: "#DC2626",
                    }}
                  >
                    <ErrorRoundedIcon fontSize="small" />
                    <Typography variant="body2">Invalid sponsor ID</Typography>
                  </Stack>
                )}
              </Box>
            </Stack>

            {/* ---- Verification ---- */}
            {HideVerification ? (
              <>&nbsp;</>
            ) : (
              <>
                {" "}
                <Stack spacing={1}>
                  <Typography
                    sx={{
                      textTransform: "uppercase",
                      letterSpacing: 0.6,
                      fontWeight: 700,
                      color: "#94A3B8",
                      fontSize: 11.5,
                    }}
                  >
                    Verification
                  </Typography>

                  <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                    <Box
                      sx={{
                        flex: 1,
                        border: "1px solid #E2E8F0",
                        borderRadius: 2.5,
                        px: 1.5,
                      }}
                    >
                      <FormControlLabel
                        sx={{
                          width: "100%",
                          m: 0,
                          justifyContent: "space-between",
                        }}
                        labelPlacement="start"
                        control={
                          <Checkbox
                            name="sendOTP"
                            checked={values.sendOTP}
                            onChange={handleChange}
                          />
                        }
                        label={
                          <Typography variant="body2">Send OTP</Typography>
                        }
                      />
                    </Box>

                    {!hideVerifiedUser && (
                      <Box
                        sx={{
                          flex: 1,
                          border: "1px solid #E2E8F0",
                          borderRadius: 2.5,
                          px: 1.5,
                          opacity: values.sendOTP ? 0.5 : 1,
                        }}
                      >
                        <FormControlLabel
                          sx={{
                            width: "100%",
                            m: 0,
                            justifyContent: "space-between",
                          }}
                          labelPlacement="start"
                          control={
                            <Checkbox
                              name="verified"
                              checked={values.verified}
                              disabled={values.sendOTP}
                              onChange={handleChange}
                            />
                          }
                          label={
                            <Typography variant="body2">
                              Mark Verified
                            </Typography>
                          }
                        />
                      </Box>
                    )}
                  </Stack>

                  {touched.verified && errors.verified && (
                    <Typography variant="caption" color="error">
                      {errors.verified}
                    </Typography>
                  )}
                </Stack>
              </>
            )}
            {/* ---- actions live in-flow, not fixed, so they never cover content ---- */}
            <Stack
              direction={{ xs: "column-reverse", sm: "row" }}
              spacing={1.5}
              sx={{ pt: 0, pb: { xs: 10, sm: 0 } }}
            >
              {/* <Button fullWidth onClick={onClose} color="inherit" sx={{ borderRadius: 2.5, py: 1.2 }} display={{ xs: "none", sm: "block" }}>
                Cancel
              </Button> */}

              <Button
                fullWidth
                type="submit"
                variant="contained"
                disabled={formik.isSubmitting || checkingSponsor || !sponsor}
                sx={{
                  borderRadius: 2.5,
                  fontWeight: 700,
                  py: 1.2,
                  background: "linear-gradient(135deg,#6366F1,#8B5CF6)",
                  boxShadow: "0 10px 25px rgba(99,102,241,.25)",
                  "&:hover": {
                    background: "linear-gradient(135deg,#4F46E5,#7C3AED)",
                  },
                }}
              >
                {formik.isSubmitting ? (
                  <CircularProgress size={22} color="inherit" />
                ) : (
                  "Add Member"
                )}
              </Button>
            </Stack>
          </Stack>
        </form>
      </DialogContent>
    </Dialog>
  );
}
