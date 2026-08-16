import { Box, Card, CardContent, Stack, Typography } from "@mui/material";

import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import LayersRoundedIcon from "@mui/icons-material/LayersRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";

const Earnings_Overall = ({ earnings }) => {
  const earningItems = [
    {
      label: "ROI Income",
      value: earnings?.overall?.roi || 0,
      icon: <TrendingUpRoundedIcon />,
      gradient: "linear-gradient(135deg,#2563eb,#60a5fa)",
    },
    {
      label: "Direct Income",
      value: earnings?.overall?.direct || 0,
      icon: <AccountBalanceWalletRoundedIcon />,
      gradient: "linear-gradient(135deg,#16a34a,#4ade80)",
    },
    {
      label: "Level Income",
      value: earnings?.overall?.level || 0,
      icon: <LayersRoundedIcon />,
      gradient: "linear-gradient(135deg,#9333ea,#c084fc)",
    },
  ];

  return (
    <Card
      sx={{
        borderRadius: "24px",
        boxShadow: "0 12px 40px rgba(0,0,0,0.08)",
        border: "1px solid",
        borderColor: "divider",
        height: "100%",
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Header */}
        <Stack direction="row" alignItems="center" spacing={1.5} mb={3}>
          <Box>
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
              Earnings (overall)
            </Typography>

            <Typography
              color="text.secondary"
              sx={{
                fontSize: {
                  xs: 14,
                  sm: 13,
                  md: 14,
                },
                mb: 2,
              }}
            >
              Overall income summary
            </Typography>
          </Box>
        </Stack>

        {/* Earnings Items */}
        <Stack spacing={2}>
          {earningItems.map((item) => (
            <Box
              key={item.label}
              sx={{
                p: 2,
                borderRadius: "18px",
                background: "background.paper",
                border: "1px solid",
                borderColor: "divider",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                transition: "0.3s",

                "&:hover": {
                  transform: "translateY(-3px)",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
                },
              }}
            >
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                sx={{
                  height: "100%",
                }}
              >
                <Box
                  sx={{
                    width: 42,
                    height: 42,
                    borderRadius: "14px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: item.gradient,
                    color: "#fff",
                    flexShrink: 0,
                  }}
                >
                  {item.icon}
                </Box>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    lineHeight: 1,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {item.label}
                </Typography>
              </Stack>
              <Typography
                variant="h6"
                fontWeight={700}
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: 18, sm: 24, md: 28 },
                  lineHeight: 1.2,
                  mr: 0.5,
                }}
              >
                $ {Number(item.value).toLocaleString()}
              </Typography>
            </Box>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default Earnings_Overall;
