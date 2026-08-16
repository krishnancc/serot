import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Grid,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

import Layout from "../../components/Layout";
import Header from "./Header";

import { getMethod, postMethod } from "../../api/login";
import RewardStats from "./RewardStats";
import RewardsTable from "./RewardsTable";

const Rewards = () => {
  const [rows, setRows] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [redeemingId, setRedeemingId] = useState(null);

  const fetchRewards = async () => {
    try {
      setLoading(true);

      const res = await getMethod("/api/income/reward/get-list");

      if (!res?.success) {
        toast.error(res.error?.message || "Failed to load rewards");
        return;
      }

      setRows(res.data?.rewards || []);
      setStats(res.data?.stats || []);
    } catch (err) {
      toast.error(err.message || "Failed to load rewards");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRewards();
  }, []);

  const handleRedeem = useCallback(async (rewardId) => {
    try {
      setRedeemingId(rewardId);

      const res = await postMethod("/api/income/reward/redeem", {
        rewardId,
      });

      if (!res?.success) {
        toast.error(res.error?.message || "Redeem failed");
        return;
      }

      toast.success(res.message || "Reward redeemed successfully");

      fetchRewards();
    } catch (err) {
      toast.error(err.message || "Redeem failed");
    } finally {
      setRedeemingId(null);
    }
  }, []);

  const formatUSD = (value) => {
    if (!value) return "0";

    const num = Number(value) / 1e12;

    return num.toLocaleString();
  };

  const columns = useMemo(
    () => [
      {
        field: "requiredDirects",
        headerName: "Directs",
        width: 160,
        renderCell: ({ value }) => (
          <Box
            sx={{
              px: 1.2,
              py: 0.4,
              borderRadius: 2,
              fontWeight: 700,
              fontSize: 14,
            }}
          >
            {value}
          </Box>
        ),
      },

      {
        field: "requiredVolumeUSD",
        headerName: "Volume Per Direct",
        width: 190,
        align: "left",
        headerAlign: "left",

        renderCell: ({ value }) => (
          <Box
            sx={{
              px: 1.2,
              py: 0.4,
              borderRadius: 2,
              fontWeight: 700,
              fontSize: 14,
            }}
          >
            $ {formatUSD(value)}
          </Box>
        ),
      },

      {
        field: "rewardAmountUSD",
        headerName: "Reward Amount",
        width: 190,
        align: "left",
        headerAlign: "left",

        renderCell: ({ value }) => (
          <Box
            sx={{
              px: 1.2,
              py: 0.4,
              borderRadius: 2,
              fontWeight: 700,
              fontSize: 14,
              color: value > 0 ? "success.main" : "text.primary",
            }}
          >
            $ {formatUSD(value) || "-"}
          </Box>
        ),
      },

      {
        field: "rewardItem",
        headerName: "Item",
        width: 190,
        align: "left",
        headerAlign: "left",

        renderCell: ({ value }) => (
          <Box
            sx={{
              px: 1.2,
              py: 0.4,
              borderRadius: 2,
              fontWeight: 700,
              fontSize: 14,
            }}
          >
            {value || "—"}
          </Box>
        ),
      },

      {
        field: "status",
        headerName: "Status",
        width: 190,
        align: "center",
        headerAlign: "center",

        renderCell: ({ value }) => {
          const color =
            value === "GIVEN"
              ? "success"
              : value === "APPROVED"
                ? "info"
                : value === "PENDING"
                  ? "warning"
                  : "default";

          return <Chip label={value} color={color} size="small" />;
        },
      },

      {
        field: "action",
        headerName: "Action",
        width: 190,
        align: "right",
        headerAlign: "right",

        renderCell: ({ row }) =>
          row.canRedeem ? (
            <Button
              size="small"
              variant="contained"
              onClick={() => handleRedeem(row.userRewardId)}
              disabled={redeemingId === row.userRewardId}
              startIcon={
                redeemingId === row.userRewardId ? (
                  <CircularProgress size={14} />
                ) : (
                  "🎁"
                )
              }
            >
              Redeem
            </Button>
          ) : (
            "—"
          ),
      },
    ],
    [redeemingId, handleRedeem],
  );
  if (loading) {
    return (
      <Layout>
        <Box
          sx={{
            minHeight: "60vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Box
            sx={{
              width: 55,
              height: 55,
              borderRadius: "50%",
              border: "5px solid #e2e8f0",
              borderTop: "5px solid #2563eb",
              animation: "spin 1s linear infinite",
              "@keyframes spin": {
                "0%": {
                  transform: "rotate(0deg)",
                },
                "100%": {
                  transform: "rotate(360deg)",
                },
              },
            }}
          />

          <Typography
            sx={{
              fontSize: 14,
              fontWeight: 600,
              color: "#475569",
            }}
          >
            Loading Rewards...
          </Typography>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Grid
        container
        spacing={3}
        sx={{
          px: {
            xs: 0,
            sm: 0,
            md: 6,
          },
        }}
      >
        <Grid size={{ xs: 12 }}>
          <Header />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <RewardStats stats={stats} />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <RewardsTable rows={rows} columns={columns} loading={loading} />
        </Grid>
      </Grid>
    </Layout>
  );
};

export default Rewards;
