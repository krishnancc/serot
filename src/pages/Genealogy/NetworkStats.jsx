import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import LayersRoundedIcon from '@mui/icons-material/LayersRounded';
import { alpha, Box, Typography } from '@mui/material';

/* ================= THEME ================= */
const PRIMARY = '#6366F1';
const SUCCESS = '#10B981';
const WARNING = '#F59E0B';
const INFO = '#0EA5E9';

const TEXT = '#0F172A';
const MUTED = '#64748B';


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
                position: 'relative',
                p: {
                    xs: 2,
                    sm: 2.5,
                    md: 3,
                    xl: 3.5,
                },

                borderRadius: {
                    xs: 3,
                    md: 4,
                },

                overflow: 'hidden',

                display: 'flex',
                flexDirection: 'column',

                background:
                    `linear-gradient(145deg,
                    ${alpha(accent, 0.15)},
                    rgba(255,255,255,0.92))`,

                backdropFilter: 'blur(18px)',

                border:
                    `1px solid ${alpha(accent, 0.18)}`,

                transition: 'all .35s ease',

                '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow:
                        `0 8px 40px ${alpha(accent, 0.1)}`,
                },

                '@media (hover:none)': {
                    '&:hover': {
                        transform: 'none',
                    },
                },


                '&:before': {
                    content: '""',

                    position: 'absolute',

                    width: {
                        xs: 100,
                        md: 130,
                        xl: 150,
                    },

                    height: {
                        xs: 100,
                        md: 130,
                        xl: 150,
                    },

                    right: -35,
                    top: -35,

                    borderRadius: '50%',

                    background:
                        alpha(accent, 0.12),
                },
            }}
        >


            {/* ICON */}
            <Box
                sx={{
                    position: 'absolute',

                    top: {
                        xs: 12,
                        sm: 14,
                        md: 20,
                        xl: 22,
                    },

                    right: {
                        xs: 12,
                        sm: 14,
                        md: 20,
                        xl: 22,
                    },

                    width: {
                        xs: 32,
                        sm: 36,
                        md: 46,
                        xl: 50,
                    },

                    height: {
                        xs: 32,
                        sm: 36,
                        md: 46,
                        xl: 50,
                    },

                    borderRadius: {
                        xs: 2.5,
                        md: 3,
                    },

                    display: 'flex',

                    alignItems: 'center',

                    justifyContent: 'center',

                    color: accent,

                    background:
                        alpha(accent, 0.15),

                    border:
                        `1px solid ${alpha(accent, 0.15)}`,

                    boxShadow:
                        `0 8px 20px ${alpha(accent, 0.18)}`,

                    zIndex: 2,


                    '& svg': {
                        fontSize: {
                            xs: 20,
                            sm: 24,
                            md: 30,
                            xl: 32,
                        },
                    },
                }}
            >
                {icon}
            </Box>



            {/* CONTENT */}
            <Box
                sx={{
                    position: 'relative',
                    zIndex: 1,

                    height: '100%',

                    display: 'flex',

                    flexDirection: 'column',

                    justifyContent: 'space-between',
                }}
            >


                {/* TITLE */}
                <Typography
                    sx={{
                        fontSize: {
                            xs: 11,
                            sm: 12,
                            md: 13.5,
                            xl: 14.5,
                        },

                        fontWeight: 800,

                        letterSpacing: {
                            xs: .4,
                            md: .7,
                        },

                        color: MUTED,

                        textTransform: 'uppercase',

                        pr: {
                            xs: 4.5,
                            md: 6.5,
                        },

                        lineHeight: 1.3,

                        wordBreak: 'break-word',
                    }}
                >
                    {title}
                </Typography>



                {/* VALUE */}
                <Box
                    sx={{
                        mt: {
                            xs: 3,
                            md: 3
                        },
                    }}
                >

                    <Typography
                        sx={{
                            fontSize: {
                                xs: 26,
                                sm: 32,
                                md: 42,
                                xl: 48,
                            },

                            fontWeight: 900,

                            lineHeight: 1,

                            letterSpacing: -1,

                            color: TEXT,
                        }}
                    >
                        {value || 0}
                    </Typography>



                    <Typography
                        sx={{
                            mt: {
                                xs: .5,
                                md: 1,
                            },

                            fontSize: {
                                xs: 10,
                                sm: 11.5,
                                md: 13.5,
                                xl: 14.5,
                            },

                            fontWeight: 600,

                            color: MUTED,

                            lineHeight: 1.3,
                        }}
                    >
                        {subtitle}
                    </Typography>


                </Box>


            </Box>


        </Box>
    );
};



/* ================= MAIN ================= */

const NetworkStats = ({ network }) => {


    const stats = [
        {
            title: 'TOTAL DOWNLINE',
            value: network?.totalDownline,
            icon: <GroupsRoundedIcon />,
            accent: PRIMARY,
            subtitle: 'Members in network',
        },

        {
            title: 'ACTIVE MEMBERS',
            value: network?.activeDownline,
            icon: <CheckCircleRoundedIcon />,
            accent: SUCCESS,
            subtitle: 'Growing community',
        },

        {
            title: 'INACTIVE MEMBERS',
            value: network?.inactiveDownline,
            icon: <CancelRoundedIcon />,
            accent: WARNING,
            subtitle: 'Requires activation',
        },

        {
            title: 'NETWORK DEPTH',
            value: network?.maxDepth,
            icon: <LayersRoundedIcon />,
            accent: INFO,
            subtitle: 'Maximum levels',
        },
    ];



    return (

        <Box
            sx={{
                display: 'grid',

                gridTemplateColumns: {
                    xs: 'repeat(2,minmax(0,1fr))',

                    sm: 'repeat(2,minmax(0,1fr))',

                    md: 'repeat(4,minmax(0,1fr))',
                },

                gap: {
                    xs: 1.5,
                    sm: 2,
                    md: 2.5,
                    xl: 3,
                },

                mb: {
                    xs: 3,
                    md: 2,
                },
            }}
        >

            {
                stats.map((item, index) => (
                    <StatItem
                        key={index}
                        {...item}
                    />
                ))
            }


        </Box>

    );
};


export default NetworkStats;