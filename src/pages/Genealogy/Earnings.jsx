import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import LayersRoundedIcon from "@mui/icons-material/LayersRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import { alpha, Box, Card, Stack, Typography } from "@mui/material";

const PRIMARY = "#6366F1";
const PRIMARY_LIGHT = "#8B5CF6";
const BORDER = "#E2E8F0";
const TEXT_MUTED = "#64748B";
const DIRECT = "#10B981";
const LEVEL = "#0EA5E9";

const gradient = `linear-gradient(135deg, ${PRIMARY}, ${PRIMARY_LIGHT})`;

const Earnings = ({ earnings }) => {
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 4,
        border: `1px solid ${BORDER}`,
        background: "linear-gradient(180deg,#FFFFFF,#F8FAFC)",
        p: { xs: 2, sm: 2.75 },
        position: { md: "sticky" },
        top: 24,
        transition: "0.3s",
        "&:hover": {
          boxShadow: "0 20px 45px rgba(15,23,42,.08)",
        },
      }}
    >
      {/* Header */}
      <Stack
        direction="row"
        alignItems="center"
        spacing={2}
        sx={{ mb: { xs: 2.8, sm: 3.2 } }}
      >
        <Box
          sx={{
            width: 42,
            height: 42,
            borderRadius: 2.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: gradient,
            color: "#fff",
            boxShadow: `0 8px 20px ${alpha(PRIMARY, 0.25)}`,
          }}
        >
          <TrendingUpRoundedIcon
            sx={{
              fontSize: {
                xs: 26,
                sm: 30,
              },
            }}
          />
        </Box>

        <Box>
          <Typography
            fontWeight={900}
            fontSize={{
              xs: 20,
              sm: 22,
              md: 24,
            }}
            lineHeight={1.15}
          >
            Earnings
          </Typography>

          <Typography
            sx={{
              color: TEXT_MUTED,
              fontSize: {
                xs: 13,
                sm: 14,
              },
              mt: 0.3,
              fontWeight: 500,
            }}
          >
            Income performance overview
          </Typography>
        </Box>
      </Stack>

      {/* Income Cards */}
      <Stack spacing={2}>
        <IncomeItem
          icon={<GroupsRoundedIcon />}
          title="Direct Income"
          value={earnings?.directIncome}
          color={DIRECT}
        />

        <IncomeItem
          icon={<LayersRoundedIcon />}
          title="Level Income"
          value={earnings?.levelIncome}
          color={LEVEL}
        />
      </Stack>

      {/* Total Income */}
      <Box
        sx={{
          mt: 3,
          px: { xs: 2.2, sm: 2.8 },
          py: { xs: 2.2, sm: 2.5 },
          borderRadius: 3.5,
          background: gradient,
          color: "#fff",
          boxShadow: `0 16px 35px ${alpha(PRIMARY, 0.35)}`,
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          sx={{
            width: "100%",
          }}
        >
          <Box
            sx={{
              flex: 1,
              minWidth: 0,
            }}
          >
            <Typography
              sx={{
                opacity: 0.9,
                fontSize: {
                  xs: 13,
                  sm: 14,
                },
                fontWeight: 600,
              }}
            >
              Total Income
            </Typography>

            <Typography
              fontWeight={900}
              fontSize={{
                xs: 30,
                sm: 36,
                md: 40,
              }}
              lineHeight={1.05}
              letterSpacing={-0.6}
            >
              $ {earnings?.totalIncome ?? 0}
            </Typography>
          </Box>

          <Box
            sx={{
              ml: "auto",
              flexShrink: 0,
              width: { xs: 50, sm: 52 },
              height: { xs: 50, sm: 52 },
              borderRadius: 3,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: alpha("#fff", 0.18),
              backdropFilter: "blur(8px)",
            }}
          >
            <AccountBalanceWalletRoundedIcon
              sx={{
                fontSize: {
                  xs: 30,
                  sm: 34,
                },
              }}
            />
          </Box>
        </Stack>
      </Box>
    </Card>
  );
};

export default Earnings;

const IncomeItem = ({ icon, title, value, color }) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        px: { xs: 1.75, sm: 2 },
        py: { xs: 1.6, sm: 1.8 },
        borderRadius: 3,
        background: "#fff",
        border: `1px solid ${BORDER}`,
        transition: "all .25s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: `0 12px 28px ${alpha(color, 0.12)}`,
          borderColor: alpha(color, 0.35),
        },
      }}
    >
      <Box
        sx={{
          width: { xs: 44, sm: 50 },
          height: { xs: 44, sm: 50 },
          flexShrink: 0,
          borderRadius: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: alpha(color, 0.12),
          color,
        }}
      >
        {icon &&
          (() => {
            const Icon = icon.type;
            return (
              <Icon
                sx={{
                  fontSize: {
                    xs: 24,
                    sm: 28,
                  },
                }}
              />
            );
          })()}
      </Box>

      <Box sx={{ flex: 1 }}>
        <Typography
          fontWeight={900}
          fontSize={{
            xs: 20,
            sm: 22,
            md: 24,
          }}
          lineHeight={1.15}
        >
          $ {value ?? 0}
        </Typography>

        <Typography
          sx={{
            color: TEXT_MUTED,
            fontSize: {
              xs: 13,
              sm: 14,
            },
            fontWeight: 600,
            mt: 0.3,
          }}
        >
          {title}
        </Typography>
      </Box>
    </Box>
  );
};
