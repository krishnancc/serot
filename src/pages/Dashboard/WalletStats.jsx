import { Box, Grid, Typography, alpha } from "@mui/material";

import AccountBalanceRoundedIcon from "@mui/icons-material/AccountBalanceRounded";
import CurrencyBitcoinRoundedIcon from "@mui/icons-material/CurrencyBitcoinRounded";
import WalletRoundedIcon from "@mui/icons-material/WalletRounded";

import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
/* ================= THEME ================= */

const PRIMARY = "#6366F1";
const SUCCESS = "#10B981";
const WARNING = "#F59E0B";
const INFO = "#0EA5E9";

const TEXT = "#0F172A";
const MUTED = "#64748B";

/* ================= STAT ITEM ================= */

const StatItem = ({ title, value, subtitle, icon, accent }) => (
  <Box
    sx={{
      position: "relative",
      p: { xs: 2, sm: 2.5, md: 3 },
      borderRadius: { xs: 3, md: 4 },
      overflow: "hidden",

      background: `linear-gradient(
                145deg,
                ${alpha(accent, 0.15)},
                rgba(255,255,255,.96)
            )`,

      border: `1px solid ${alpha(accent, 0.18)}`,
      backdropFilter: "blur(18px)",

      transition: "all .35s ease",

      "&:hover": {
        transform: "translateY(-5px)",
        boxShadow: `0 12px 35px ${alpha(accent, 0.18)}`,
      },

      "@media (hover:none)": {
        "&:hover": {
          transform: "none",
        },
      },

      "&::before": {
        content: '""',
        position: "absolute",
        width: { xs: 110, md: 140 },
        height: { xs: 110, md: 140 },
        top: -35,
        right: -35,
        borderRadius: "50%",
        background: alpha(accent, 0.1),
      },
    }}
  >
    {/* Icon */}
    <Box
      sx={{
        position: "absolute",
        top: { xs: 12, md: 18 },
        right: { xs: 12, md: 18 },

        width: { xs: 40, md: 48 },
        height: { xs: 40, md: 48 },

        borderRadius: 3,

        display: "flex",
        alignItems: "center",
        justifyContent: "center",

        color: accent,
        background: alpha(accent, 0.15),
        border: `1px solid ${alpha(accent, 0.2)}`,

        "& svg": {
          fontSize: { xs: 22, md: 28 },
        },
      }}
    >
      {icon}
    </Box>

    <Box position="relative" zIndex={2}>
      <Typography
        sx={{
          fontSize: { xs: 30, md: 42 },
          fontWeight: 900,
          color: TEXT,
          lineHeight: 1,
        }}
      >
        ${Number(value || 0).toLocaleString()}
      </Typography>

      <Typography
        sx={{
          mt: 3,
          fontSize: { xs: 11, md: 13 },
          fontWeight: 600,
          color: MUTED,
        }}
      >
        {title}
      </Typography>
    </Box>
  </Box>
);

/* ================= WALLET STATS ================= */

const WalletStats = ({ wallet }) => {
  const format = (value) => Number(value || 0).toLocaleString();

  const totalBalance =
    (Number(wallet.mainUsd) || 0) + (Number(wallet.fundUsd) || 0);
  const walletData = [
    {
      title: "Available Balance",
      value: wallet?.mainUsd,
      subtitle: `≈ $ ${format(wallet?.mainUsd)} USDT`,
      icon: <WalletRoundedIcon />,
      accent: PRIMARY,
    },
    {
      title: "Super Balance",
      value: wallet?.fundUsd,
      subtitle: `≈ $ ${format(wallet?.fundUsd)} USDT`,
      icon: <AccountBalanceRoundedIcon />,
      accent: SUCCESS,
    },
    {
      title: "Deposit Balance",
      value: 0,
      subtitle: `≈ $ ${format(wallet?.cryptoUsd)} USDT`,
      icon: <CurrencyBitcoinRoundedIcon />,
      accent: WARNING,
    },
    {
      title: "Total Balance",
      value: totalBalance,
      subtitle: `≈ $ ${format(totalBalance)} USDT`,
      icon: <AccountBalanceWalletRoundedIcon />,
      accent: INFO,
    },
  ];

  return (
    <Grid container spacing={{ xs: 2, md: 3 }} mb={3}>
      {walletData.map((item, index) => (
        <Grid
          key={index}
          size={{
            xs: 12,
            sm: 6,
            md: 3,
          }}
        >
          <StatItem {...item} />
        </Grid>
      ))}
    </Grid>
  );
};

export default WalletStats;
