import Layout from "../../components/Layout";

import { Box, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getMethod } from "../../api/login";
import Earnings from "./Earnings";
import GenelogyTable from "./GenelogyTable";
import Header from "./header";
import NetworkStats from "./NetworkStats";

const Genealogy = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [referralId, setReferralId] = useState("");

  const [currentRootId, setCurrentRootId] = useState(null);
  const [drillHistory, setDrillHistory] = useState([]);

  const [drillDown, setDrillDown] = useState([]);
  const [drillLoading, setDrillLoading] = useState(false);

  const fetchDrillDownline = async (rootUserId, depth = 10) => {
    try {
      setDrillLoading(true);
      const res = await getMethod(
        `/api/mlmTree/drill?rootUserId=${rootUserId}&depth=${depth}`,
      );

      if (res?.error) {
        toast.error(res.error?.message || "Failed to load drill data");
      } else {
        setDrillDown(res.data || []);
      }
    } catch (err) {
      toast.error(err.message || "Failed to load drill data");
    } finally {
      setDrillLoading(false);
    }
  };

  const fetchGenealogy = async () => {
    try {
      setLoading(true);
      const res = await getMethod("/api/mlmTree/info");

      if (res?.error) {
        toast.error(res.error?.message || "Failed to load genealogy data");
        return;
      }

      setData(res.data);

      const sponsorSuperId = String(res.data?.me?.superId || "");
      setReferralId(sponsorSuperId);

      const rootUserId = res.data?.me?.userId;
      if (rootUserId) {
        setCurrentRootId(rootUserId);
        fetchDrillDownline(rootUserId, 10);
      }
    } catch (err) {
      toast.error(err.message || "Failed to load genealogy data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGenealogy();
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
            Loading Geneology...
          </Typography>
        </Box>
      </Layout>
    );
  }

  if (!data) {
    return <Typography>No genealogy data</Typography>;
  }

  const { network = {}, earnings = {}, me = {} } = data;

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
          <NetworkStats network={network} />
        </Grid>

        {/* Two columns row */}
        <Grid size={{ xs: 12, md: 9 }}>
          <GenelogyTable
            referralId={referralId}
            drillDown={drillDown}
            drillLoading={drillLoading}
            currentRootId={currentRootId}
            drillHistory={drillHistory}
            setDrillDown={setDrillDown}
            setCurrentRootId={setCurrentRootId}
            setDrillHistory={setDrillHistory}
            fetchDrillDownline={fetchDrillDownline}
            fetchGenealogy={fetchGenealogy}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <Earnings earnings={earnings} />
        </Grid>
      </Grid>
    </Layout>
  );
};

export default Genealogy;
