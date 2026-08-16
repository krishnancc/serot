import RefreshIcon from "@mui/icons-material/Refresh";

import { Box, IconButton, Tooltip, Typography } from "@mui/material";

const PRIMARY = "#6366F1";
const PRIMARY_DARK = "#4F46E5";
const PRIMARY_LIGHT = "#8B5CF6";
const SURFACE = "#F8FAFC";
const BORDER = "#E2E8F0";
const TEXT_MUTED = "#64748B";
const SUCCESS = "#10B981";
const WARNING = "#F59E0B";
const INFO = "#0EA5E9";

const gradient = `linear-gradient(135deg, ${PRIMARY} 0%, ${PRIMARY_LIGHT} 100%)`;

const Header = ({ loading }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
      }}
    >
      <Box>
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
          Purchase
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
          Track your purchase history and transactions.
        </Typography>
      </Box>

      <Tooltip title="Refresh" arrow placement="top">
        <IconButton
          sx={{
            mt: 1,
            backgroundColor: "#f3f4f6",
            borderRadius: "12px",
            width: 42,
            height: 42,
            "&:hover": {
              backgroundColor: "#e5e7eb",
            },
          }}
          onClick={() => window.location.reload()}
        >
          <RefreshIcon
            sx={{
              fontSize: 22,
              color: "#2563eb",
            }}
          />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default Header;
