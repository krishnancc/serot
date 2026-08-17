import {
  AllInclusiveRounded,
  BoltRounded,
  CheckRounded,
  ContentCopyRounded,
  ShareRounded,
  TrendingUpRounded,
} from "@mui/icons-material";
import {
  alpha,
  Box,
  IconButton,
  Stack,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useState } from "react";

const INDIGO = "#4F46E5";
const VIOLET = "#8B5CF6";
const INDIGO_LIGHT = "#6366F1";
const SURFACE = "#F8FAFC";
const INK = "#1E1B4B";
const MUTED = "#64748B";

export default function WelcomeCard({ user }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const [copied, setCopied] = useState(false);
  const referralCode = "SN100000";
  const Url = process.env.REACT_APP_REFERRAL_BASE_URL;
  const referralLink = `${Url}?ref=SN${user?.superId || referralCode}`;
  // const referralLink = `http://localhost:3000/signup?ref=SN${user?.superId || referralCode}`;

  const hour = new Date().getHours();
  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
      return "Good Morning 👋";
    } else if (hour >= 12 && hour < 17) {
      return "Good Afternoon 👋";
    } else {
      return "Good Evening 👋";
    }
  };

  const copyReferral = async () => {
    await navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareReferral = async () => {
    if (navigator.share) {
      await navigator.share({
        title: "Join Serot Network",
        text: "Grow your business network with Serot",
        url: referralLink,
      });
    } else {
      copyReferral();
    }
  };

  const perks = [
    {
      icon: <TrendingUpRounded sx={{ fontSize: 16 }} />,
      label: "Real-time tracking",
    },
    { icon: <BoltRounded sx={{ fontSize: 16 }} />, label: "Instant rewards" },
    {
      icon: <AllInclusiveRounded sx={{ fontSize: 16 }} />,
      label: "Unlimited invites",
    },
  ];

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "1.35fr 1fr" },
        gap: { xs: 2.5, md: 3 },
        alignItems: "stretch",
      }}
    >
      {/* ---------- Left: Greeting panel ---------- */}
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          borderRadius: 4,
          px: { xs: 3, md: 5 },
          py: { xs: 3.5, md: 5 },
          // minHeight: { md: 300 },
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: `linear-gradient(135deg, ${INDIGO_LIGHT} 0%, ${INDIGO} 55%, ${VIOLET} 100%)`,
          color: "#fff",
          boxShadow: `0 20px 48px ${alpha(INDIGO, 0.28)}`,
        }}
      >
        {/* decorative dot-grid, not a literal network diagram */}
        <Box
          aria-hidden
          sx={{
            position: "absolute",
            inset: 0,
            opacity: 0.15,
            backgroundImage:
              "radial-gradient(rgba(255,255,255,.9) 1.5px, transparent 1.5px)",
            backgroundSize: "22px 22px",
            maskImage:
              "radial-gradient(ellipse at 80% 20%, black 10%, transparent 65%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at 80% 20%, black 10%, transparent 65%)",
          }}
        />
        <Box
          aria-hidden
          sx={{
            position: "absolute",
            width: 260,
            height: 260,
            borderRadius: "50%",
            background: alpha("#fff", 0.08),
            bottom: -120,
            left: -80,
          }}
        />

        <Box sx={{ position: "relative", zIndex: 1 }}>
          <Typography
            sx={{
              fontFamily: "Poppins, sans-serif",
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: 0.6,
              opacity: 0.85,
              mb: 1,
            }}
          >
            {getGreeting().toUpperCase()}
          </Typography>

          <Typography
            variant={isMobile ? "h6" : "h4"}
            sx={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 800,
              lineHeight: 1.15,
            }}
          >
            Welcome back, {user?.username || "-"} !
          </Typography>

          <Typography
            sx={{
              mt: 1.5,
              maxWidth: 440,
              fontSize: { xs: "0.9rem", md: "0.98rem" },
              opacity: 0.88,
              lineHeight: 1.6,
            }}
          >
            Here's your Serot account overview — track team performance, wallet
            balance, earnings, and growth from one place.
          </Typography>

          <Stack
            direction="row"
            spacing={{ xs: 1.5, sm: 2.5 }}
            flexWrap="wrap"
            sx={{
              mt: 3.5,
              rowGap: 1,
              display: { xs: "none", sm: "flex" },
              textAlign: "center",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {perks.map((p) => (
              <Stack
                key={p.label}
                direction="row"
                spacing={0.75}
                alignItems="center"
                justifyContent="center"
                sx={{
                  width: "100%",
                  textAlign: "center",
                }}
              >
                <Box
                  sx={{
                    width: 26,
                    height: 26,
                    borderRadius: "50%",
                    display: "grid",
                    placeItems: "center",
                    background: alpha("#fff", 0.16),
                    flexShrink: 0,
                  }}
                >
                  {p.icon}
                </Box>

                <Typography
                  sx={{
                    pt: 0.6,
                    fontSize: 12.5,
                    fontWeight: 600,
                    opacity: 0.92,
                    textAlign: "center",
                  }}
                >
                  {p.label}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </Box>
      </Box>

      {/* ---------- Right: Referral "ticket" ---------- */}
      <Box
        sx={{
          position: "relative",
          borderRadius: 4,
          bgcolor: "#fff",
          border: "1px solid",
          borderColor: alpha(INDIGO, 0.1),
          boxShadow: `0 14px 34px ${alpha(INDIGO, 0.1)}`,
          display: "flex",
          flexDirection: isDesktop ? "column" : "row",
          minHeight: { md: 300 },
          overflow: "hidden",
        }}
      >
        {/* Code stub */}
        <Box
          sx={{
            flex: isDesktop ? "0 0 auto" : "1 1 50%",
            px: { xs: 2.5, md: 3.5 },
            py: { xs: 2.5, md: 3.5 },
          }}
        >
          <Typography
            sx={{
              fontSize: 11.5,
              fontWeight: 700,
              letterSpacing: 0.8,
              color: MUTED,
              textTransform: "uppercase",
            }}
          >
            Referral code
          </Typography>
          <Typography
            sx={{
              mt: 1,
              fontFamily: "'Roboto Mono', monospace",
              fontSize: { xs: 22, md: 26 },
              fontWeight: 700,
              letterSpacing: 1.5,
              color: INK,
            }}
          >
            SN{user?.superId || "-"}
          </Typography>
          <Typography
            sx={{ mt: 1, fontSize: 13, color: MUTED, lineHeight: 1.6 }}
          >
            Share this code — every signup grows your network and unlocks
            rewards.
          </Typography>
        </Box>

        {/* Perforated divider */}
        <Box
          sx={{
            position: "relative",
            flex: "0 0 auto",
            ...(isDesktop
              ? {
                  mx: 3.5,
                  borderTop: `2px dashed ${alpha(INDIGO, 0.18)}`,
                }
              : {
                  my: 2.5,
                  borderLeft: `2px dashed ${alpha(INDIGO, 0.18)}`,
                }),
          }}
        >
          <Box
            aria-hidden
            sx={{
              position: "absolute",
              width: 22,
              height: 22,
              borderRadius: "50%",
              bgcolor: SURFACE,
              ...(isDesktop
                ? { top: -11, left: -11 }
                : { top: -11, left: -11 }),
            }}
          />
          <Box
            aria-hidden
            sx={{
              position: "absolute",
              width: 22,
              height: 22,
              borderRadius: "50%",
              bgcolor: SURFACE,
              ...(isDesktop
                ? { top: -11, right: -11 }
                : { bottom: -11, left: -11 }),
            }}
          />
        </Box>

        {/* Actions stub */}
        <Box
          sx={{
            flex: 1,
            px: { xs: 2.5, md: 3.5 },
            py: { xs: 2.5, md: 3.5 },
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Typography
            sx={{
              fontSize: 11.5,
              fontWeight: 700,
              letterSpacing: 0.8,
              color: MUTED,
              textTransform: "uppercase",
              mb: 1.5,
            }}
          >
            Invite
          </Typography>

          <Stack direction="row" spacing={1.5}>
            <Tooltip title={copied ? "Copied!" : "Copy invite link"}>
              <IconButton
                onClick={copyReferral}
                sx={{
                  width: 46,
                  height: 46,
                  borderRadius: 2.5,
                  color: copied ? "#16A34A" : INDIGO,
                  bgcolor: copied ? alpha("#16A34A", 0.1) : alpha(INDIGO, 0.08),
                  "&:hover": {
                    bgcolor: copied
                      ? alpha("#16A34A", 0.16)
                      : alpha(INDIGO, 0.14),
                  },
                }}
              >
                {copied ? <CheckRounded /> : <ContentCopyRounded />}
              </IconButton>
            </Tooltip>

            <Tooltip title="Share invite link">
              <IconButton
                onClick={shareReferral}
                sx={{
                  width: 46,
                  height: 46,
                  borderRadius: 2.5,
                  color: "#fff",
                  background: `linear-gradient(135deg, ${INDIGO_LIGHT}, ${VIOLET})`,
                  "&:hover": { filter: "brightness(1.08)" },
                }}
              >
                <ShareRounded />
              </IconButton>
            </Tooltip>
          </Stack>

          <Typography sx={{ mt: 1.5, fontSize: 12, color: MUTED }}>
            {copied
              ? "Link copied to clipboard"
              : "Copy or share your invite link"}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
