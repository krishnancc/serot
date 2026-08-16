import {
  Avatar,
  Box,
  Fade,
  Grid,
  IconButton,
  InputAdornment,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Formik } from "formik";
import { useEffect, useState } from "react";

import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import { toast } from "react-toastify";
import { getMethod } from "../../api/login";

// ── Design tokens (shared with Wallet / Genealogy / Welcomecard system) ──
const PRIMARY = "#6366F1";
const PRIMARY_DARK = "#4F46E5";
const VIOLET = "#8B5CF6";
const BG = "#F8FAFC";
const SURFACE = "#FFFFFF";
const BORDER = "#E5E7EB";
const TEXT = "#111827";
const MUTED = "#6B7280";
const SUCCESS = "#059669";
const SUCCESS_BG = "#ECFDF5";
const AMBER = "#B45309";
const AMBER_BG = "#FFFBEB";
const AMBER_BORDER = "#FDE68A";

const QrCode = ({ size = 168, color = TEXT, depositData }) => {
  console.log("Deposit Data in QR Code ", depositData);
  return (
    <Box
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      sx={{ display: "block" }}
    >
      {depositData?.qr && (
        <Stack alignItems="center">
          <img
            src={depositData?.qr}
            alt="Deposit QR"
            style={{ width: 156, height: 156, objectFit: "contain" }}
          />
        </Stack>
      )}
    </Box>
  );
};

// Ticket-stub perforation — a row/column of cut-out notches on a shared edge.
const Perforation = ({ orientation = "vertical" }) => {
  const isVertical = orientation === "vertical";
  return (
    <Box
      sx={{
        position: "relative",
        width: isVertical ? 0 : "100%",
        height: isVertical ? "100%" : 0,
        minHeight: isVertical ? 120 : 0,
        borderLeft: isVertical ? `2px dashed ${BORDER}` : "none",
        borderTop: !isVertical ? `2px dashed ${BORDER}` : "none",
        mx: isVertical ? 0 : "auto",
      }}
    >
      {[0, 1].map((i) => (
        <Box
          key={i}
          sx={{
            position: "absolute",
            width: 20,
            height: 20,
            borderRadius: "50%",
            bgcolor: BG,
            top: isVertical ? (i === 0 ? -10 : "auto") : -10,
            bottom: isVertical ? (i === 1 ? -10 : "auto") : "auto",
            left: isVertical ? -10 : i === 0 ? -10 : "auto",
            right: isVertical ? -10 : i === 1 ? -10 : "auto",
          }}
        />
      ))}
    </Box>
  );
};

const NoticeStrip = ({ tone = "success", icon, children }) => {
  const success = tone === "success";
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        gap: 1.25,
        px: { xs: 1.75, sm: 2 },
        py: 1.5,
        borderRadius: 2.5,
        border: `1px solid ${success ? "#A7F3D0" : AMBER_BORDER}`,
        bgcolor: success ? SUCCESS_BG : AMBER_BG,
      }}
    >
      <Box sx={{ display: "flex", flexShrink: 0, mt: "1px" }}>{icon}</Box>
      <Typography
        sx={{
          fontSize: 13.5,
          fontWeight: 600,
          color: success ? SUCCESS : AMBER,
          lineHeight: 1.55,
        }}
      >
        {children}
      </Typography>
    </Box>
  );
};

// Read-only "selector" field — styled to look tappable even though it's
// display-only for now, so it doesn't read as a disabled/broken input.
const SelectorField = ({ label, icon, value }) => (
  <Box>
    <Typography sx={{ mb: 1, fontWeight: 600, fontSize: 14, color: TEXT }}>
      {label}
    </Typography>
    <TextField
      disabled
      fullWidth
      value={value || ""}
      InputProps={{
        readOnly: true,
        startAdornment: (
          <InputAdornment position="start">
            <Avatar
              src={icon}
              sx={{
                width: 30,
                height: 30,
                opacity: 1,
              }}
            />
          </InputAdornment>
        ),
        endAdornment: (
          <InputAdornment position="end">
            <ExpandMoreRoundedIcon
              sx={{
                color: MUTED,
                fontSize: 22,
              }}
            />
          </InputAdornment>
        ),
      }}
      sx={{
        "& .MuiOutlinedInput-root": {
          bgcolor: BG,
          borderRadius: 3,
          height: 58,
          fontWeight: 600,
          fontSize: 15,
          pr: 1.5,

          "& fieldset": {
            borderColor: BORDER,
          },

          "&.Mui-disabled": {
            bgcolor: BG,
          },
        },

        // Keep text black when disabled
        "& .MuiInputBase-input.Mui-disabled": {
          WebkitTextFillColor: "#111827",
          color: "#111827",
          opacity: 1,
          fontWeight: 600,
        },

        // Keep adornment visible
        "& .MuiInputAdornment-root": {
          opacity: 1,
        },

        // Keep avatar visible
        "& .MuiAvatar-root": {
          opacity: 1,
        },

        // Keep end icon visible
        "& .MuiInputAdornment-root svg": {
          opacity: 1,
        },

        "& .MuiInputBase-input": {
          cursor: "default",
        },
      }}
    />
  </Box>
);

const Deposit = ({ crypto = [] }) => {
  const asset = crypto?.[0];
  console.log("Deposit Asset ", asset);

  const [copied, setCopied] = useState(false);

  const [depositData, setDepositData] = useState(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!asset?.assetId) return;

    const fetchDepositAddress = async () => {
      try {
        setLoading(true);

        const result = await getMethod(
          `/api/crypto/deposit/address?assetId=${asset.assetId}`,
        );

        if (result?.error || !result?.success) {
          toast.error(
            result.error?.message || "Failed to fetch deposit address",
          );
          return;
        }
        console.log("Deposit Address Result ", result.data);
        setDepositData(result.data);
      } catch (err) {
        toast.error(err.message || "Failed to fetch deposit address");
      } finally {
        setLoading(false);
      }
    };

    fetchDepositAddress();
  }, [crypto?.assetId]);

  const address = depositData?.address || "Loading address...";

  const handleCopy = () => {
    navigator.clipboard?.writeText(address);
    setCopied(true);
    // toast.success('Address copied');
  };
  // const handleCopy = () => {
  //     if (!depositData?.address) return;
  //     navigator.clipboard.writeText(depositData.address);
  //     toast.success('Address copied');
  // };
  return (
    <Formik
      initialValues={{
        asset: asset?.symbol || "",
        network: asset?.network || asset?.chain || "",
      }}
      onSubmit={() => {}}
    >
      {({ values }) => (
        <Box
          maxWidth={720}
          mx="auto"
          px={{ xs: 2, sm: 3 }}
          py={{ xs: 3, md: 4 }}
        >
          {/* Heading */}
          <Box mb={{ xs: 3, sm: 3.5 }}>
            <Typography
              sx={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 700,
                fontSize: { xs: 21, sm: 26 },
                color: TEXT,
                lineHeight: 1.3,
              }}
            >
              Deposit crypto
            </Typography>
            <Typography
              sx={{ color: MUTED, mt: 0.5, fontSize: { xs: 13.5, sm: 14.5 } }}
            >
              Fund your wallet by sending assets to the address below.
            </Typography>
          </Box>

          {/* Selectors */}
          <Grid
            sx={{ pt: "20px !important" }}
            container
            spacing={{ xs: 2, sm: 2.5 }}
            mb={{ xs: 3, sm: 3.5 }}
          >
            <Grid size={{ xs: 12, sm: 6 }}>
              <SelectorField
                label="Asset"
                icon={asset?.icon}
                value={values.asset}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <SelectorField
                label="Network"
                icon={asset?.networkIcon || asset?.icon}
                value={values.network}
              />
            </Grid>
          </Grid>

          {/* Vault ticket */}
          <Grid sx={{ pt: "20px !important" }}>
            <Box
              sx={{
                borderRadius: 4,
                border: `1px solid ${BORDER}`,
                bgcolor: SURFACE,
                overflow: "hidden",
                boxShadow: "0 1px 2px rgba(17,24,39,0.04)",
              }}
            >
              {/* Header bar */}
              <Box
                sx={{
                  px: { xs: 2.25, sm: 3 },
                  py: { xs: 1.5, sm: 1.75 },
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 1,
                  rowGap: 1,
                  background: `linear-gradient(90deg, ${PRIMARY_DARK}, ${VIOLET})`,
                }}
              >
                <Box display="flex" alignItems="center" gap={1} minWidth={0}>
                  {/* <ShieldRoundedIcon sx={{ color: "#fff", fontSize: 20, flexShrink: 0 }} /> */}
                  <Typography
                    sx={{
                      color: "#fff",
                      fontWeight: 700,
                      fontSize: { xs: 13.5, sm: 15 },
                      letterSpacing: 0.2,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    Verified deposit address
                  </Typography>
                </Box>
                {values.network && (
                  <Typography
                    sx={{
                      color: "#fff",
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: 0.6,
                      textTransform: "uppercase",
                      bgcolor: "rgba(255,255,255,0.18)",
                      px: 1.25,
                      py: 0.4,
                      borderRadius: 999,
                      flexShrink: 0,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {values.network}
                  </Typography>
                )}
              </Box>

              {/* Stub body */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  alignItems: "stretch",
                }}
              >
                {/* QR stamp */}
                <Box
                  sx={{
                    flex: { xs: "none", sm: "0 0 196px" },
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1.25,
                    px: 3,
                    py: { xs: 3.5, sm: 3 },
                  }}
                >
                  <Box
                    sx={{
                      p: 1.5,
                      border: `1.5px dashed ${BORDER}`,
                      borderRadius: 3,
                      lineHeight: 0,
                    }}
                  >
                    <QrCode size={132} color={TEXT} depositData={depositData} />
                  </Box>
                  <Box display="flex" alignItems="center" gap={0.5}>
                    {/* <QrCode2RoundedIcon sx={{ fontSize: 14, color: MUTED }} /> */}
                    <Typography
                      sx={{ fontSize: 11.5, color: MUTED, fontWeight: 600 }}
                    >
                      Scan to fill address
                    </Typography>
                  </Box>
                </Box>

                {/* Perforation — horizontal on mobile, vertical on desktop */}
                <Box sx={{ display: { xs: "block", sm: "none" }, px: 3 }}>
                  <Perforation orientation="horizontal" />
                </Box>
                <Box sx={{ display: { xs: "none", sm: "block" }, py: 3.5 }}>
                  <Perforation orientation="vertical" />
                </Box>

                {/* Address panel */}
                <Box
                  sx={{
                    flex: 1,
                    minWidth: 0,
                    px: { xs: 2.5, sm: 3.5 },
                    py: { xs: 3, sm: 3 },
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: 0.6,
                      color: MUTED,
                      textTransform: "uppercase",
                      mb: 1,
                    }}
                  >
                    Wallet address
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.25,
                      bgcolor: BG,
                      border: `1px solid ${BORDER}`,
                      borderRadius: 2.5,
                      pl: { xs: 1.75, sm: 2 },
                      pr: 1,
                      py: 1.25,
                      minWidth: 0,
                    }}
                  >
                    <Typography
                      sx={{
                        flex: 1,
                        minWidth: 0,
                        fontFamily:
                          "ui-monospace, 'SF Mono', 'Roboto Mono', monospace",
                        fontSize: { xs: 12, sm: 13.5 },
                        fontWeight: 600,
                        color: TEXT,
                        wordBreak: "break-all",
                        lineHeight: 1.6,
                      }}
                    >
                      {address}
                    </Typography>

                    <IconButton
                      onClick={handleCopy}
                      size="small"
                      aria-label="Copy address"
                      sx={{
                        width: 36,
                        height: 36,
                        flexShrink: 0,
                        bgcolor: copied ? SUCCESS_BG : PRIMARY + "14",
                        "&:hover": {
                          bgcolor: copied ? SUCCESS_BG : PRIMARY + "26",
                        },
                      }}
                    >
                      <Box sx={{ position: "relative", width: 18, height: 18 }}>
                        <Fade in={copied} timeout={150}>
                          <CheckRoundedIcon
                            sx={{
                              position: "absolute",
                              inset: 0,
                              fontSize: 18,
                              color: SUCCESS,
                            }}
                          />
                        </Fade>
                        <Fade in={!copied} timeout={150}>
                          <ContentCopyRoundedIcon
                            sx={{
                              position: "absolute",
                              inset: 0,
                              fontSize: 17,
                              color: PRIMARY_DARK,
                            }}
                          />
                        </Fade>
                      </Box>
                    </IconButton>
                  </Box>

                  <Box
                    mt={2.5}
                    display="flex"
                    flexDirection="column"
                    gap={1.25}
                  >
                    <Grid sx={{ pt: "20px !important" }}>
                      <NoticeStrip
                        tone="success"
                        icon={
                          <AccountBalanceWalletRoundedIcon
                            sx={{ fontSize: 18, color: SUCCESS, pt: 0.5 }}
                          />
                        }
                      >
                        Only send {values.asset || "this asset"} on the{" "}
                        {values.network || "selected"} network to this address.
                      </NoticeStrip>
                    </Grid>

                    <Grid sx={{ pt: "20px !important" }}>
                      <NoticeStrip
                        tone="warning"
                        icon={
                          <WarningAmberRoundedIcon
                            sx={{ fontSize: 18, color: AMBER }}
                          />
                        }
                      >
                        Sending a different asset or using another network may
                        permanently lose your funds.
                      </NoticeStrip>
                    </Grid>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Grid>

          <Snackbar
            open={copied}
            autoHideDuration={1800}
            onClose={() => setCopied(false)}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            message="Address copied"
          />
        </Box>
      )}
    </Formik>
  );
};

export default Deposit;
