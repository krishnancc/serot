import {
    Box,
    Grid,
    Typography
} from '@mui/material';
import { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import { getMethod } from '../../api/login';
import Layout from "../../components/Layout";
import Earnings_Limit from './Earnings_Limit';
import Earnings_Overall from './Earnings_Overall';
import Purchase from './Purchase';
// import Wallet_Info from "./Wallet_Info";
import WalletStats from './WalletStats';
import WelcomeCard from "./Welcomecard";

const Dashboard = () => {

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            setLoading(true);
            const result = await getMethod('/api/dashboard/info');
            console.log("Dashboard Info ", result);

            if (result.error) {
                toast.error(result.message || 'Dashboard Fetch failed.');
            } else {
                setData(result?.data);
            }
        } catch (err) {
            toast.error(err.message || 'Dashboard Fetch failed.');
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
                {/* <Box
                    sx={{
                        minHeight: "60vh",
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Stack
                        alignItems="center"
                        spacing={2}
                    >
                        <Box
                            sx={{
                                position: "relative",
                                width: 60,
                                height: 60,
                            }}
                        >
                            {[0, 1, 2].map((item) => (
                                <Box
                                    key={item}
                                    sx={{
                                        position: "absolute",
                                        width: 14,
                                        height: 14,
                                        borderRadius: "50%",
                                        background: "#2563eb",
                                        top: "50%",
                                        left: `${item * 20 + 10}px`,
                                        transform: "translateY(-50%)",
                                        animation: "bounce 1.2s infinite",
                                        animationDelay: `${item * 0.15}s`,
                                        "@keyframes bounce": {
                                            "0%,100%": {
                                                transform: "translateY(-50%) scale(0.8)",
                                                opacity: 0.5,
                                            },
                                            "50%": {
                                                transform: "translateY(-80%) scale(1.2)",
                                                opacity: 1,
                                            },
                                        },
                                    }}
                                />
                            ))}
                        </Box>

                        <Typography
                            sx={{
                                fontWeight: 600,
                                color: "#475569",
                                fontSize: "14px",
                                letterSpacing: "0.5px",
                            }}
                        >
                            Preparing your dashboard...
                        </Typography>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Please wait a moment
                        </Typography>
                    </Stack>
                </Box> */}
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

    console.log("Earnings", earnings);

    console.log('user', user);

    console.log("Earnigns : ", data);

    return (
        <Layout>
            <Grid
                container
                spacing={3}
                sx={{
                    px: {
                        xs: 0,   // 16px on mobile
                        sm: 0,   // 24px on tablet
                        md: 6,   // 32px on desktop
                    },
                }}
            >
                <Grid size={{ xs: 12, md: 12 }}>
                    <WelcomeCard user={user} />
                </Grid>
                {/* <Grid size={{ xs: 12, md: 12 }}>
                    <Welcomecard user={user} />
                </Grid> */}

                <Grid size={{ xs: 12 }}>
                    <WalletStats wallet={wallet} />
                    {/* <Wallet_Info wallet={wallet} /> */}
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