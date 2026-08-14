import {
    ShareRounded
} from "@mui/icons-material";
import {
    Box,
    Divider,
    Drawer,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography
} from "@mui/material";


import { useState } from "react";

import {
    AccountBalanceWalletRounded,
    AccountTreeRounded,
    CardGiftcardRounded,
    DashboardRounded,
    SettingsRounded,
    ShoppingCartRounded
} from "@mui/icons-material";


import {
    useLocation,
    useNavigate
} from "react-router-dom";


const drawerWidth = 260;


const menus = [

    {
        title: "Dashboard",
        icon: <DashboardRounded />,
        path: "/",
    },

    {
        title: "Purchase",
        icon: <ShoppingCartRounded />,
        path: "/purchase",
    },


    {
        title: "Genealogy",
        icon: <AccountTreeRounded />,
        path: "/genealogy",
    },

    {
        title: "Wallet",
        icon: <AccountBalanceWalletRounded />,
        path: "/wallet",
    },


    {
        title: "Rewards",
        icon: <CardGiftcardRounded />,
        path: "/reward",
    },


    {
        title: "Settings",
        icon: <SettingsRounded />,
        path: "/settings",
    },

];



const Sidebar = () => {

    const [copied, setCopied] = useState(false);


    const referralLink =
        "http://localhost:3000/register?ref=UN123456";



    const copyReferral = () => {

        navigator.clipboard.writeText(referralLink);

        setCopied(true);


        setTimeout(() => {

            setCopied(false);

        }, 2000);

    };



    const shareReferral = async () => {


        if (navigator.share) {

            await navigator.share({

                title: "Join Serot Network 🚀",

                text:
                    "Grow your business network with Serot",

                url: referralLink

            });

        }

        else {

            copyReferral();

        }

    };
    const navigate = useNavigate();

    const location = useLocation();



    return (

        <Drawer

            variant="permanent"

            sx={{

                width: drawerWidth,

                flexShrink: 0,


                display: {
                    xs: "none",
                    md: "block",
                },


                "& .MuiDrawer-paper": {

                    width: drawerWidth,

                    boxSizing: "border-box",

                    border: "none",

                    background:
                        "#ffffff",

                    boxShadow:
                        "4px 0 20px rgba(0,0,0,.05)",

                }

            }}

        >


            <Toolbar />

            <Divider />




            <List

                sx={{

                    px: 1.5,

                    mt: 2

                }}

            >


                {menus.map((item) => {


                    const active =
                        location.pathname === item.path;



                    return (


                        <ListItemButton


                            key={item.title}


                            onClick={() => navigate(item.path)}



                            sx={{


                                mb: 1,


                                borderRadius: 3,


                                minHeight: 48,



                                background: active

                                    ?

                                    "linear-gradient(135deg,#2563eb,#7c3aed)"

                                    :

                                    "transparent",




                                color: active
                                    ?

                                    "#fff"

                                    :

                                    "#475569",



                                transition: "0.3s",



                                "&:hover": {


                                    transform: "translateX(5px)",


                                    background: active

                                        ?

                                        "linear-gradient(135deg,#2563eb,#7c3aed)"

                                        :

                                        "#f1f5f9"

                                }



                            }}


                        >



                            <ListItemIcon


                                sx={{


                                    minWidth: 45,


                                    color: active

                                        ?

                                        "#fff"

                                        :

                                        "#2563eb"


                                }}

                            >

                                {item.icon}


                            </ListItemIcon>




                            <ListItemText


                                primary={item.title}


                                primaryTypographyProps={{


                                    fontWeight:
                                        active
                                            ?
                                            700
                                            :
                                            500,


                                }}


                            />



                        </ListItemButton>


                    )

                })}



            </List>




            <Box
                sx={{
                    mt: "auto",
                    p: 2
                }}
            >


                <Box

                    sx={{

                        p: 2.5,

                        borderRadius: 4,

                        background:
                            "linear-gradient(135deg,#2563eb,#7c3aed)",


                        color: "#fff",

                        position: "relative",

                        overflow: "hidden"

                    }}

                >



                    <Box
                        sx={{

                            position: "absolute",

                            width: 90,

                            height: 90,

                            borderRadius: "50%",

                            background: "rgba(255,255,255,.12)",

                            right: -30,

                            top: -25

                        }}
                    />




                    <Typography

                        fontWeight={800}

                        fontSize={17}

                    >

                        Grow Your Network 🚀

                    </Typography>



                    <Typography

                        fontSize={12}

                        sx={{

                            mt: 1,

                            opacity: .85

                        }}

                    >

                        Invite friends and earn rewards

                    </Typography>





                    {/* <Box

                        sx={{

                            mt: 2,

                            display: "flex",

                            alignItems: "center",

                            justifyContent: "space-between",

                            background: "rgba(255,255,255,.15)",

                            borderRadius: 3,

                            px: 1.5,

                            py: 1

                        }}

                    >


                        <Box>


                            <Typography

                                fontSize={11}

                                sx={{ opacity: .8 }}

                            >

                                Referral Code

                            </Typography>



                            <Typography

                                fontWeight={700}

                                fontSize={14}

                            >

                                UN123456

                            </Typography>


                        </Box>





                        <Tooltip

                            title={
                                copied
                                    ?
                                    "Copied!"
                                    :
                                    "Copy Link"
                            }

                        >


                            <IconButton

                                onClick={copyReferral}

                                sx={{

                                    color: "#fff",

                                    background:
                                        "rgba(255,255,255,.15)",


                                    "&:hover": {

                                        background:
                                            "rgba(255,255,255,.25)"

                                    }

                                }}

                            >

                                <ContentCopyRounded fontSize="small" />


                            </IconButton>


                        </Tooltip>


                    </Box> */}

                    <Box

                        onClick={shareReferral}

                        sx={{

                            mt: 2,

                            py: 1.2,

                            borderRadius: 3,

                            background: "#fff",

                            color: "#2563eb",

                            display: "flex",

                            alignItems: "center",

                            justifyContent: "center",

                            gap: 1,

                            cursor: "pointer",

                            fontWeight: 700,


                            transition: "0.3s",


                            "&:hover": {

                                transform: "translateY(-3px)"

                            }

                        }}

                    >


                        <ShareRounded fontSize="small" />


                        <Typography

                            fontWeight={700}

                            fontSize={14}

                        >

                            Share Referral

                        </Typography>



                    </Box>



                </Box>


            </Box>

        </Drawer>

    )

}


export default Sidebar;


export { drawerWidth };

