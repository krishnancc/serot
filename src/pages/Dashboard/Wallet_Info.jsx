import React from "react";

import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import AttachMoneyRoundedIcon from "@mui/icons-material/AttachMoneyRounded";
import CurrencyBitcoinRoundedIcon from "@mui/icons-material/CurrencyBitcoinRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import WalletRoundedIcon from "@mui/icons-material/WalletRounded";
import {
    Box,
    Card,
    Grid,
    Stack,
    Typography,
} from "@mui/material";

const Wallet_Info = ({ wallet }) => {
    const cards = [
        {
            title: "Main Wallet",
            value: wallet.mainUsd,
            icon: <WalletRoundedIcon />,
            color: "#2563eb",
            gradient: "linear-gradient(135deg,#2563eb,#38bdf8)",
        },
        {
            title: "Fund Wallet",
            value: wallet.fundUsd,
            icon: <AccountBalanceWalletRoundedIcon />,
            color: "#9333ea",
            gradient: "linear-gradient(135deg,#9333ea,#e879f9)",
        },
        {
            title: "Crypto Wallet",
            value: wallet.cryptoUsd,
            icon: <CurrencyBitcoinRoundedIcon />,
            color: "#f59e0b",
            gradient: "linear-gradient(135deg,#f59e0b,#facc15)",
        },
        {
            title: "Total Balance",
            value: wallet.totalUsd,
            icon: <AttachMoneyRoundedIcon />,
            color: "#10b981",
            gradient: "linear-gradient(135deg,#10b981,#34d399)",
        },
    ];

    return (
        <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }} mb={{ xs: 2, md: 3 }}>
            {cards.map((item) => (
                <Grid key={item.title} size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card
                        sx={{
                            position: "relative",
                            overflow: "hidden",
                            borderRadius: { xs: "20px", sm: "24px", md: "28px" },
                            p: { xs: 2, sm: 2.2, md: 2.5 },
                            minHeight: { xs: "auto", md: 170 },
                            background: "linear-gradient(145deg,#ffffff,#f8fafc)",
                            border: "1px solid rgba(255,255,255,.8)",
                            boxShadow: "0 12px 35px rgba(15,23,42,.06)",
                            transition: ".35s",

                            "&:hover": {
                                transform: "translateY(-8px)",
                                boxShadow: "0 22px 55px rgba(15,23,42,.15)",
                            },

                            "&:before": {
                                content: '""',
                                position: "absolute",
                                width: 220,
                                height: 220,
                                right: -90,
                                top: -90,
                                borderRadius: "50%",
                                background: item.gradient,
                                opacity: 0.12,
                            },

                            "&:after": {
                                content: '""',
                                position: "absolute",
                                width: 120,
                                height: 120,
                                left: -50,
                                bottom: -50,
                                borderRadius: "50%",
                                background: item.gradient,
                                opacity: 0.08,
                            },
                        }}
                    >
                        <Stack
                            spacing={{ xs: 1.8, sm: 2.2, md: 2.5 }}
                            sx={{
                                position: "relative",
                                zIndex: 2,
                                height: "100%",
                            }}
                        >
                            {/* Top Section */}
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "flex-start",
                                    width: "100%",
                                }}
                            >
                                {/* Left Icon */}
                                <Box
                                    sx={{
                                        width: { xs: 48, sm: 56, md: 64 },
                                        height: { xs: 48, sm: 56, md: 64 },
                                        borderRadius: { xs: "14px", sm: "17px", md: "20px" },
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        background: item.gradient,
                                        color: "#fff",
                                        flexShrink: 0,
                                        boxShadow: `0 14px 35px ${item.color}55`,
                                    }}
                                >
                                    {React.cloneElement(item.icon, {
                                        sx: { fontSize: { xs: 24, sm: 28, md: 32 } },
                                    })}
                                </Box>

                                {/* Right ROI */}
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 0.8,
                                        px: { xs: 1.2, md: 1.6 },
                                        py: { xs: 0.5, md: 0.7 },
                                        borderRadius: "30px",
                                        background: `${item.color}15`,
                                        border: `1px solid ${item.color}30`,
                                        color: item.color,
                                        fontWeight: 700,
                                        fontSize: "12px",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    <TrendingUpRoundedIcon sx={{ fontSize: { xs: 15, md: 18 } }} />
                                    <Typography
                                        sx={{
                                            fontSize: "12px",
                                            fontWeight: 800,
                                            color: item.color,
                                            lineHeight: 1,
                                        }}
                                    >
                                        ROI
                                    </Typography>
                                </Box>
                            </Box>

                            {/* Wallet Name */}
                            <Typography
                                sx={{
                                    fontWeight: 700,
                                    fontSize: { xs: "14px", sm: "15px", md: "16px" },
                                    color: "#64748b",
                                }}
                            >
                                {item.title}
                            </Typography>

                            {/* Amount */}
                            <Typography
                                sx={{
                                    fontSize: {
                                        xs: "24px",
                                        sm: "27px",
                                        md: "32px",
                                    },
                                    fontWeight: 900,
                                    color: "#0f172a",
                                    lineHeight: 1.1,
                                    letterSpacing: "-1px",
                                    wordBreak: "break-word",
                                }}
                            >
                                $ {Number(item.value || 0).toLocaleString()}
                            </Typography>


                            {/* Footer */}
                            {/* <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}
                            >
                                <Typography
                                    variant="caption"
                                    sx={{
                                        color: "#94a3b8",
                                        fontWeight: 600,
                                    }}
                                >
                                    Available Balance
                                </Typography>

                                <Typography
                                    variant="caption"
                                    sx={{
                                        color: item.color,
                                        fontWeight: 700,
                                    }}
                                >
                                    USD
                                </Typography>
                            </Box> */}
                        </Stack>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
};

export default Wallet_Info;

//   <Box
//         sx={{
//             position: "relative",
//             p: { xs: 2, sm: 2.5, md: 3 },
//             borderRadius: { xs: 3, md: 4 },
//             overflow: "hidden",

//             background: `linear-gradient(
//                 145deg,
//                 ${alpha(accent, 0.15)},
//                 rgba(255,255,255,.96)
//             )`,

//             border: `1px solid ${alpha(accent, 0.18)}`,
//             backdropFilter: "blur(18px)",

//             transition: "all .35s ease",

//             "&:hover": {
//                 transform: "translateY(-5px)",
//                 boxShadow: `0 12px 35px ${alpha(accent, 0.18)}`
//             },

//             "@media (hover:none)": {
//                 "&:hover": {
//                     transform: "none"
//                 }
//             },

//             "&::before": {
//                 content: '""',
//                 position: "absolute",
//                 width: { xs: 110, md: 140 },
//                 height: { xs: 110, md: 140 },
//                 top: -35,
//                 right: -35,
//                 borderRadius: "50%",
//                 background: alpha(accent, 0.1)
//             }
//         }}
//     >
//         {/* Icon */}
//         <Box
//             sx={{
//                 position: "absolute",
//                 top: { xs: 12, md: 18 },
//                 right: { xs: 12, md: 18 },

//                 width: { xs: 40, md: 48 },
//                 height: { xs: 40, md: 48 },

//                 borderRadius: 3,

//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",

//                 color: accent,
//                 background: alpha(accent, 0.15),
//                 border: `1px solid ${alpha(accent, 0.2)}`,

//                 "& svg": {
//                     fontSize: { xs: 22, md: 28 }
//                 }
//             }}
//         >
//             {icon}
//         </Box>

//         <Box position="relative" zIndex={2}>
//             <Typography
//                 sx={{
//                     fontSize: { xs: 11, md: 13 },
//                     fontWeight: 800,
//                     color: MUTED,
//                     textTransform: "uppercase",
//                     letterSpacing: 1,
//                     pr: 6
//                 }}
//             >
//                 {title}
//             </Typography>

//             <Typography
//                 sx={{
//                     mt: 3,
//                     fontSize: { xs: 30, md: 42 },
//                     fontWeight: 900,
//                     color: TEXT,
//                     lineHeight: 1
//                 }}
//             >
//                 ${Number(value || 0).toLocaleString()}
//             </Typography>

//             <Typography
//                 sx={{
//                     mt: 1,
//                     fontSize: { xs: 11, md: 13 },
//                     fontWeight: 600,
//                     color: MUTED
//                 }}
//             >
//                 {subtitle}
//             </Typography>
//         </Box>
//     </Box>