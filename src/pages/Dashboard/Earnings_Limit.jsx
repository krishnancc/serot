import {
  Box,
  CircularProgress,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import PaidRoundedIcon from "@mui/icons-material/PaidRounded";
import SavingsRoundedIcon from "@mui/icons-material/SavingsRounded";

const Earnings_Limit = ({ data }) => {
  const overallCap = Number(data?.overallCap || 0);
  const totalEarned = Number(data?.totalEarned || 0);

  const remaining = Math.max(overallCap - totalEarned, 0);

  const progress = overallCap > 0 ? (totalEarned / overallCap) * 100 : 0;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));

  const ringSize = isXs ? 150 : isMobile ? 170 : 190;

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 2.5, md: 4 },
        borderRadius: { xs: "20px", md: "28px" },
        bgcolor: "#fff",
        boxShadow: "0 18px 45px rgba(15,23,42,.08)",
        border: "1px solid #EEF2F7",
        borderColor: "divider",
        overflow: "hidden",
        position: "relative",

        "&:before": {
          content: '""',
          position: "absolute",
          width: 240,
          height: 240,
          right: -120,
          top: -120,
          borderRadius: "50%",
          background: "linear-gradient(135deg,#6366F1,#8B5CF6)",
          opacity: 0.08,
        },
      }}
    >
      {/* Header */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={{ xs: 3, md: 4 }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            width: "100%",
          }}
        >
          <Stack>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: {
                  xs: "1.05rem",
                  sm: "1.15rem",
                  md: "1.35rem",
                },
              }}
            >
              Earnings Limit
            </Typography>

            <Typography
              color="text.secondary"
              sx={{
                fontSize: {
                  xs: 12,
                  sm: 13,
                  md: 14,
                },
                mt: 0.5,
                mb: 2,
              }}
            >
              Monitor your earnings progress
            </Typography>
          </Stack>
        </Box>

        <Box
          sx={{
            width: { xs: 40, md: 48 },
            height: { xs: 36, md: 42 },
            flexShrink: 0,
            borderRadius: "18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg,#6366F1,#8B5CF6)",
            color: "#fff",
          }}
        >
          <PaidRoundedIcon fontSize={isXs ? "small" : "medium"} />
        </Box>
      </Stack>
      {/* Body */}
      <Stack
        mt={{ xs: 5, sm: 5, md: 10 }}
        direction={{
          xs: "column",
          md: "row",
        }}
        spacing={{
          xs: 4,
          md: 6,
        }}
        alignItems="center"
        justifyContent="center"
      >
        {/* Left - Circular Progress */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexShrink: 0,
            width: {
              xs: "100%",
              md: 220,
            },
          }}
        >
          <Box
            sx={{
              position: "relative",
              width: ringSize,
              height: ringSize,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {/* Background Circle */}
            <CircularProgress
              variant="determinate"
              value={100}
              size={ringSize}
              thickness={4}
              sx={{
                color: "#EEF2F7",
                position: "absolute",
              }}
            />

            {/* Progress Circle */}
            <CircularProgress
              variant="determinate"
              value={progress}
              size={ringSize}
              thickness={4}
              sx={{
                color: "#4F46E5",
                position: "absolute",
                "& .MuiCircularProgress-circle": {
                  strokeLinecap: "round",
                },
              }}
            />

            {/* Center Text */}
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <Typography
                sx={{
                  fontWeight: 800,
                  fontSize: {
                    xs: "1.7rem",
                    sm: "2rem",
                    md: "2.3rem",
                  },
                }}
              >
                {progress.toFixed(0)}%
              </Typography>

              <Typography
                color="text.secondary"
                sx={{
                  fontWeight: 500,
                  fontSize: { xs: 12, md: 14 },
                }}
              >
                Completed
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Right Side */}
        <Box flex={1} width="100%">
          <Stack spacing={{ xs: 1.6, sm: 2.2 }}>
            {/* Total Earned */}
            <Box
              sx={{
                width: { xs: "85%", sm: "100%" },
                p: { xs: 1.5, sm: 1 },
                borderRadius: 3,
                bgcolor: "#F8FAFC",
                border: "1px solid #EEF2F7",
              }}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Box
                  sx={{
                    width: { xs: 48, sm: 56 },
                    height: { xs: 48, sm: 56 },
                    borderRadius: "50%",
                    bgcolor: "#DCFCE7",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <PaidRoundedIcon
                    sx={{
                      color: "#22C55E",
                      fontSize: { xs: 26, sm: 32 },
                    }}
                  />
                </Box>

                <Box sx={{ flex: 1 }}>
                  <Typography
                    sx={{
                      color: "text.secondary",
                      fontSize: { xs: 12, sm: 13 },
                      lineHeight: 1.2,
                    }}
                  >
                    Total Earned
                  </Typography>

                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: { xs: 20, sm: 24, md: 28 },
                      lineHeight: 1.2,
                      mt: 0.3,
                    }}
                  >
                    $ {totalEarned}
                  </Typography>
                </Box>
              </Stack>
            </Box>

            {/* Overall Cap */}
            <Box
              sx={{
                width: { xs: "85%", sm: "100%" },
                p: { xs: 1.5, sm: 1 },
                borderRadius: 3,
                bgcolor: "#F8FAFC",
                border: "1px solid #EEF2F7",
              }}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Box
                  sx={{
                    width: { xs: 48, sm: 56 },
                    height: { xs: 48, sm: 56 },
                    borderRadius: "50%",
                    bgcolor: "#DBEAFE",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <AccountBalanceWalletRoundedIcon
                    sx={{
                      color: "#3B82F6",
                      fontSize: { xs: 26, sm: 32 },
                    }}
                  />
                </Box>

                <Box sx={{ flex: 1 }}>
                  <Typography
                    sx={{
                      color: "text.secondary",
                      fontSize: { xs: 12, sm: 13 },
                      lineHeight: 1.2,
                    }}
                  >
                    Overall Cap
                  </Typography>

                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: { xs: 20, sm: 24, md: 28 },
                      lineHeight: 1.2,
                      mt: 0.3,
                    }}
                  >
                    $ {overallCap}
                  </Typography>
                </Box>
              </Stack>
            </Box>

            {/* Remaining Balance */}
            <Box
              sx={{
                width: { xs: "85%", sm: "100%" },
                p: { xs: 1.5, sm: 1 },
                borderRadius: 3,
                background: "linear-gradient(135deg, #EEF2FF 0%, #F5F3FF 100%)",
                border: "1px solid #DDE5FF",
              }}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Box
                  sx={{
                    width: { xs: 48, sm: 56 },
                    height: { xs: 48, sm: 56 },
                    borderRadius: "50%",
                    bgcolor: "#E0E7FF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <SavingsRoundedIcon
                    sx={{
                      color: "#6366F1",
                      fontSize: { xs: 26, sm: 32 },
                    }}
                  />
                </Box>

                <Box sx={{ flex: 1 }}>
                  <Typography
                    sx={{
                      color: "text.secondary",
                      fontSize: { xs: 12, sm: 13 },
                      lineHeight: 1.2,
                    }}
                  >
                    Remaining Balance
                  </Typography>

                  <Typography
                    sx={{
                      color: "#4F46E5",
                      fontWeight: 700,
                      fontSize: { xs: 20, sm: 24, md: 28 },
                      lineHeight: 1.2,
                      mt: 0.3,
                    }}
                  >
                    $ {remaining}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};

export default Earnings_Limit;
