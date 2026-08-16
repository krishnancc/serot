import { Box, Grid, Paper, Typography } from "@mui/material";

import AttachMoneyRoundedIcon from "@mui/icons-material/AttachMoneyRounded";
import PendingActionsRoundedIcon from "@mui/icons-material/PendingActionsRounded";
import ShoppingBagRoundedIcon from "@mui/icons-material/ShoppingBagRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";

const PurchaseHistory = ({ progress }) => {
  const purchaseItems = [
    {
      label: "Total Purchased",
      value: `${progress?.totalPackagesPurchased || 0} Nos`,
      icon: <ShoppingBagRoundedIcon />,
    },
    {
      label: "Purchased Value",
      value: `$ ${progress?.totalPurchasedUsd || 0} `,
      icon: <AttachMoneyRoundedIcon />,
    },
    {
      label: "ROI Earned",
      value: `$ ${progress?.roiEarned || 0} `,
      icon: <TrendingUpRoundedIcon />,
    },
    {
      label: "ROI Pending",
      value: `$ ${progress?.roiPending || 0} `,
      icon: <PendingActionsRoundedIcon />,
    },
  ];

  return (
    <Paper
      elevation={0}
      sx={{
        width: "100%",
        borderRadius: { xs: "14px", sm: "16px" },
        border: "1px solid #EDF0F4",
        backgroundColor: "#fff",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: { xs: 1.75, sm: 2, md: 2.5 },
          py: { xs: 1.5, sm: 1.75, md: 2 },
          borderBottom: "1px solid #EDF0F4",
        }}
      >
        <Typography
          fontWeight={900}
          fontSize={{ xs: 20, sm: 22, md: 24 }}
          lineHeight={1.15}
        >
          History
        </Typography>
      </Box>

      <Grid
        container
        spacing={3}
        sx={{
          p: {
            xs: 1,
            md: 1,
          },
        }}
      >
        {purchaseItems.map((item, index) => (
          <Grid key={item.label}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 3,
                p: 2,
                borderRadius: "18px",
                transition: "0.3s",
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
                  color: "primary.main",
                  background: "rgba(99,102,241,0.12)",
                }}
              >
                {item.icon}
              </Box>

              <Box>
                <Typography
                  variant="h6"
                  fontWeight={700}
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: 18, sm: 24, md: 24 },
                    lineHeight: 1.2,
                  }}
                >
                  {item.value}
                </Typography>

                <Typography variant="caption" color="text.secondary">
                  {item.label}
                </Typography>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default PurchaseHistory;
