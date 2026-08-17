import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

import {
  AccountCircle,
  ArrowBack,
  CameraAlt,
  Close,
  ContentCopy,
  Lock,
} from "@mui/icons-material";

import { Form, Formik } from "formik";

import { useEffect, useRef, useState } from "react";

import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";

import * as Yup from "yup";

import { ethers } from "ethers";

import { getMethod, putFormData } from "../../api/login";

/* =========================
   Validation Schema
========================= */

const ProfileSchema = Yup.object({
  username: Yup.string()
    .min(3, "Username must be at least 3 characters")
    .nullable(),

  phoneNo: Yup.string()
    .matches(/^[0-9]{10}$/, "Valid phone number required")
    .nullable(),

  withdrawAddress: Yup.string()
    .nullable()
    .test("wallet-address", "Invalid BEP20 / ERC20 address", (value) => {
      if (!value) return true;
      return ethers.isAddress(value);
    }),
});

/* =========================
   Shared field styling — keeps every TextField
   visually consistent and comfortably tappable
   on small screens (48px+ touch target).
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

const readOnlyFieldSx = {
  ...fieldSx,
  "& .MuiOutlinedInput-root": {
    ...fieldSx["& .MuiOutlinedInput-root"],
    backgroundColor: "#F1F5F9",
  },
};

const PersonalDetailsContent = () => {
  const navigate = useNavigate();

  const formikRef = useRef(null);
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState(null);
  const [removeProfilePic, setRemoveProfilePic] = useState(false);

  const [withdrawMeta, setWithdrawMeta] = useState({
    withdrawEnabled: false,
    withdrawCooldown: null,
  });

  const initialValues = {
    username: "",
    email: "",
    superId: "",
    phoneNo: "",
    withdrawAddress: "",
  };

  const [profileData, setProfileData] = useState(initialValues);

  /* =========================
        Fetch Profile
    ========================= */

  const fetchUserProfile = async () => {
    try {
      const result = await getMethod("/api/user/profile");
      const profile = result.data;
      const data = {
        username: profile.username || "",
        email: profile.email || "",
        superId: profile.superId || "",
        phoneNo: profile.phoneNo || "",
        withdrawAddress: profile.withdrawAddress || "",
      };
      const superProfilePic = profile?.profilePicUrl
        ? `${process.env.REACT_APP_BASE_URL}${profile.profilePicUrl}`
        : null;
      setProfileData(data);
      setPreview(superProfilePic || null);

      setWithdrawMeta({
        withdrawEnabled: profile.withdrawEnabled || false,
        withdrawCooldown: profile.withdrawCooldown || null,
      });
    } catch (error) {
      toast.error("Failed to load profile");
    }
  };

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      await fetchUserProfile();
      setLoading(false);
    };

    loadProfile();
  }, []);

  const isCooldownActive =
    withdrawMeta.withdrawEnabled &&
    withdrawMeta.withdrawCooldown &&
    new Date(withdrawMeta.withdrawCooldown).getTime() > Date.now();

  const handleCopySuperId = (superId) => {
    if (!superId) return;

    navigator.clipboard?.writeText(superId);
    toast.info("User ID copied");
  };

  const handleBack = () => {
    navigate(-1);
  };

  /* =========================
        Header — reused for loading + loaded states so the
        back button is always available, even mid-fetch.
    ========================= */
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
        top: {
          xs: 0,
        },
        left: {
          xs: 0,
        },
        right: {
          xs: 0,
        },
        zIndex: {
          xs: 1200,
        },
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
            flexShrink: 0,
            "&:hover": {
              bgcolor: "#E2E8F0",
            },
          }}
        >
          <ArrowBack
            sx={{
              fontSize: 22,
            }}
          />
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
            letterSpacing: -0.3,
            fontWeight: 600,
          }}
        >
          Personal Details
        </Typography>

        <Typography
          color="text.secondary"
          sx={{
            mt: 0.2,
            fontSize: {
              xs: 12.5,
              sm: 13,
              md: 14.5,
            },
          }}
        >
          Update your personal information.
        </Typography>
      </Box>
    </Stack>
  );

  if (loading) {
    return (
      <>
        <HeaderBar />

        <Divider
          sx={{
            display: {
              xs: "none",
              sm: "block",
            },
            mb: { sm: 1, md: 1 },
            mt: { sm: 1.5, md: 1.5 },
          }}
        />

        <Box
          sx={{
            minHeight: { xs: 260, md: 320 },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
          }}
        >
          <CircularProgress size={44} thickness={4} sx={{ color: "#6366F1" }} />

          <Typography
            color="text.secondary"
            fontWeight={600}
            fontSize={{ xs: 13.5, md: 14 }}
          >
            Loading profile...
          </Typography>
        </Box>
      </>
    );
  }

  return (
    <Formik
      innerRef={formikRef}
      initialValues={profileData}
      enableReinitialize
      validationSchema={ProfileSchema}
      onSubmit={async (values) => {
        try {
          setSubmitting(true);

          const fd = new FormData();

          if (values.username) fd.append("username", values.username);

          if (values.phoneNo) fd.append("phoneNo", values.phoneNo);

          if (values.withdrawAddress)
            fd.append("withdrawAddress", values.withdrawAddress);

          if (profilePic) fd.append("profilePic", profilePic);

          if (removeProfilePic) fd.append("removeProfilePic", "true");

          if (
            !values.username &&
            !values.phoneNo &&
            !values.withdrawAddress &&
            !profilePic &&
            !removeProfilePic
          ) {
            toast.info("No changes to update");
            return;
          }

          const result = await putFormData("/api/user/update-profile", fd);

          if (result?.error) {
            toast.error(result.error?.message || "Failed update profile");
            return;
          }

          toast.success("Profile updated");
          setProfilePic(null);
          setRemoveProfilePic(false);

          await fetchUserProfile();
        } catch (error) {
          toast.error(error.message || "Profile update failed");
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ values, errors, touched, handleChange, handleBlur, dirty }) => {
        const hasPendingImageChange = Boolean(profilePic) || removeProfilePic;
        const canSubmit = dirty || hasPendingImageChange;

        return (
          <Form>
            {/* HEADER */}
            <HeaderBar />

            <Divider
              sx={{
                mb: { xs: 1.4, md: 1.5 },
                mt: { xs: 1.4, md: 1.5 },
                display: {
                  xs: "none",
                  sm: "block",
                },
              }}
            />

            {/* PROFILE IMAGE */}
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={{ xs: 2.5, sm: 3 }}
              alignItems="center"
              sx={{
                mt: { xs: 2, sm: 0 },
                mb: { xs: 4, md: 5 },
                p: { xs: 2, sm: 2.5 },
                borderRadius: 3,
                bgcolor: "#F8FAFC",
                border: "1px solid #EEF2F7",
              }}
            >
              {/* Avatar Section */}
              <Box
                sx={{
                  position: "relative",
                  flexShrink: 0,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Avatar
                  src={preview}
                  sx={{
                    width: { xs: 96, sm: 96, md: 108 },
                    height: { xs: 96, sm: 96, md: 108 },
                    border: "3px solid #fff",
                    boxShadow: "0 8px 24px rgba(15,23,42,.12)",
                    bgcolor: "#E2E8F0",
                  }}
                >
                  {!preview && (
                    <AccountCircle
                      sx={{
                        fontSize: {
                          xs: 58,
                          sm: 60,
                        },
                        color: "#94A3B8",
                      }}
                    />
                  )}
                </Avatar>

                <input
                  ref={fileInputRef}
                  hidden
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];

                    if (!file) return;

                    setProfilePic(file);
                    setRemoveProfilePic(false);
                    setPreview(URL.createObjectURL(file));
                  }}
                />
              </Box>

              {/* Content Section */}
              <Box
                sx={{
                  width: "100%",
                  textAlign: {
                    xs: "center",
                    sm: "left",
                  },
                }}
              >
                <Typography
                  fontWeight={700}
                  fontSize={{
                    xs: 15,
                    md: 16,
                  }}
                >
                  Profile Photo
                </Typography>

                <Typography
                  color="text.secondary"
                  sx={{
                    mt: 0.5,
                    mb: 2,
                    fontSize: {
                      xs: 12,
                      md: 12.5,
                    },
                  }}
                >
                  JPG or PNG, square images look best.
                </Typography>

                <Stack
                  direction="row"
                  spacing={1.5}
                  justifyContent={{
                    xs: "center",
                    sm: "flex-start",
                  }}
                  flexWrap="wrap"
                  useFlexGap
                >
                  <Button
                    variant="outlined"
                    component="label"
                    size="small"
                    startIcon={<CameraAlt sx={{ fontSize: 16 }} />}
                    sx={{
                      borderRadius: 2.5,
                      textTransform: "none",
                      fontWeight: 700,
                      px: 2.5,
                      bgcolor: "#fff",
                      borderColor: "#E2E8F0",
                      "&:hover": {
                        bgcolor: "#fff",
                        borderColor: "#CBD5E1",
                      },
                    }}
                  >
                    Upload Photo
                    <input
                      hidden
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];

                        if (!file) return;

                        setProfilePic(file);
                        setRemoveProfilePic(false);
                        setPreview(URL.createObjectURL(file));
                      }}
                    />
                  </Button>

                  {preview && (
                    <Button
                      size="small"
                      color="error"
                      startIcon={<Close sx={{ fontSize: 16 }} />}
                      onClick={() => {
                        setProfilePic(null);
                        setPreview(null);
                        setRemoveProfilePic(true);
                      }}
                      sx={{
                        borderRadius: 2.5,
                        textTransform: "none",
                        fontWeight: 700,
                        px: 2,
                      }}
                    >
                      Remove
                    </Button>
                  )}
                </Stack>
              </Box>
            </Stack>

            {/* FIELD GRID — single column on mobile, two columns from tablet up */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                columnGap: 2.5,
                rowGap: { xs: 2.5, sm: 3 },
              }}
            >
              {/* EMAIL */}
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                value={values.email}
                disabled
                slotProps={{ input: { readOnly: true } }}
                sx={readOnlyFieldSx}
              />

              {/* SUPER ID */}
              <TextField
                fullWidth
                label="User ID"
                name="superId"
                value={`SN${values.superId}`}
                disabled
                slotProps={{
                  input: {
                    readOnly: true,
                    endAdornment: (
                      <Tooltip title="Copy User ID">
                        <IconButton
                          size="small"
                          onClick={() => handleCopySuperId(values.superId)}
                          edge="end"
                        >
                          <ContentCopy sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Tooltip>
                    ),
                  },
                }}
                sx={readOnlyFieldSx}
              />

              {/* USERNAME */}
              <TextField
                fullWidth
                label="Username"
                name="username"
                value={values.username}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.username && Boolean(errors.username)}
                helperText={touched.username && errors.username}
                sx={fieldSx}
              />

              {/* PHONE */}
              <TextField
                fullWidth
                label="Phone Number"
                name="phoneNo"
                value={values.phoneNo}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.phoneNo && Boolean(errors.phoneNo)}
                helperText={touched.phoneNo && errors.phoneNo}
                sx={fieldSx}
              />

              {/* WALLET — spans full width, it's the most important / longest field */}
              <Box sx={{ gridColumn: { xs: "1", sm: "1 / -1" } }}>
                <TextField
                  fullWidth
                  label="Withdrawal Address (BEP20)"
                  name="withdrawAddress"
                  value={values.withdrawAddress}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isCooldownActive}
                  error={
                    touched.withdrawAddress && Boolean(errors.withdrawAddress)
                  }
                  helperText={
                    (touched.withdrawAddress && errors.withdrawAddress) ||
                    "Only BEP20 (BSC) wallet addresses are supported"
                  }
                  slotProps={{
                    input: {
                      endAdornment: isCooldownActive ? (
                        <Lock sx={{ fontSize: 18, color: "warning.main" }} />
                      ) : undefined,
                    },
                  }}
                  sx={fieldSx}
                />

                {isCooldownActive && (
                  <Typography
                    variant="caption"
                    color="warning.main"
                    sx={{ display: "block", mt: 1 }}
                  >
                    Withdrawals locked until{" "}
                    {new Date(
                      withdrawMeta.withdrawCooldown,
                    ).toLocaleTimeString()}
                  </Typography>
                )}
              </Box>
            </Box>

            {/* SAVE BUTTON */}
            <Button
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              disabled={submitting || !canSubmit}
              sx={{
                mt: { xs: 4, md: 5 },
                mb: { xs: 4, md: 0 },
                borderRadius: 2.5,
                py: 1.5,
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
            >
              {submitting ? (
                <CircularProgress size={22} color="inherit" />
              ) : (
                "Save Profile"
              )}
            </Button>
          </Form>
        );
      }}
    </Formik>
  );
};

export default PersonalDetailsContent;
