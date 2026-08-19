import { Box, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getMethod } from "../../api/login";
import Layout from "../../components/Layout";
import Earnings_Limit from "./Earnings_Limit";
import Earnings_Overall from "./Earnings_Overall";
import Purchase from "./Purchase";
import WalletStats from "./WalletStats";
import WelcomeCard from "./Welcomecard";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await getMethod("/api/dashboard/info");

      if (result.error) {
        toast.error(result.error?.message || "Dashboard Fetch failed.");
      } else {
        setData(result?.data);
      }
    } catch (err) {
      toast.error(err.message || "Dashboard Fetch failed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
            Loading dashboard...
          </Typography>
        </Box>
      </Layout>
    );
  }

  if (!data) {
    return <Typography>No dashboard data</Typography>;
  }

  const user = data?.userSnapshot || {};
  const wallet = data?.walletSnapshot || {};
  const earnings = data?.earningsPanel || {};
  const packages = data?.packagePanel || {};

  return (
    <Layout>
      <Grid
        container
        spacing={3}
        sx={{
          px: {
            xs: 0, // 16px on mobile
            sm: 0, // 24px on tablet
            md: 6, // 32px on desktop
          },
        }}
      >
        <Grid size={{ xs: 12, md: 12 }}>
          <WelcomeCard user={user} />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <WalletStats wallet={wallet} />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Earnings_Limit data={data?.earningsPanel.overall} />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Earnings_Overall earnings={earnings} />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Purchase packages={packages} />
        </Grid>
      </Grid>
    </Layout>
  );
};

export default Dashboard;
