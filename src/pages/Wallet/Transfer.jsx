// Internal Transfer (Extended – Safe Version)
import {
  AccountBalanceRounded,
  AccountBalanceWalletRounded,
  CheckRounded,
  PeopleAlt,
} from "@mui/icons-material";
import CheckCircleRounded from "@mui/icons-material/CheckCircleRounded";
import GroupsRounded from "@mui/icons-material/GroupsRounded";
import PersonRounded from "@mui/icons-material/PersonRounded";
import {
  Button,
  CircularProgress,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";

import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { getMethod, postMethod } from "../../api/login";
const PRIMARY = "#6366F1";
const SUCCESS = "#10B981";
const WARNING = "#F59E0B";
const INFO = "#0EA5E9";

const TEXT = "#0F172A";
const MUTED = "#64748B";
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

export default function Transfer({ balances = {}, onSuccess }) {
  const [step, setStep] = useState("FORM");

  const [recipient, setRecipient] = useState(null);
  const [checkingUser, setCheckingUser] = useState(false);

  /* ---------------- TRANSFER FORM (FORMIK) ---------------- */

  const transferForm = useFormik({
    initialValues: {
      transferTo: "SELF",
      mode: "DEFAULT", // NEW (for OTHERS only)
      transferType: "MAIN_TO_FUND",
      toUserId: "",
      amount: "",
    },
    validate: (values) => {
      // Yup's synchronous validate() can't easily see `recipient`/`availableUsd`
      // (both live outside formik state), so validation runs through the
      // schema below, and the OTHERS/recipient check is added on top here.
      const errors = {};

      if (values.transferTo === "OTHERS" && !recipient) {
        errors.toUserId = "Invalid recipient user";
      }

      return errors;
    },
    validationSchema: Yup.lazy((values) =>
      Yup.object({
        transferTo: Yup.string().oneOf(["SELF", "OTHERS"]).required(),
        transferType: Yup.string()
          .oneOf(["MAIN_TO_FUND", "MAIN_TO_MAIN", "FUND_TO_FUND"])
          .required(),
        toUserId: Yup.string().notRequired(),
        amount: Yup.number()
          .transform((val, orig) => (orig === "" ? undefined : val))
          .typeError("Enter a valid amount")
          .required("Enter a valid amount")
          .moreThan(0, "Enter a valid amount")
          .max(
            availableUsdFor(values.transferType, balances),
            `Insufficient balance. Available: $${availableUsdFor(
              values.transferType,
              balances,
            ).toFixed(2)}`,
          ),
      }),
    ),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const payload = {
          transferTo: values.transferTo,
          transferType: values.transferType,
          amount: values.amount.toString(),
          ...(values.transferTo === "OTHERS" && {
            toUserId: Number(values.toUserId),
          }),
        };

        const res = await postMethod(
          "/api/wallet/internal-transfer/validate",
          payload,
        );

        if (!res?.success) {
          toast.error(res.error?.message || "Validation failed");
          return;
        }

        toast.success("OTP sent");
        setStep("OTP");
      } catch (err) {
        toast.error(err.message || "Validation failed");
      } finally {
        setSubmitting(false);
      }
    },
  });

  const { values, setFieldValue, touched, errors } = transferForm;

  /* ---------------- OTP FORM (FORMIK) ---------------- */

  const otpForm = useFormik({
    initialValues: { otp: "" },
    validationSchema: Yup.object({
      otp: Yup.string()
        .matches(/^\d{4,6}$/, "Invalid OTP")
        .required("Invalid OTP"),
    }),
    onSubmit: async (otpValues, { setSubmitting, resetForm }) => {
      try {
        const res = await postMethod("/api/wallet/internal-transfer/initiate", {
          ...values,
          otp: otpValues.otp,
          amount: String(values.amount),
          ...(values.transferTo === "OTHERS" && {
            toUserId: Number(values.toUserId),
          }),
        });

        if (!res?.success) {
          toast.error(res?.error?.message || "Transfer failed");
          return;
        }

        toast.success("Transfer successful");

        transferForm.resetForm({
          values: {
            transferTo: "SELF",
            mode: "DEFAULT",
            transferType: "MAIN_TO_FUND",
            toUserId: "",
            amount: "",
          },
        });
        resetForm();
        setRecipient(null);
        setStep("FORM");

        onSuccess?.();
      } catch (err) {
        toast.error(err.message || "Transfer failed");
      } finally {
        setSubmitting(false);
      }
    },
  });

  /* ---------------- DERIVE TRANSFER TYPE ---------------- */

  useEffect(() => {
    if (values.transferTo === "SELF") {
      setFieldValue("transferType", "MAIN_TO_FUND");
      return;
    }

    // OTHERS
    setFieldValue(
      "transferType",
      values.mode === "MAIN" ? "MAIN_TO_MAIN" : "FUND_TO_FUND",
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.transferTo, values.mode]);

  /* ---------------- AVAILABLE BALANCE ---------------- */

  const availableUsd = useMemo(
    () => availableUsdFor(values.transferType, balances),
    [values.transferType, balances],
  );

  /* ---------------- AUTO FETCH RECIPIENT ---------------- */

  useEffect(() => {
    let timer;

    if (values.transferTo !== "OTHERS") {
      setRecipient(null);
    } else if (!values.toUserId || values.toUserId.length < 5) {
      setRecipient(null);
    } else {
      timer = setTimeout(async () => {
        try {
          setCheckingUser(true);
          const res = await getMethod(
            `/api/user/lookup-by-superid/${values.toUserId}`,
          );
          setRecipient(res?.success ? res.data : null);
        } catch {
          setRecipient(null);
        } finally {
          setCheckingUser(false);
        }
      }, 400);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.toUserId, values.transferTo]);

  /* ================= UI ================= */

  return (
    <Stack spacing={3}>
      {step === "FORM" && (
        <form onSubmit={transferForm.handleSubmit} noValidate>
          <Stack spacing={3}>
            <FormControl fullWidth>
              <FormLabel
                sx={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: TEXT,
                  mb: 1.2,
                }}
              >
                Transfer To
              </FormLabel>

              <Box
                sx={{
                  display: "flex",
                  width: "100%",
                  gap: 1.5,
                  flexDirection: { xs: "column", sm: "row" },
                }}
              >
                {/* SELF */}
                <Box
                  onClick={() => {
                    setFieldValue("transferTo", "SELF");
                    setFieldValue("mode", "DEFAULT");
                    setFieldValue("toUserId", "");
                    setRecipient(null);
                  }}
                  sx={{
                    flex: 1,
                    minWidth: 0,
                    display: "flex",
                    alignItems: "center",
                    gap: 1.2,
                    px: 1.5,
                    py: 1.25,
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor:
                      values.transferTo === "SELF" ? PRIMARY : "#E2E8F0",
                    background:
                      values.transferTo === "SELF"
                        ? "rgba(99, 102, 241, 0.06)"
                        : "#FFFFFF",
                    boxShadow:
                      values.transferTo === "SELF"
                        ? "0 4px 12px rgba(99, 102, 241, 0.10)"
                        : "none",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      borderColor: PRIMARY,
                      background: "rgba(99, 102, 241, 0.04)",
                    },
                  }}
                >
                  {/* Icon */}
                  <Box
                    sx={{
                      width: 38,
                      height: 38,
                      minWidth: 38,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background:
                        values.transferTo === "SELF" ? PRIMARY : "#F1F5F9",
                      color: values.transferTo === "SELF" ? "#FFFFFF" : MUTED,
                    }}
                  >
                    <PersonRounded sx={{ fontSize: 20 }} />
                  </Box>

                  {/* Text */}
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      sx={{
                        fontSize: 13.5,
                        fontWeight: 700,
                        color: TEXT,
                        lineHeight: 1.3,
                      }}
                    >
                      Self
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: 11,
                        color: MUTED,
                        mt: 0.3,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      Transfer to your own account
                    </Typography>
                  </Box>

                  {/* Selected */}
                  {values.transferTo === "SELF" && (
                    <CheckCircleRounded
                      sx={{
                        ml: "auto",
                        flexShrink: 0,
                        fontSize: 19,
                        color: PRIMARY,
                      }}
                    />
                  )}
                </Box>

                {/* OTHER USER */}
                <Box
                  onClick={() => {
                    setFieldValue("transferTo", "OTHERS");
                    setFieldValue("mode", "DEFAULT");
                    setFieldValue("toUserId", "");
                    setRecipient(null);
                  }}
                  sx={{
                    flex: 1,
                    minWidth: 0,
                    display: "flex",
                    alignItems: "center",
                    gap: 1.2,
                    px: 1.5,
                    py: 1.25,
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor:
                      values.transferTo === "OTHERS" ? PRIMARY : "#E2E8F0",
                    background:
                      values.transferTo === "OTHERS"
                        ? "rgba(99, 102, 241, 0.06)"
                        : "#FFFFFF",
                    boxShadow:
                      values.transferTo === "OTHERS"
                        ? "0 4px 12px rgba(99, 102, 241, 0.10)"
                        : "none",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      borderColor: PRIMARY,
                      background: "rgba(99, 102, 241, 0.04)",
                    },
                  }}
                >
                  {/* Icon */}
                  <Box
                    sx={{
                      width: 38,
                      height: 38,
                      minWidth: 38,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background:
                        values.transferTo === "OTHERS" ? PRIMARY : "#F1F5F9",
                      color: values.transferTo === "OTHERS" ? "#FFFFFF" : MUTED,
                    }}
                  >
                    <GroupsRounded sx={{ fontSize: 20 }} />
                  </Box>

                  {/* Text */}
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      sx={{
                        fontSize: 13.5,
                        fontWeight: 700,
                        color: TEXT,
                        lineHeight: 1.3,
                      }}
                    >
                      Other User
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: 11,
                        color: MUTED,
                        mt: 0.3,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      Transfer to another member
                    </Typography>
                  </Box>

                  {/* Selected */}
                  {values.transferTo === "OTHERS" && (
                    <CheckCircleRounded
                      sx={{
                        ml: "auto",
                        flexShrink: 0,
                        fontSize: 19,
                        color: PRIMARY,
                      }}
                    />
                  )}
                </Box>
              </Box>
            </FormControl>

            {values.transferTo === "OTHERS" && (
              <FormControl fullWidth sx={{ mt: 1.5 }}>
                <FormLabel
                  sx={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: TEXT,
                    mb: 1,
                  }}
                >
                  Transfer Mode
                </FormLabel>

                <RadioGroup
                  name="mode"
                  value={values.mode}
                  onChange={(e) => setFieldValue("mode", e.target.value)}
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      sm: "repeat(2, 1fr)",
                    },
                    gap: 1.25,
                  }}
                >
                  {[
                    {
                      value: "DEFAULT",
                      title: "Super to Super",
                      description: "Transfer from Super wallet",
                      color: PRIMARY,
                      bg: "rgba(99, 102, 241, 0.06)",
                      icon: AccountBalanceWalletRounded,
                    },
                    {
                      value: "MAIN",
                      title: "Available to Available",
                      description: "Transfer from Available wallet",
                      color: PRIMARY,
                      bg: "rgba(16, 185, 129, 0.06)",
                      icon: AccountBalanceRounded,
                    },
                  ].map((option) => {
                    const Icon = option.icon;
                    const selected = values.mode === option.value;

                    return (
                      <Box
                        key={option.value}
                        onClick={() => setFieldValue("mode", option.value)}
                        sx={{
                          position: "relative",
                          cursor: "pointer",
                          p: 1.5,
                          borderRadius: 2.5,
                          border: "1px solid",
                          borderColor: "#E2E8F0",
                          backgroundColor: "#FFFFFF",
                          transition: "all 0.2s ease",

                          "&:hover": {
                            borderColor: option.color,
                            transform: "translateY(-1px)",
                            boxShadow: "0 4px 12px rgba(15, 23, 42, 0.06)",
                          },
                        }}
                      >
                        {/* Selected check */}
                        {selected && (
                          <Box
                            sx={{
                              position: "absolute",
                              top: 20,
                              right: 10,
                              width: 18,
                              height: 18,
                              borderRadius: "50%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              backgroundColor: option.color,
                              color: "#fff",
                            }}
                          >
                            <CheckRounded sx={{ fontSize: 13 }} />
                          </Box>
                        )}

                        <Stack
                          direction="row"
                          spacing={1.25}
                          alignItems="center"
                        >
                          {/* Icon */}
                          <Box
                            sx={{
                              width: 38,
                              height: 38,
                              flexShrink: 0,
                              borderRadius: 2,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              backgroundColor: selected
                                ? option.color
                                : "#F1F5F9",
                              color: selected ? "#fff" : MUTED,
                              transition: "all 0.2s ease",
                            }}
                          >
                            <Icon sx={{ fontSize: 20 }} />
                          </Box>

                          {/* Radio + text */}
                          <FormControlLabel
                            value={option.value}
                            control={
                              <Radio
                                size="small"
                                sx={{
                                  display: "none",
                                }}
                              />
                            }
                            label={
                              <Box>
                                <Typography
                                  sx={{
                                    fontSize: 13.5,
                                    fontWeight: 700,
                                    color: TEXT,
                                    lineHeight: 1.3,
                                  }}
                                >
                                  {option.title}
                                </Typography>

                                <Typography
                                  sx={{
                                    fontSize: 11.5,
                                    color: MUTED,
                                    mt: 0.35,
                                    lineHeight: 1.3,
                                  }}
                                >
                                  {option.description}
                                </Typography>
                              </Box>
                            }
                            sx={{
                              m: 0,
                              flex: 1,
                              minWidth: 0,
                            }}
                          />
                        </Stack>
                      </Box>
                    );
                  })}
                </RadioGroup>
              </FormControl>
            )}

            {values.transferTo === "SELF" && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  px: 1.5,
                  py: 2,
                  borderRadius: 2,
                  background: "linear-gradient(135deg, #EEF2FF, #F8FAFC)",
                  border: "1px solid #E0E7FF",
                }}
              >
                <Typography
                  sx={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#64748B",
                  }}
                >
                  Transfer Type
                </Typography>

                <Box
                  sx={{
                    px: 1.5,
                    py: 0.6,
                    borderRadius: 1.5,
                    backgroundColor: "#6366F1",
                    color: "#fff",
                    fontSize: 13,
                    fontWeight: 700,
                  }}
                >
                  AVAILABLE_TO_SUPER
                  {/* {values.transferType} */}
                </Box>
              </Box>
            )}

            {values.transferTo === "OTHERS" && (
              <Stack spacing={0.5}>
                <TextField
                  sx={fieldSx}
                  label="Recipient User ID"
                  name="toUserId"
                  value={values.toUserId}
                  onChange={(e) =>
                    setFieldValue("toUserId", e.target.value.replace(/\D/g, ""))
                  }
                  onBlur={transferForm.handleBlur}
                  error={touched.toUserId && !!errors.toUserId}
                  helperText={touched.toUserId && errors.toUserId}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <PeopleAlt sx={{ fontSize: 20 }} />
                          <Typography sx={{ ml: 0.2, color: "text.primary" }}>
                            SN
                          </Typography>
                        </InputAdornment>
                      ),
                    },
                  }}
                  fullWidth
                />

                {checkingUser && (
                  <Typography variant="caption">Checking user…</Typography>
                )}

                {recipient && (
                  <Typography variant="caption" sx={{ color: "success.main" }}>
                    User found: <b>{recipient.username || recipient.phoneNo}</b>
                  </Typography>
                )}
              </Stack>
            )}

            <Stack spacing={0.5}>
              <TextField
                sx={fieldSx}
                label="Amount (USD)"
                type="number"
                name="amount"
                value={values.amount}
                onChange={transferForm.handleChange}
                onBlur={transferForm.handleBlur}
                error={touched.amount && !!errors.amount}
                helperText={touched.amount && errors.amount}
                fullWidth
              />

              <Typography variant="caption">
                Available balance: ${availableUsd.toFixed(2)}
              </Typography>
            </Stack>

            <Button
              sx={{ backgroundColor: PRIMARY }}
              type="submit"
              variant="contained"
              disabled={
                transferForm.isSubmitting ||
                availableUsd <= 0 ||
                (values.transferTo === "OTHERS" && !recipient)
              }
              fullWidth
            >
              {transferForm.isSubmitting ? (
                <CircularProgress size={18} />
              ) : (
                "Continue"
              )}
            </Button>
          </Stack>
        </form>
      )}

      {step === "OTP" && (
        <form onSubmit={otpForm.handleSubmit} noValidate>
          <Stack spacing={2}>
            <Typography variant="h6" align="center">
              Confirm Internal Transfer
            </Typography>

            <Typography variant="body2" color="text.secondary" align="center">
              Enter the OTP sent to your registered email
            </Typography>

            <TextField
              sx={fieldSx}
              label="One-Time Password"
              name="otp"
              value={otpForm.values.otp}
              onChange={(e) =>
                otpForm.setFieldValue(
                  "otp",
                  e.target.value.replace(/\D/g, "").slice(0, 6),
                )
              }
              onBlur={otpForm.handleBlur}
              error={otpForm.touched.otp && !!otpForm.errors.otp}
              helperText={otpForm.touched.otp && otpForm.errors.otp}
              fullWidth
              inputProps={{
                inputMode: "numeric",
                pattern: "[0-9]*",
                maxLength: 6,
                style: {
                  textAlign: "center",
                  fontSize: "1.25rem",
                  letterSpacing: "0.3em",
                },
              }}
            />

            <Button
              sx={{ backgroundColor: PRIMARY }}
              type="submit"
              variant="contained"
              disabled={otpForm.isSubmitting || otpForm.values.otp.length < 4}
              fullWidth
              size="large"
            >
              {otpForm.isSubmitting ? (
                <CircularProgress size={20} />
              ) : (
                "Confirm Transfer"
              )}
            </Button>

            <Typography variant="caption" align="center" color="text.secondary">
              OTP is time-sensitive. Please confirm promptly.
            </Typography>
          </Stack>
        </form>
      )}
    </Stack>
  );
}

/* ---------------- SHARED HELPER ---------------- */

function availableUsdFor(transferType, balances) {
  if (transferType === "MAIN_TO_FUND") return Number(balances?.main?.usd || 0);
  if (transferType === "MAIN_TO_MAIN") return Number(balances?.main?.usd || 0);
  if (transferType === "FUND_TO_FUND") return Number(balances?.fund?.usd || 0);
  return 0;
}
