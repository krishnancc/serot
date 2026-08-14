import { Box, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getMethod } from "../../api/login";
import Layout from "../../components/Layout";
import Header from "./Header";
import Packages from "./Packages";
import PurchaseHistory from "./PurchaseHistory";
import PurchaseHistroyTable from "./PurchaseHistroyTable";
const PurchasePage = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedPackage, setSelectedPackage] = useState(null);

    // ===== Purchase History (DataGrid) =====
    const [purchaseRows, setPurchaseRows] = useState([]);
    const [purchaseRowCount, setPurchaseRowCount] = useState(0);
    const [purchaseLoading, setPurchaseLoading] = useState(false);

    const [purchasePage, setPurchasePage] = useState(0);
    const [purchasePageSize, setPurchasePageSize] = useState(10);

    const [purchaseSortField, setPurchaseSortField] = useState('createdAt');
    const [purchaseSortOrder, setPurchaseSortOrder] = useState('desc');

    const handleSuccess = () => {
        fetchPackages();
        fetchPurchaseHistory();
    };

    const fetchPurchaseHistory = async () => {
        try {
            setPurchaseLoading(true);

            const res = await getMethod(
                `/api/packages/history?page=${purchasePage}&pageSize=${purchasePageSize}&sortField=${purchaseSortField}&sortOrder=${purchaseSortOrder}`
            );

            if (res?.error) {
                toast.error(res?.message || 'Failed to load purchase history');
                return;
            }

            setPurchaseRows(res.rows || []);
            setPurchaseRowCount(res.rowCount || 0);

        } catch (err) {
            toast.error(err.message || 'Failed to load purchase history');
        } finally {
            setPurchaseLoading(false);
        }
    };

    const fetchPackages = async () => {
        try {
            setLoading(true);
            const result = await getMethod('/api/packages/info');
            console.log('Packages Result', result?.data);

            if (result?.error) {
                toast.error(result?.message || 'Failed to load packages data');
            } else {
                setData(result?.data);
            }
        } catch (err) {
            toast.error(err.message || 'Failed to load packages data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPackages();
    }, []);

    useEffect(() => {
        fetchPurchaseHistory();
    }, [
        purchasePage,
        purchasePageSize,
        purchaseSortField,
        purchaseSortOrder
    ]);


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
                        Loading Purchase...
                    </Typography>
                </Box>
            </Layout>
        );
    }

    if (!data) {
        return <Typography>No Packages data</Typography>;
    }

    const packages = data.packages;
    // const purchases = data.purchases;
    const wallet = data.walletReadiness;
    const progress = data.packageProgress;

    // Restriction to purchase only starter package
    const userHasPurchased = purchaseRows?.length > 0;
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
                    <Packages
                        data={packages}
                        wallet={wallet}
                        handleSuccess={handleSuccess}
                        progress={progress}
                    />
                </Grid>

                <Grid container size={{ xs: 12 }}>
                    <Grid size={{ xs: 12, sm: 12, md: 9 }}>
                        <PurchaseHistroyTable
                            purchaseRows={purchaseRows}
                            purchaseLoading={purchaseLoading}
                            purchasePage={purchasePage}
                            purchasePageSize={purchasePageSize}
                            purchaseRowCount={purchaseRowCount}
                            setPurchasePage={setPurchasePage}
                            setPurchasePageSize={setPurchasePageSize}
                            setPurchaseSortField={setPurchaseSortField}
                            setPurchaseSortOrder={setPurchaseSortOrder}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 12, md: 3 }}>
                        <PurchaseHistory progress={progress} />
                    </Grid>
                </Grid>

            </Grid>
        </Layout>
    );
};

export default PurchasePage;