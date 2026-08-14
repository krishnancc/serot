import {
    Box,
    Grid,
    Typography,
    alpha
} from "@mui/material";

import EmojiEventsRoundedIcon from "@mui/icons-material/EmojiEventsRounded";
import RedeemRoundedIcon from "@mui/icons-material/RedeemRounded";
import WorkspacePremiumRoundedIcon from "@mui/icons-material/WorkspacePremiumRounded";


/* ================= THEME ================= */
const SUCCESS = "#10B981";
const WARNING = "#F59E0B";
const INFO = "#0EA5E9";

const TEXT = "#0F172A";
const MUTED = "#64748B";


/* ================= STAT ITEM ================= */
const StatItem = ({
    title,
    value,
    icon,
    accent,
    subtitle
}) => {
    return (
        <Box
            sx={{
                position: "relative",
                p: {
                    xs: 2,
                    sm: 2.5,
                    md: 3
                },
                // minHeight: {
                //     xs: 150,
                //     md: 180
                // },
                borderRadius: {
                    xs: 3,
                    md: 4
                },
                overflow: "hidden",

                background:
                    `linear-gradient(145deg,
                    ${alpha(accent, 0.15)},
                    rgba(255,255,255,0.95))`,

                backdropFilter: "blur(18px)",

                border:
                    `1px solid ${alpha(accent, 0.18)}`,

                transition: "all .35s ease",

                "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow:
                        `0 12px 35px ${alpha(accent, 0.15)}`
                },

                "@media (hover:none)": {
                    "&:hover": {
                        transform: "none"
                    }
                },


                "&:before": {
                    content: '""',
                    position: "absolute",

                    width: {
                        xs: 110,
                        md: 140
                    },

                    height: {
                        xs: 110,
                        md: 140
                    },

                    right: -35,
                    top: -35,

                    borderRadius: "50%",

                    background:
                        alpha(accent, 0.12)
                }
            }}
        >

            {/* ICON */}
            <Box
                sx={{
                    position: "absolute",

                    top: {
                        xs: 12,
                        md: 18
                    },

                    right: {
                        xs: 12,
                        md: 18
                    },

                    width: {
                        xs: 38,
                        md: 48
                    },

                    height: {
                        xs: 38,
                        md: 48
                    },

                    borderRadius: 3,

                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",

                    color: accent,

                    background:
                        alpha(accent, 0.15),

                    border:
                        `1px solid ${alpha(accent, 0.18)}`,

                    "& svg": {
                        fontSize: {
                            xs: 22,
                            md: 30
                        }
                    }
                }}
            >
                {icon}
            </Box>


            {/* CONTENT */}
            <Box
                sx={{
                    position: "relative",
                    zIndex: 2
                }}
            >

                <Typography
                    sx={{
                        fontSize: {
                            xs: 11,
                            md: 13
                        },

                        fontWeight: 800,

                        color: MUTED,

                        letterSpacing: 0.8,

                        textTransform: "uppercase",

                        pr: 6
                    }}
                >
                    {title}
                </Typography>



                <Typography
                    sx={{
                        mt: {
                            xs: 3,
                            md: 3
                        },

                        fontSize: {
                            xs: 32,
                            md: 46
                        },

                        fontWeight: 900,

                        lineHeight: 1,

                        color: TEXT,

                        letterSpacing: -1
                    }}
                >
                    {value}
                </Typography>



                <Typography
                    sx={{
                        mt: 1,

                        fontSize: {
                            xs: 11,
                            md: 13
                        },

                        fontWeight: 600,

                        color: MUTED
                    }}
                >
                    {subtitle}
                </Typography>


            </Box>


        </Box>
    );
};



/* ================= MAIN ================= */

const RewardStats = ({ stats }) => {

    console.log(stats)
    const rewardData = [

        {
            title: "Total Eligible",
            value: stats?.total || 0,
            subtitle: "Members eligible for rewards",
            icon: <EmojiEventsRoundedIcon />,
            accent: WARNING
        },


        {
            title: "Achieved",
            value: stats?.achieved || 0,
            subtitle: "Rewards successfully achieved",
            icon: <WorkspacePremiumRoundedIcon />,
            accent: SUCCESS
        },


        {
            title: "Redeemed",
            value: stats?.redeemed || 0,
            subtitle: "Rewards already redeemed",
            icon: <RedeemRoundedIcon />,
            accent: INFO
        }

    ];



    return (

        <Grid
            container
            spacing={{
                xs: 2,
                md: 3
            }}
            mb={3}
        >

            {
                rewardData.map((item, index) => (

                    <Grid
                        key={index}
                        size={{
                            xs: 12,
                            sm: 6,
                            md: 4
                        }}
                    >

                        <StatItem
                            {...item}
                        />

                    </Grid>

                ))
            }


        </Grid>

    );
};


export default RewardStats;