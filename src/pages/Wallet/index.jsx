import { Box, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getMethod, postMethod } from "../../api/login";
import Layout from "../../components/Layout";
import Assets from "./Assets";
import Header from "./Header";
import LedgerTransactions from "./LedgerTransactions";
import WalletStats from "./WalletStats";


const Wallet = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const [syncing, setSyncing] = useState(false);


    const handleDepositSync = async () => {
        if (syncing) return;

        try {
            setSyncing(true);

            const res = await postMethod('/api/crypto/depositSync/sync');

            if (!res?.success) {
                toast.error(res?.message || 'Deposit sync failed');
                return;
            }

            toast.success(
                res.inserted > 0
                    ? `Synced ${res.inserted} new deposit(s)`
                    : 'No new deposits found'
            );

            // Refresh wallet + ledger after sync
            fetchWallet();
            // fetchLedger();
        } catch (err) {
            toast.error(err.message || 'Deposit sync failed');
        } finally {
            setSyncing(false);
        }
    };

    const fetchWallet = async () => {
        try {
            setLoading(true);
            const result = await getMethod('/api/wallet/info');
            console.log("Wallet Info ", result?.data);

            if (result?.error) {
                toast.error(result?.message || 'Failed to load wallet data');
            } else {
                setData(result?.data);
            }
        } catch (err) {
            toast.error(err.message || 'Failed to load wallet data');
        } finally {
            setLoading(false);
        }
    };

    const handleSuccess = () => {
        fetchWallet();
    };
    useEffect(() => {
        fetchWallet();
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
                        Loading Wallet...
                    </Typography>
                </Box>
            </Layout>
        );
    }
    if (!data) {
        return <Typography>No Wallet data</Typography>;
    }
    const { balances = {}, cryptoHoldings = {}, cryptos = [], user = {} } = data;

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
                    <Header loading={loading} setLoading={setLoading} />
                </Grid>

                <Grid size={{ xs: 12 }}>
                    <WalletStats balances={balances} cryptoHoldings={cryptoHoldings} cryptos={cryptos} user={user} />
                </Grid>

                <Grid size={{ xs: 12 }}>
                    <Assets handleSuccess={handleSuccess} cryptos={cryptos} balances={balances} user={user} handleDepositSync={handleDepositSync} syncing={syncing} />
                </Grid>

                <Grid size={{ xs: 12 }}>
                    <LedgerTransactions />
                </Grid>
            </Grid>
        </Layout>
    );
};

export default Wallet;