import RefreshIcon from "@mui/icons-material/Refresh";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import Deposit from "./Deposit";
import Transfer from "./Transfer";
import Withdraw from "./Withdraw";

const PRIMARY = "#6366F1";
const PRIMARY_DARK = "#4F46E5";
const PRIMARY_LIGHT = "#8B5CF6";
const SURFACE = "#F8FAFC";
const BORDER = "#E2E8F0";
const TEXT_MUTED = "#64748B";

const Assets = ({
  cryptos,
  balances,
  user,
  handleDepositSync,
  syncing,
  handleSuccess,
}) => {
  const [tab, setTab] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Grid container spacing={{ xs: 2, sm: 3 }}>
      <Grid size={{ xs: 12, sm: 12, md: 7 }}>
        <Box
          sx={{
            p: { xs: 2, sm: 3 },
            borderRadius: 4,
            border: `1px solid ${BORDER}`,
            background: "linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)",
            boxShadow: "0 10px 30px rgba(99,102,241,0.08)",
            overflow: "hidden",
            minHeight: 350,
          }}
        >
          <Box
            sx={{
              mb: 1,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              sx={{
                fontSize: {
                  xs: 16,
                  sm: 16,
                  md: 20,
                },
                letterSpacing: -0.3,
                fontWeight: 600,
              }}
            >
              Crypto Wallet
            </Typography>

            {/* <Tooltip title="Refresh" arrow placement="top"> */}
            <Button
              sx={{
                backgroundColor: "#f3f4f6",
                borderRadius: "12px",
                "&:hover": {
                  backgroundColor: "#e5e7eb",
                },
              }}
              size="small"
              variant="outlined"
              onClick={handleDepositSync}
              disabled={syncing}
              startIcon={
                syncing ? (
                  <CircularProgress size={20} thickness={5} />
                ) : (
                  <RefreshIcon
                    sx={{
                      fontSize: 22,
                      color: "#2563eb",
                    }}
                  />
                )
              }
            >
              {syncing ? "Syncing…" : "Get Deposit"}
            </Button>
            {/* <IconButton
                                onClick={handleDepositSync}
                                disabled={syncing}
                                sx={{
                                    backgroundColor: "#f3f4f6",
                                    borderRadius: "12px",
                                    width: 42,
                                    height: 42,
                                    "&:hover": {
                                        backgroundColor: "#e5e7eb",
                                    },
                                }}
                            >
                                {syncing ? (
                                    <CircularProgress size={20} thickness={5} />
                                ) : (
                                    <RefreshIcon
                                        sx={{
                                            fontSize: 22,
                                            color: "#2563eb",
                                        }}
                                    />
                                )}
                            </IconButton> */}
            {/* </Tooltip> */}
          </Box>
          <Divider sx={{ borderColor: BORDER, mb: 1.5 }} />

          <LedgerSwitch value={tab} onChange={setTab} />

          {tab === 0 && (
            <>
              <Deposit crypto={cryptos} />
            </>
          )}
          {tab === 1 && (
            <>
              <Withdraw
                crypto={cryptos}
                balances={balances}
                user={user}
                handleSuccess={handleSuccess}
              />
            </>
          )}
        </Box>
      </Grid>

      <Grid size={{ xs: 12, sm: 12, md: 5 }}>
        <Box
          sx={{
            p: { xs: 2, sm: 3 },
            borderRadius: 4,
            border: `1px solid ${BORDER}`,
            background: "linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)",
            boxShadow: "0 10px 30px rgba(99,102,241,0.08)",
            overflow: "hidden",
            minHeight: 350,
          }}
        >
          <Box
            sx={{
              mb: 1,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              sx={{
                fontSize: {
                  xs: 16,
                  sm: 16,
                  md: 20,
                },
                letterSpacing: -0.3,
                fontWeight: 600,
              }}
            >
              Crypto Transfer
            </Typography>
          </Box>
          <Divider sx={{ borderColor: BORDER, mb: 4 }} />
          <Transfer onSuccess={handleSuccess} balances={balances} />
        </Box>
      </Grid>
    </Grid>
  );
};

export default Assets;

function LedgerSwitch({ value, onChange }) {
  const items = [
    { key: 0, label: "Deposit" },
    { key: 1, label: `Withdraw` },
  ];

  return (
    <Box
      role="tablist"
      sx={{
        display: "flex",
        width: "100%",
        p: 0.5,
        borderRadius: 3,
        bgcolor: SURFACE,
        border: `1px solid ${BORDER}`,
        mb: { xs: 3, md: 4 },
        gap: 0.5,
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
              flex: 1,
              textAlign: "center",
              px: { xs: 1.5, sm: 2.5 },
              py: 1,
              borderRadius: 2.2,
              userSelect: "none",
              bgcolor: active ? "#4F46E5" : "transparent",
              boxShadow: active ? "0 4px 12px rgba(15,23,42,.08)" : "none",
              transition: "all .15s ease",

              "&:hover": {
                bgcolor: active ? "#4F46E5" : "rgba(255,255,255,0.5)",
              },

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
                color: active ? "#fff" : TEXT_MUTED,
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
