import {
    Box,
    Divider,
    Grid,
    Paper,
    Typography,
} from "@mui/material";

import AttachMoneyRoundedIcon from "@mui/icons-material/AttachMoneyRounded";
import PendingActionsRoundedIcon from "@mui/icons-material/PendingActionsRounded";
import ShoppingBagRoundedIcon from "@mui/icons-material/ShoppingBagRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";


const Purchase = ({ packages = {} }) => {

    const purchaseItems = [
        {
            label: "Total Purchased",
            value: `${packages.totalPackagesPurchased || 0} Nos`,
            icon: <ShoppingBagRoundedIcon />,
        },
        {
            label: "Purchased Value",
            value: `$ ${packages.totalPurchasedUsd || 0}`,
            icon: <AttachMoneyRoundedIcon />,
        },
        {
            label: "ROI Earned",
            value: `$ ${packages.roiEarned || 0}`,
            icon: <TrendingUpRoundedIcon />,
        },
        {
            label: "ROI Pending",
            value: `$ ${packages.roiPending || 0}`,
            icon: <PendingActionsRoundedIcon />,
        },
    ];


    return (
        <Paper
            elevation={0}
            sx={{
                p: {
                    xs: 2.5,
                    md: 4,
                },
                borderRadius: "28px",
                border: "1px solid",
                borderColor: "divider",
                background:
                    "linear-gradient(145deg, rgba(255,255,255,0.9), rgba(248,250,252,0.8))",
            }}
        >

            {/* Header */}

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 4,
                }}
            >

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
                        Purchases
                    </Typography>

                    <Typography
                        color="text.secondary"
                        sx={{
                            fontSize: {
                                xs: 14,
                                sm: 13,
                                md: 14,
                            },
                        }}
                    >
                        Your investment summary
                    </Typography>
                </Box>


                <Box
                    sx={{
                        width: 46,
                        height: 46,
                        borderRadius: "16px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        background:
                            "linear-gradient(135deg,#667eea,#764ba2)",
                    }}
                >
                    <ShoppingBagRoundedIcon />
                </Box>

            </Box>



            <Divider sx={{ mb: 3 }} />



            {/* Stats */}

            <Grid container spacing={3}>

                {purchaseItems.map((item, index) => (

                    <Grid
                        key={item.label}
                        size={{
                            xs: 12,
                            sm: 6,
                            md: 3,
                        }}
                    >

                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 2,
                                p: 2,
                                borderRadius: "18px",
                                transition: "0.3s",

                                "&:hover": {
                                    background:
                                        "rgba(99,102,241,0.06)",
                                }
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
                                    background:
                                        "rgba(99,102,241,0.12)",
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
                                        fontSize: { xs: 18, sm: 24, md: 28 },
                                        lineHeight: 1.2,
                                        mr: 0.5,
                                    }}
                                >
                                    {item.value}
                                </Typography>


                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
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


export default Purchase;