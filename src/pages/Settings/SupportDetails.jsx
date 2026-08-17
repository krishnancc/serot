import {
  Box,
  Divider,
  IconButton,
  Stack,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import { ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";

import CloseRounded from "@mui/icons-material/CloseRounded";
import ConfirmationNumberOutlined from "@mui/icons-material/ConfirmationNumberOutlined";
import UploadFileRounded from "@mui/icons-material/UploadFileRounded";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";

import { getMethod, postFormData } from "../../api/login";

const PRIMARY = "#6366F1";
const PRIMARY_DARK = "#4F46E5";
const PRIMARY_LIGHT = "#8B5CF6";
const SURFACE = "#F8FAFC";
const BORDER = "#E2E8F0";
const TEXT_MUTED = "#64748B";

const STATUS_TOKENS = {
  OPEN: { label: "Open", color: "#B4791F", bg: "#FEF3E2" },
  IN_PROGRESS: { label: "In progress", color: "#2E5C8A", bg: "#E8F1FB" },
  CLOSED: { label: "Closed", color: "#3F6B47", bg: "#E9F5EB" },
  UNKNOWN: { label: "Unknown", color: "#8A8A8A", bg: "#F1F1F1" },
};

const CATEGORY_TOKENS = {
  TECHNICAL: { code: "TEC", label: "Technical" },
  BILLING: { code: "BIL", label: "Billing" },
  ACCOUNT: { code: "ACC", label: "Account" },
  FEATURE_REQUEST: { code: "FEA", label: "Feature request" },
  OTHER: { code: "OTH", label: "Other" },
};

const eyebrowSx = {
  fontSize: "0.72rem",
  fontWeight: 700,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: TEXT_MUTED,
};

/* =========================
   Shared TextField styling — now actually applied everywhere
========================= */

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 2.5,
    backgroundColor: SURFACE,
    transition: "background-color 120ms ease, box-shadow 120ms ease",

    "& fieldset": {
      borderColor: BORDER,
    },

    "&:hover fieldset": {
      borderColor: "#CBD5E1",
    },

    "&.Mui-focused": {
      backgroundColor: "#fff",
    },

    "&.Mui-focused fieldset": {
      borderColor: PRIMARY,
      borderWidth: 2,
    },
  },

  "& .MuiInputBase-input.Mui-disabled": {
    WebkitTextFillColor: "#94A3B8",
  },

  "& .MuiInputLabel-root": {
    fontWeight: 400,
  },
};

const primaryButtonSx = {
  borderRadius: 2.5,
  textTransform: "none",
  fontWeight: 700,
  boxShadow: "none",
  background: `linear-gradient(90deg,${PRIMARY},${PRIMARY_LIGHT})`,
  "&:hover": {
    background: `linear-gradient(90deg,${PRIMARY_DARK},#7C3AED)`,
    boxShadow: "0 12px 28px rgba(99,102,241,.30)",
  },
  "&.Mui-disabled": {
    background: "#E2E8F0",
    color: "#94A3B8",
  },
};

function LedgerSwitch({ value, onChange, ticketCount }) {
  const items = [
    { key: 0, label: "New Ticket" },
    { key: 1, label: `My Tickets (${ticketCount})` },
  ];

  return (
    <Box
      role="tablist"
      sx={{
        display: "inline-flex",
        p: 0.5,
        borderRadius: 3,
        bgcolor: SURFACE,
        border: `1px solid ${BORDER}`,
        mb: { xs: 3, md: 4 },
        width: { xs: "100%", sm: "auto" },
      }}
    >
      {items.map((item) => {
        const active = value === item.key;
        return (
          <Box
            key={item.key}
            role="tab"
            aria-selected={active}
            tabIndex={0}
            onClick={() => onChange(item.key)}
            onKeyDown={(e) =>
              (e.key === "Enter" || e.key === " ") && onChange(item.key)
            }
            sx={{
              cursor: "pointer",
              flex: { xs: 1, sm: "initial" },
              textAlign: "center",
              px: { xs: 1.5, sm: 2.5 },
              py: 1,
              borderRadius: 2.2,
              userSelect: "none",
              bgcolor: active ? "#fff" : "transparent",
              boxShadow: active ? "0 4px 12px rgba(15,23,42,.08)" : "none",
              transition: "all .15s ease",
              "&:focus-visible": {
                outline: `2px solid ${PRIMARY}`,
                outlineOffset: 2,
              },
            }}
          >
            <Typography
              sx={{
                fontSize: { xs: 13, sm: 13.5 },
                fontWeight: 700,
                color: active ? PRIMARY : TEXT_MUTED,
                whiteSpace: "nowrap",
              }}
            >
              {item.label}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
}

function CategoryPicker({ value, onChange, error }) {
  return (
    <Box>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
        {Object.entries(CATEGORY_TOKENS).map(([key, token]) => {
          const active = value === key;
          return (
            <Box
              key={key}
              role="button"
              tabIndex={0}
              aria-pressed={active}
              onClick={() => onChange(key)}
              onKeyDown={(e) =>
                (e.key === "Enter" || e.key === " ") && onChange(key)
              }
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.75,
                px: { xs: 1.2, sm: 1.5 },
                py: 0.9,
                cursor: "pointer",
                userSelect: "none",
                borderRadius: 2.5,
                border: `1px solid ${active ? PRIMARY : BORDER}`,
                bgcolor: active ? "#EEF2FF" : SURFACE,
                transition: "all .15s ease",
                "&:hover": { borderColor: PRIMARY },
                "&:focus-visible": {
                  outline: `2px solid ${PRIMARY}`,
                  outlineOffset: 2,
                },
              }}
            >
              <Typography
                sx={{
                  fontSize: "0.68rem",
                  fontWeight: 800,
                  letterSpacing: "0.05em",
                  color: active ? PRIMARY : TEXT_MUTED,
                }}
              >
                {token.code}
              </Typography>
              <Typography
                sx={{
                  fontSize: { xs: "0.8rem", sm: "0.82rem" },
                  fontWeight: 600,
                  color: active ? PRIMARY_DARK : "text.primary",
                }}
              >
                {token.label}
              </Typography>
            </Box>
          );
        })}
      </Box>

      {error && (
        <Typography sx={{ ...eyebrowSx, color: "error.main", mt: 0.75 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
}

/* ================= VALIDATION (Yup) =================
   NOTE: `category` was previously required here, but the
   <CategoryPicker /> that sets it is commented out below —
   so `category` could never be filled in and validation
   silently failed on every submit. Removed until the picker
   is re-enabled (see CategoryPicker usage further down). */

const TicketSchema = Yup.object({
  subject: Yup.string().min(5, "Subject required").required("Subject required"),
  description: Yup.string()
    .min(10, "Message required")
    .required("Message required"),
});

const ReplySchema = Yup.object({
  description: Yup.string()
    .min(2, "Reply message required")
    .required("Reply message required"),
});

// Height reserved above the content on mobile so it doesn't sit
// underneath the fixed HeaderBar.
const MOBILE_HEADER_OFFSET = 76;

const SupportDetails = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const fullScreenDialog = useMediaQuery(theme.breakpoints.down("sm"));

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
            bgcolor: SURFACE,
            color: "#334155",

            "&:hover": {
              bgcolor: BORDER,
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
            fontWeight: 800,
            letterSpacing: -0.3,
          }}
        >
          Support
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
          Get help with your account, queries, and technical issues.
        </Typography>
      </Box>
    </Stack>
  );

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [tab, setTab] = useState(0);
  const [tickets, setTickets] = useState([]);

  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);

  const [loadingDetails, setLoadingDetails] = useState(false);
  const [openReplyModal, setOpenReplyModal] = useState(false);
  const [activeTicketId, setActiveTicketId] = useState(null);
  const [ticketDetails, setTicketDetails] = useState(null);

  const [replyImages, setReplyImages] = useState([]);
  const [replyPreviews, setReplyPreviews] = useState([]);

  /* ================= FORMIK: CREATE TICKET ================= */

  const ticketForm = useFormik({
    initialValues: {
      subject: "",
      description: "",
      category: "",
    },
    validationSchema: TicketSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        setSubmitting(true);

        const formData = new FormData();
        formData.append("subject", values.subject);
        formData.append("description", values.description);
        // `category` is currently not collected in the UI (picker is
        // commented out). Send a safe default so the backend still
        // gets a value; swap this out if/when the picker is re-enabled.
        formData.append("category", values.category || "OTHER");
        images.forEach((img) => formData.append("images", img));

        const result = await postFormData("/api/tickets", formData);

        if (result?.error) {
          toast.error(result.error?.message || "Failed submit ticket");
          return;
        }

        toast.success("Ticket created successfully");
        resetForm({ values: { subject: "", description: "", category: "" } });
        setImages([]);
        setTab(1);
        fetchTickets();
      } catch (e) {
        toast.error(e?.message || "Ticket creation failed");
      } finally {
        setSubmitting(false);
      }
    },
  });

  /* ================= FORMIK: REPLY ================= */

  const replyForm = useFormik({
    initialValues: { description: "" },
    validationSchema: ReplySchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        setSubmitting(true);

        const formData = new FormData();
        formData.append("message", values.description);
        replyImages.forEach((img) => formData.append("images", img));

        await postFormData(`/api/tickets/${activeTicketId}/reply`, formData);

        toast.success("Reply sent");

        resetForm();
        setReplyImages([]);

        fetchTicketDetails(activeTicketId);
      } catch {
        toast.error("Failed to send reply");
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleCloseReplyModal = () => {
    setOpenReplyModal(false);
    replyForm.resetForm();
    setReplyImages([]);
  };

  /* ================= TICKET DETAILS ================= */

  const fetchTicketDetails = async (id) => {
    try {
      setLoadingDetails(true);
      const result = await getMethod(`/api/tickets/${id}`);

      if (result?.error) {
        toast.error(result.error?.message || "Failed fetch ticket details");
        return;
      }

      setTicketDetails(result.data);
      setActiveTicketId(id);
      setOpenReplyModal(true);
    } catch {
      toast.error("Failed to load ticket details");
    } finally {
      setLoadingDetails(false);
    }
  };

  /* ================= FETCH TICKETS ================= */

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const result = await getMethod("/api/tickets");

      if (result?.error) {
        toast.error(result.error?.message || "Failed fetch tickets");
        return;
      }

      setTickets(result.data || []);
    } catch {
      toast.error("Failed to load tickets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  useEffect(() => {
    const urls = images.map((file) => URL.createObjectURL(file));
    setPreviews(urls);
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [images]);

  useEffect(() => {
    const urls = replyImages.map((f) => URL.createObjectURL(f));
    setReplyPreviews(urls);
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [replyImages]);

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
            Loading Support...
          </Typography>
        </Box>
      </>
    );
  }

  return (
    <>
      <HeaderBar />

      {/* Spacer so content isn't hidden behind the fixed HeaderBar on mobile */}
      <Box
        sx={{
          display: { xs: "block", sm: "none" },
          height: MOBILE_HEADER_OFFSET,
        }}
      />

      <Divider
        sx={{
          mb: { xs: 2.5, md: 4 },
          mt: { xs: 0, md: 1.5 },
          display: { xs: "none", sm: "block" },
        }}
      />

      <LedgerSwitch
        value={tab}
        onChange={setTab}
        ticketCount={tickets.length}
      />

      {/* ================= NEW TICKET ================= */}
      {tab === 0 && (
        <Box component="form" onSubmit={ticketForm.handleSubmit}>
          <Typography sx={eyebrowSx}>Subject</Typography>
          <TextField
            fullWidth
            placeholder="One line describing the issue"
            name="subject"
            value={ticketForm.values.subject}
            onChange={ticketForm.handleChange}
            onBlur={ticketForm.handleBlur}
            error={!!(ticketForm.touched.subject && ticketForm.errors.subject)}
            helperText={ticketForm.touched.subject && ticketForm.errors.subject}
            sx={{ ...fieldSx, mb: 3, mt: 1 }}
          />

          {/* Category picker intentionally disabled — TicketSchema no
                    longer requires `category`, and a default of "OTHER" is
                    sent on submit. Re-enable both together if you want users
                    to choose a category again:

                    <Typography sx={eyebrowSx}>Category</Typography>
                    <Box sx={{ mt: 1, mb: 3 }}>
                        <CategoryPicker
                            value={ticketForm.values.category}
                            onChange={(key) => ticketForm.setFieldValue('category', key)}
                            error={ticketForm.touched.category && ticketForm.errors.category}
                        />
                    </Box> */}

          <Typography sx={eyebrowSx}>Details</Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="What happened, and what you expected instead"
            name="description"
            value={ticketForm.values.description}
            onChange={ticketForm.handleChange}
            onBlur={ticketForm.handleBlur}
            error={
              !!(
                ticketForm.touched.description && ticketForm.errors.description
              )
            }
            helperText={
              ticketForm.touched.description && ticketForm.errors.description
            }
            sx={{ ...fieldSx, mb: 3, mt: 1 }}
          />

          <Box sx={{ mb: 3 }}>
            <Typography sx={{ ...eyebrowSx, mb: 1 }}>
              Evidence (optional)
            </Typography>

            <Box
              component="label"
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: { xs: 76, sm: 84 },
                border: `1.5px dashed ${BORDER}`,
                borderRadius: 2.5,
                bgcolor: SURFACE,
                cursor: images.length >= 3 ? "not-allowed" : "pointer",
                opacity: images.length >= 3 ? 0.5 : 1,
                transition: "border-color 0.2s",
                "&:hover": { borderColor: PRIMARY },
              }}
            >
              <input
                hidden
                type="file"
                accept="image/*"
                multiple
                disabled={images.length >= 3}
                onChange={(e) => {
                  const files = Array.from(e.target.files);
                  setImages((prev) => [...prev, ...files].slice(0, 3));
                }}
              />

              <Box textAlign="center">
                <UploadFileRounded sx={{ fontSize: 22, color: PRIMARY }} />
                <Typography sx={{ ...eyebrowSx, mt: 0.5 }}>
                  Attach up to 3 files
                </Typography>
              </Box>
            </Box>

            {images.length > 0 && (
              <Box sx={{ display: "flex", gap: 1.5, mt: 2, flexWrap: "wrap" }}>
                {previews.map((src, index) => (
                  <Box
                    key={index}
                    sx={{
                      position: "relative",
                      width: { xs: 60, sm: 68 },
                      height: { xs: 60, sm: 68 },
                      borderRadius: 2,
                      border: `1px solid ${BORDER}`,
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={src}
                      alt=""
                      width="100%"
                      height="100%"
                      style={{ objectFit: "cover" }}
                    />

                    <Box
                      onClick={() =>
                        setImages((prev) => prev.filter((_, i) => i !== index))
                      }
                      sx={{
                        position: "absolute",
                        top: 2,
                        right: 2,
                        width: 18,
                        height: 18,
                        borderRadius: "50%",
                        bgcolor: "rgba(0,0,0,0.6)",
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                      }}
                    >
                      <CloseRounded sx={{ fontSize: 13 }} />
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
          </Box>

          <Button
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            disableElevation
            disabled={submitting}
            sx={{ ...primaryButtonSx, py: 1.5, fontSize: { xs: 14.5, md: 16 } }}
          >
            {submitting ? (
              <CircularProgress size={22} color="inherit" />
            ) : (
              "File Ticket"
            )}
          </Button>
        </Box>
      )}

      {/* ================= MY TICKETS ================= */}
      {tab === 1 && (
        <>
          {tickets.length === 0 ? (
            <Box
              sx={{
                minHeight: "calc(80vh - 180px)", // Adjust based on your header/navbar height
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              <ConfirmationNumberOutlined
                sx={{ fontSize: 48, color: TEXT_MUTED }}
              />
              <Typography sx={{ ...eyebrowSx, mt: 1 }}>
                No tickets yet
              </Typography>
            </Box>
          ) : (
            <Box>
              {/* column header — desktop/tablet only */}
              <Box
                sx={{
                  display: { xs: "none", sm: "grid" },
                  gridTemplateColumns: "90px 130px 1fr",
                  gap: 2,
                  pb: 1,
                  borderBottom: `1px solid ${BORDER}`,
                  mb: 1,
                }}
              >
                <Typography sx={eyebrowSx}>Case</Typography>
                <Typography sx={eyebrowSx}>Status</Typography>
                <Typography sx={eyebrowSx}>Subject</Typography>
              </Box>

              {tickets.map((t) => {
                const token = STATUS_TOKENS[t.status] || STATUS_TOKENS.UNKNOWN;

                const StatusPill = (
                  <Box
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 0.6,
                      px: 1,
                      py: 0.4,
                      borderRadius: 10,
                      bgcolor: token.bg,
                    }}
                  >
                    <Box
                      sx={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        bgcolor: token.color,
                      }}
                    />

                    <Typography
                      sx={{
                        fontSize: "0.68rem",
                        fontWeight: 700,
                        letterSpacing: "0.04em",
                        color: token.color,
                      }}
                    >
                      {token.label}
                    </Typography>
                  </Box>
                );

                return (
                  <Box
                    key={t.id}
                    onClick={() => fetchTicketDetails(t.id)}
                    sx={{
                      display: { xs: "block", sm: "grid" },
                      gridTemplateColumns: "90px 130px 1fr",
                      gap: 2,
                      py: 1.75,
                      px: { xs: 1.5, sm: 0 },
                      mb: { xs: 1.25, sm: 0 },
                      borderRadius: { xs: 2.5, sm: 0 },
                      border: {
                        xs: `1px solid ${BORDER}`,
                        sm: "none",
                      },
                      borderBottom: `1px solid ${BORDER}`,
                      bgcolor: {
                        xs: SURFACE,
                        sm: "transparent",
                      },
                      cursor: "pointer",
                      transition: "background-color 0.15s",
                      "&:hover": {
                        bgcolor: {
                          xs: "#EEF2FF",
                          sm: "action.hover",
                        },
                      },
                    }}
                  >
                    {/* Mobile */}
                    <Box
                      sx={{
                        display: { xs: "flex", sm: "none" },
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 0.75,
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          color: TEXT_MUTED,
                        }}
                      >
                        #{String(t.id).padStart(4, "0")}
                      </Typography>

                      {StatusPill}
                    </Box>

                    <Box sx={{ display: { xs: "none", sm: "block" } }}>
                      <Typography
                        sx={{
                          fontSize: "0.8rem",
                          fontWeight: 700,
                          color: TEXT_MUTED,
                        }}
                      >
                        #{String(t.id).padStart(4, "0")}
                      </Typography>
                    </Box>

                    <Box sx={{ display: { xs: "none", sm: "block" } }}>
                      {StatusPill}
                    </Box>

                    <Box>
                      <Typography
                        sx={{
                          fontWeight: 700,
                        }}
                      >
                        {t.subject}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          display: "-webkit-box",
                          WebkitLineClamp: {
                            xs: 2,
                            sm: 1,
                          },
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          fontSize: {
                            xs: 13,
                            sm: 14,
                          },
                        }}
                      >
                        {t.description || "No description provided"}
                      </Typography>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          )}
        </>
      )}

      {/* Reply Modal View */}
      <Dialog
        open={openReplyModal}
        onClose={handleCloseReplyModal}
        maxWidth="sm"
        fullWidth
        fullScreen={fullScreenDialog}
        slotProps={{
          paper: {
            sx: {
              borderRadius: fullScreenDialog ? 0 : 4,
            },
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            pr: 1,
          }}
        >
          <Typography
            sx={{
              fontWeight: 800,
              letterSpacing: "0.02em",
              fontSize: { xs: 15, sm: 16 },
            }}
          >
            CASE #{String(activeTicketId ?? "").padStart(4, "0")}
          </Typography>

          <IconButton
            onClick={handleCloseReplyModal}
            size="small"
            sx={{ color: TEXT_MUTED, "&:hover": { color: "text.primary" } }}
          >
            <CloseRounded sx={{ fontSize: 22 }} />
          </IconButton>
        </DialogTitle>

        <DialogContent
          dividers
          sx={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            height: fullScreenDialog ? "100%" : 520,
            p: 0,
          }}
        >
          {submitting && (
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                zIndex: 10,
                bgcolor: "rgba(255,255,255,0.6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CircularProgress sx={{ color: PRIMARY }} />
            </Box>
          )}

          {loadingDetails && !ticketDetails ? (
            <Box
              flex={1}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <CircularProgress sx={{ color: PRIMARY }} />
            </Box>
          ) : (
            <>
              {/* ================= THREAD ================= */}
              <Box sx={{ flex: 1, overflowY: "auto", p: { xs: 2, sm: 2.5 } }}>
                {Array.isArray(ticketDetails?.messages) &&
                ticketDetails.messages.length > 0 ? (
                  ticketDetails.messages.map((m) => {
                    const isUser = m.sender === "USER";

                    return (
                      <Box
                        key={m.id}
                        sx={{
                          mb: 2.5,
                          maxWidth: { xs: "92%", sm: "80%" },
                          ml: isUser ? 0 : "auto",
                          p: 1.5,
                          borderRadius: 2.5,
                          bgcolor: isUser ? SURFACE : "#EEF2FF",
                        }}
                      >
                        <Typography
                          sx={{ ...eyebrowSx, mb: 0.5, fontSize: "0.65rem" }}
                        >
                          {isUser ? "You" : "Support"}
                          {"  ·  "}
                          {new Date(m.createdAt).toLocaleString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </Typography>

                        <Typography
                          sx={{
                            whiteSpace: "pre-wrap",
                            mb: 1,
                            fontSize: { xs: 13.5, sm: 14 },
                          }}
                        >
                          {m.message}
                        </Typography>

                        {Array.isArray(m.images) && m.images.length > 0 && (
                          <Box display="flex" gap={1} flexWrap="wrap">
                            {m.images.map((img, idx) => (
                              <Box
                                key={idx}
                                sx={{
                                  width: { xs: 64, sm: 76 },
                                  height: { xs: 64, sm: 76 },
                                  borderRadius: 2,
                                  border: `1px solid ${BORDER}`,
                                  overflow: "hidden",
                                }}
                              >
                                <img
                                  src={img}
                                  alt=""
                                  width="100%"
                                  height="100%"
                                  style={{ objectFit: "cover" }}
                                />
                              </Box>
                            ))}
                          </Box>
                        )}
                      </Box>
                    );
                  })
                ) : (
                  <Typography sx={eyebrowSx}>No messages yet</Typography>
                )}
              </Box>

              <Divider />

              {/* ================= REPLY ================= */}
              <Box
                component="form"
                onSubmit={replyForm.handleSubmit}
                sx={{ p: { xs: 1.75, sm: 2 }, bgcolor: "background.paper" }}
              >
                <Typography sx={{ ...eyebrowSx, mb: 1 }}>Add reply</Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  placeholder="Write your reply"
                  name="description"
                  value={replyForm.values.description}
                  onChange={replyForm.handleChange}
                  onBlur={replyForm.handleBlur}
                  error={
                    !!(
                      replyForm.touched.description &&
                      replyForm.errors.description
                    )
                  }
                  helperText={
                    replyForm.touched.description &&
                    replyForm.errors.description
                  }
                  sx={{ ...fieldSx, mb: 2 }}
                />

                <Box sx={{ mb: 1 }}>
                  <Box
                    display="flex"
                    alignItems="center"
                    gap={1}
                    flexWrap="wrap"
                  >
                    <Button
                      size="small"
                      variant="outlined"
                      component="label"
                      disabled={replyImages.length >= 3}
                      sx={{
                        borderRadius: 2.5,
                        textTransform: "none",
                        fontWeight: 700,
                        borderColor: PRIMARY,
                        color: PRIMARY,
                        "&:hover": {
                          borderColor: PRIMARY_DARK,
                          bgcolor: "#EEF2FF",
                        },
                      }}
                      startIcon={<UploadFileRounded sx={{ fontSize: 18 }} />}
                    >
                      Attach
                      <input
                        hidden
                        type="file"
                        accept="image/*"
                        multiple
                        disabled={replyImages.length >= 3}
                        onChange={(e) => {
                          const files = Array.from(e.target.files);
                          setReplyImages((prev) =>
                            [...prev, ...files].slice(0, 3),
                          );
                        }}
                      />
                    </Button>

                    <Typography sx={eyebrowSx}>
                      {replyImages.length}/3
                    </Typography>
                  </Box>

                  {replyPreviews.length > 0 && (
                    <Box display="flex" gap={1} mt={1} flexWrap="wrap">
                      {replyPreviews.map((src, index) => (
                        <Box
                          key={index}
                          sx={{
                            position: "relative",
                            width: 44,
                            height: 44,
                            borderRadius: 2,
                            border: `1px solid ${BORDER}`,
                            overflow: "hidden",
                          }}
                        >
                          <img
                            src={src}
                            alt=""
                            width="100%"
                            height="100%"
                            style={{ objectFit: "cover" }}
                          />

                          <Box
                            onClick={() =>
                              setReplyImages((prev) =>
                                prev.filter((_, i) => i !== index),
                              )
                            }
                            sx={{
                              position: "absolute",
                              top: 2,
                              right: 2,
                              width: 16,
                              height: 16,
                              borderRadius: "50%",
                              bgcolor: "rgba(0,0,0,0.65)",
                              color: "#fff",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              cursor: "pointer",
                            }}
                          >
                            <CloseRounded sx={{ fontSize: 11 }} />
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disableElevation
                  disabled={submitting}
                  sx={{ ...primaryButtonSx, minWidth: { sm: 140 } }}
                >
                  {submitting ? (
                    <CircularProgress size={22} color="inherit" />
                  ) : (
                    "Send reply"
                  )}
                </Button>
              </Box>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SupportDetails;
