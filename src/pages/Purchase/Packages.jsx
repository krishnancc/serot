import { useMemo, useState } from "react";

import {
    AccountBalanceWalletRounded,
    AddRounded,
    ArrowForwardRounded,
    AutorenewRounded,
    CheckCircleRounded,
    CloseRounded,
    DeleteOutlineRounded,
    LockRounded,
    ShieldOutlined,
    ShoppingBagRounded,
    ShoppingCartOutlined,
    VerifiedRounded
} from "@mui/icons-material";
import {
    Box,
    Button,
    Chip,
    CircularProgress,
    Dialog,
    Divider,
    Grid,
    IconButton,
    Paper,
    Stack,
    Typography,
    useMediaQuery,
    useTheme
} from "@mui/material";

import {
    ErrorOutlineRounded
} from "@mui/icons-material";
import { toast } from "react-toastify";
import { postMethod } from "../../api/login";

/* =========================================================
   PACKAGE CARD
========================================================= */


function BottomFeature({
    icon,
    title,
    subtitle,
    color,
}) {
    return (
        <Stack
            direction="row"
            spacing={{ xs: 1, sm: 1.2 }}
            alignItems="center"
            sx={{
                flex: 1,
                minWidth: { xs: "auto", sm: 170 },
            }}
        >
            <Box
                sx={{
                    width: { xs: 34, sm: 38 },
                    height: { xs: 34, sm: 38 },
                    flexShrink: 0,
                    borderRadius: { xs: "9px", sm: "10px" },
                    background: `${color}12`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color,
                }}
            >
                {icon}
            </Box>

            <Box>
                <Typography
                    sx={{
                        fontSize: { xs: 11.5, sm: 12 },
                        fontWeight: 800,
                        color: "#172033",
                    }}
                >
                    {title}
                </Typography>

                <Typography
                    sx={{
                        fontSize: { xs: 10, sm: 10.5 },
                        color: "#717B8D",
                        mt: 0.25,
                    }}
                >
                    {subtitle}
                </Typography>
            </Box>
        </Stack>
    );
}


function PackageCard({
    item,
    quantity = 0,
    onAdd,
}) {
    const alreadyAdded = quantity > 0;

    return (
        <Paper
            elevation={0}
            sx={{
                position: "relative",
                height: "100%",
                overflow: "hidden",
                borderRadius: { xs: "13px", sm: "15px" },
                border: `1px solid ${item.popular || item.bestValue
                    ? item.borderColor
                    : "#E7EAF0"
                    }`,
                background: "#FFFFFF",
                transition: "all .25s ease",
                "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 14px 35px rgba(20, 35, 60, .09)",
                    borderColor: item.color,
                },
            }}
        >
            {/* Badge */}
            {(item.popular || item.bestValue) && (
                <Box
                    sx={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        px: { xs: 1.4, sm: 2 },
                        py: { xs: 0.6, sm: 0.8 },
                        color: "#fff",
                        background: item.popular
                            ? "#1976F3"
                            : "#F33E54",
                        borderBottomLeftRadius: "12px",
                        fontSize: { xs: 10.5, sm: 12 },
                        fontWeight: 700,
                    }}
                >
                    ✦ {item.popular ? "Most Popular" : "Best Value"}
                </Box>
            )}

            <Box sx={{ p: { xs: 1.75, sm: 2.3 } }}>
                {/* Header */}
                <Stack direction="row" spacing={{ xs: 1.3, sm: 1.8 }} alignItems="center">
                    <Box
                        sx={{
                            width: { xs: 64, sm: 76 },
                            height: { xs: 64, sm: 76 },
                            flexShrink: 0,
                            borderRadius: { xs: "12px", sm: "14px" },
                            background: item.lightColor,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <ShoppingBagRounded
                            sx={{
                                fontSize: { xs: 36, sm: 43 },
                                color: item.color,
                            }}
                        />
                    </Box>

                    <Box sx={{ minWidth: 0 }}>
                        <Typography
                            sx={{
                                fontSize: { xs: 13.5, sm: 15 },
                                fontWeight: 700,
                                color: "#172033",
                                mb: 0.3,
                            }}
                        >
                            {item.name}
                        </Typography>

                        <Typography
                            sx={{
                                fontSize: { xs: 24, sm: 28 },
                                lineHeight: 1.1,
                                fontWeight: 800,
                                color: item.color,
                            }}
                        >
                            ${item.price.toLocaleString()}
                        </Typography>

                        <Chip
                            size="small"
                            label="+0.1% ROI Daily"
                            sx={{
                                mt: 1,
                                height: { xs: 23, sm: 25 },
                                fontSize: { xs: 10, sm: 11 },
                                fontWeight: 700,
                                color: item.color,
                                background: item.lightColor,
                                borderRadius: "20px",
                            }}
                        />
                    </Box>
                </Stack>

                {/* Features */}
                <Stack
                    spacing={{ xs: 0.9, sm: 1.15 }}
                    sx={{ mt: { xs: 1.6, sm: 2.2 } }}
                >
                    {/* Normal Features */}
                    {[
                        "Daily 1% ROI for 200 Days",
                        "Up to 10 Level Income",
                        "10% ROI Shared as per Plan",
                    ].map((feature) => (
                        <Stack
                            key={feature}
                            direction="row"
                            spacing={1}
                            alignItems="center"
                        >
                            <CheckCircleRounded
                                sx={{
                                    fontSize: 15,
                                    color: item.color,
                                    flexShrink: 0,
                                }}
                            />

                            <Typography
                                sx={{
                                    fontSize: { xs: 12, sm: 12.5 },
                                    color: "#596579",
                                }}
                            >
                                {feature}
                            </Typography>
                        </Stack>
                    ))}

                    {/* Crypto Bonuses */}
                    {item.cryptoBonuses?.map((bonus) => (
                        <Stack
                            key={bonus.id}
                            direction="row"
                            spacing={1}
                            alignItems="center"
                        >
                            <CheckCircleRounded
                                sx={{
                                    fontSize: 15,
                                    color: item.color,
                                    flexShrink: 0,
                                }}
                            />

                            <Typography
                                sx={{
                                    fontSize: { xs: 12, sm: 12.5 },
                                    color: "#596579",
                                }}
                            >
                                Bonus on Purchase:{" "}
                                <strong>
                                    {bonus.amountFormatted} {bonus.asset?.symbol}
                                </strong>
                            </Typography>
                        </Stack>
                    ))}
                </Stack>

                {/* Actions */}
                <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{ mt: { xs: 1.8, sm: 2.2 } }}
                >
                    <Button
                        fullWidth
                        variant="contained"
                        disabled={alreadyAdded}
                        startIcon={<ShoppingCartOutlined />}
                        onClick={() => onAdd(item)}
                        sx={{
                            height: { xs: 39, sm: 41 },
                            borderRadius: "7px",
                            textTransform: "none",
                            fontWeight: 700,
                            fontSize: { xs: 12.5, sm: 13 },
                            background: item.color,
                            boxShadow: "none",
                            "&:hover": {
                                background: item.color,
                                filter: "brightness(.94)",
                                boxShadow: "none",
                            },
                            "&.Mui-disabled": {
                                background: item.lightColor,
                                color: item.color,
                            },
                        }}
                    >
                        {alreadyAdded ? "Added" : "Add to Cart"}
                    </Button>
                </Stack>
            </Box>
        </Paper>
    );
}

/* =========================================================
   CART ITEM
========================================================= */

function CartItem({ item, onDelete }) {
    return (
        <Paper
            elevation={0}
            sx={{
                p: { xs: 1.5, sm: 2 },
                borderRadius: { xs: "10px", sm: "12px" },
                border: "1px solid #E8EBF0",
            }}
        >
            <Stack
                direction="row"
                spacing={{ xs: 1.2, sm: 1.5 }}
                alignItems="flex-start"
            >
                <Box
                    sx={{
                        width: { xs: 54, sm: 64 },
                        height: { xs: 54, sm: 64 },
                        flexShrink: 0,
                        borderRadius: { xs: "9px", sm: "11px" },
                        background: item.lightColor,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <ShoppingBagRounded
                        sx={{
                            color: item.color,
                            fontSize: { xs: 28, sm: 34 },
                        }}
                    />
                </Box>

                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Stack
                        direction="row"
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <Box sx={{ minWidth: 0 }}>
                            <Typography
                                sx={{
                                    fontSize: { xs: 13, sm: 14 },
                                    fontWeight: 700,
                                    color: "#172033",
                                }}
                                noWrap
                            >
                                {item.name}
                            </Typography>

                            <Typography
                                sx={{
                                    mt: 0.5,
                                    fontSize: { xs: 18, sm: 21 },
                                    fontWeight: 800,
                                    color: "#172033",
                                }}
                            >
                                ${item.price.toLocaleString()}
                            </Typography>
                        </Box>

                        <IconButton
                            size="small"
                            onClick={() => onDelete(item.id)}
                            sx={{
                                color: "#9AA0AA",
                                mt: -0.5,
                                mr: -0.5,
                                flexShrink: 0,
                            }}
                        >
                            <DeleteOutlineRounded fontSize="small" />
                        </IconButton>
                    </Stack>
                </Box>
            </Stack>
        </Paper>
    );
}

/* =========================================================
   CART CONTENT
========================================================= */

function CartContent({
    cart,
    fund,
    subtotal,
    onDelete,
    onAddMore,
    handleSuccess,
    setCart,
    isMobile = false,
}) {
    const [purchasing, setPurchasing] = useState(false);
    const walletBalance = Number(fund || 0);
    const totalAmount = Number(subtotal || 0);
    const insufficientBalance = walletBalance < totalAmount;
    const balanceShortage = Math.max(totalAmount - walletBalance, 0);

    const handlePurchase = async () => {
        if (cart.length === 0) { toast.error("Please select a package."); return; }
        if (walletBalance <= 0) { toast.error("Insufficient balance."); return; }
        if (walletBalance < totalAmount) { toast.error(`Insufficient balance. You need ${balanceShortage.toFixed(2)} USDT more.`); return; }

        try {
            setPurchasing(true);

            const res = await postMethod('/api/packages/purchasePackage', {
                packageId: cart[0].id,
                paymentSource: "FUND",
            });

            if (res?.error) {
                toast.error(res.message || 'Purchase failed');
                return;
            }

            toast.success('Package purchased successfully 🎉');
            setCart([])

            if (typeof handleSuccess === 'function') {
                handleSuccess();   // ✅ REFRESH PACKAGES + WALLET
            }
        } catch (err) {
            toast.error(err.message || 'Something went wrong');
        } finally {
            setPurchasing(false);
        }
    };

    return (
        <Box
            sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
            }}
        >
            {/* Cart Header — only shown in the desktop sidebar; the Drawer renders its own header */}
            {!isMobile && (
                <Box
                    sx={{
                        px: { xs: 2, sm: 2.5 },
                        py: { xs: 1.7, sm: 2.2 },
                        borderBottom: "1px solid #EDF0F4",
                    }}
                >
                    <Stack
                        direction="row"
                        alignItems="center"
                        spacing={{ xs: 1.2, sm: 1.5 }}
                    >
                        <ShoppingCartOutlined
                            sx={{
                                fontSize: { xs: 26, sm: 31 },
                                color: "#172033",
                            }}
                        />

                        <Typography
                            sx={{
                                fontSize: { xs: 16.5, sm: 18 },
                                fontWeight: 800,
                                color: "#172033",
                            }}
                        >
                            Your Cart
                        </Typography>

                        <Box
                            sx={{
                                width: 22,
                                height: 22,
                                borderRadius: "50%",
                                background: "#1976F3",
                                color: "#fff",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 11,
                                fontWeight: 800,
                                flexShrink: 0,
                            }}
                        >
                            {cart.length}
                        </Box>
                    </Stack>
                </Box>
            )}

            <Box
                sx={{
                    flex: 1,
                    overflowY: "auto",
                    px: { xs: 1.5, sm: 2 },
                    py: { xs: 1.5, sm: 2 },
                }}
            >
                {cart.length === 0 ? (
                    <Paper
                        elevation={0}
                        sx={{
                            p: { xs: 2.5, sm: 3 },
                            textAlign: "center",
                            borderRadius: "10px",
                            border: "1px dashed #C9D2E2",
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: 12.5,
                                color: "#697386",
                            }}
                        >
                            No package selected yet.
                        </Typography>
                    </Paper>
                ) : (
                    <Stack spacing={{ xs: 1.5, sm: 2 }}>
                        {cart.map((item) => (
                            <CartItem
                                key={item.id}
                                item={item}
                                onDelete={onDelete}
                            />
                        ))}
                    </Stack>
                )}

                {/* Add more — only relevant inside the mobile Drawer, where packages
                    aren't visible alongside the cart. Was previously keyed off the
                    `xs`/`sm` breakpoint, which hid it for any Drawer opened between
                    600–899px even though the Drawer (not the sidebar) was showing. */}
                {isMobile && (
                    <Paper
                        elevation={0}
                        onClick={onAddMore}
                        sx={{
                            mt: { xs: 1.5, sm: 2 },
                            p: { xs: 1.6, sm: 2.1 },
                            cursor: "pointer",
                            borderRadius: { xs: "9px", sm: "10px" },
                            border: "1px dashed #C9D2E2",
                            background: "#FFFFFF",
                            transition: ".2s",
                            "&:hover": {
                                borderColor: "#1976F3",
                                background: "#F8FBFF",
                            },
                        }}
                    >
                        <Stack
                            direction="row"
                            spacing={{ xs: 1.2, sm: 1.5 }}
                            sx={{ textAlign: 'center', alignItems: 'center', }}
                        >
                            <Box
                                sx={{
                                    width: { xs: 34, sm: 38 },
                                    height: { xs: 34, sm: 38 },
                                    flexShrink: 0,
                                    borderRadius: "50%",
                                    background: "#F4EEFF",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <AddRounded
                                    sx={{
                                        color: "#7928E8",
                                    }}
                                />
                            </Box>

                            <Box>
                                <Typography
                                    sx={{
                                        fontSize: { xs: 13, sm: 14 },
                                        fontWeight: 800,
                                        color: "#6E2DC7",
                                    }}
                                >
                                    {cart.length ? "Change package" : "Choose a package"}
                                </Typography>

                                {/* <Typography
                                    sx={{
                                        fontSize: { xs: 10.5, sm: 11 },
                                        color: "#667085",
                                        mt: 0.3,
                                    }}
                                >
                                    Browse packages above
                                </Typography> */}
                            </Box>
                        </Stack>
                    </Paper>
                )}

                {/* Price Details */}
                <Paper
                    elevation={0}
                    sx={{
                        mt: { xs: 1.5, sm: 2 },
                        p: { xs: 1.6, sm: 2 },
                        borderRadius: { xs: "9px", sm: "10px" },
                        border: "1px solid #E8EBF0",
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: { xs: 14, sm: 15 },
                            fontWeight: 800,
                            color: "#172033",
                            mb: { xs: 1.5, sm: 2 },
                        }}
                    >
                        Price Details
                    </Typography>

                    <Stack spacing={{ xs: 1.2, sm: 1.5 }}>
                        <Stack
                            direction="row"
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "flex-start",
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: { xs: 12.5, sm: 13 },
                                    color: "#697386",
                                }}
                            >
                                Subtotal ({cart.length} item)
                            </Typography>

                            <Typography
                                sx={{
                                    fontSize: { xs: 12.5, sm: 13 },
                                    fontWeight: 700,
                                }}
                            >
                                ${totalAmount.toLocaleString()}
                            </Typography>
                        </Stack>

                        <Stack
                            direction="row"
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "flex-start",
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: { xs: 12.5, sm: 13 },
                                    color: "#697386",
                                }}
                            >
                                ROI Benefit (Daily)
                            </Typography>

                            <Typography
                                sx={{
                                    fontSize: { xs: 12.5, sm: 13 },
                                    fontWeight: 700,
                                    color: "#159447",
                                }}
                            >
                                +0.1%
                            </Typography>
                        </Stack>

                        <Divider sx={{ borderStyle: "dashed" }} />

                        <Stack
                            direction="row"
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "flex-start",
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: { xs: 15.5, sm: 17 },
                                    fontWeight: 800,
                                }}
                            >
                                Total Amount
                            </Typography>

                            <Typography
                                sx={{
                                    fontSize: { xs: 18, sm: 20 },
                                    fontWeight: 800,
                                    color: "#1769E0",
                                }}
                            >
                                ${totalAmount.toLocaleString()}
                            </Typography>
                        </Stack>
                    </Stack>
                </Paper>

                {/* Wallet */}
                <Box
                    sx={{
                        mt: { xs: 1.5, sm: 2 },
                        px: { xs: 1.6, sm: 2 },
                        py: { xs: 1.3, sm: 1.6 },
                        borderRadius: { xs: "8px", sm: "9px" },
                        background: insufficientBalance
                            ? "linear-gradient(90deg,#FDECEC,#FFF6F6)"
                            : "linear-gradient(90deg,#ECF9F1,#F5FFF9)",
                        border: insufficientBalance
                            ? "1px solid #F5C2C2"
                            : "1px solid #D8F0E1",
                    }}
                >
                    <Stack
                        direction="row"
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                        }}
                        spacing={1}
                    >
                        <Stack
                            direction="row"
                            alignItems="center"
                            spacing={1}
                        >
                            <AccountBalanceWalletRounded
                                sx={{
                                    color: insufficientBalance ? "#D92D20" : "#159447",
                                    fontSize: { xs: 19, sm: 21 },
                                }}
                            />

                            <Typography
                                sx={{
                                    fontSize: { xs: 11.5, sm: 12 },
                                    fontWeight: 800,
                                    color: insufficientBalance ? "#D92D20" : "#159447",
                                }}
                            >
                                Wallet Balance
                            </Typography>
                        </Stack>

                        <Typography
                            sx={{
                                fontSize: { xs: 12.5, sm: 13 },
                                fontWeight: 800,
                                color: insufficientBalance ? "#D92D20" : "#159447",
                                whiteSpace: "nowrap",
                            }}
                        >
                            {fund} USDT
                        </Typography>
                    </Stack>

                    {insufficientBalance && cart.length > 0 && (
                        <Stack
                            direction="row"
                            alignItems="center"
                            spacing={0.7}
                            sx={{ mt: 1 }}
                        >
                            <ErrorOutlineRounded
                                sx={{
                                    fontSize: 15,
                                    color: "#D92D20",
                                    flexShrink: 0,
                                }}
                            />
                            <Typography
                                sx={{
                                    fontSize: { xs: 11, sm: 11.5 },
                                    fontWeight: 600,
                                    color: "#D92D20",
                                }}
                            >
                                Insufficient balance. You need {balanceShortage.toFixed(2)} USDT more to complete this purchase.
                            </Typography>
                        </Stack>
                    )}
                </Box>

                {/* Checkout */}
                <Button
                    fullWidth
                    variant="contained"
                    disabled={cart.length === 0 || insufficientBalance}
                    endIcon={
                        purchasing ? (
                            <CircularProgress size={18} color="inherit" />
                        ) : (
                            <ArrowForwardRounded />
                        )
                    }
                    sx={{
                        mt: { xs: 1.6, sm: 2 },
                        height: { xs: 48, sm: 53 },
                        borderRadius: "8px",
                        background: "#FFC400",
                        color: "#172033",
                        fontWeight: 800,
                        fontSize: { xs: 13, sm: 14 },
                        textTransform: "none",
                        boxShadow: "none",
                        "&:hover": {
                            background: "#F2B900",
                            boxShadow: "none",
                        },
                        "&.Mui-disabled": {
                            background: "#EDEFF3",
                            color: "#98A2B3",
                        },
                    }}
                    onClick={handlePurchase}
                >
                    {purchasing ? 'Processing...' : ' Proceed to Checkout'}

                </Button>

                <Stack
                    direction="row"
                    spacing={0.7}
                    sx={{
                        mt: 1.5,
                        justifyContent: "center",
                        alignItems: 'center',
                        textAlign: "center"
                    }}
                >
                    <LockRounded
                        sx={{
                            fontSize: 15,
                            color: "#667085",
                        }}
                    />

                    <Typography
                        sx={{
                            fontSize: 11,
                            color: "#667085",
                        }}
                    >
                        Secure & Encrypted Checkout
                    </Typography>
                </Stack>
            </Box>
        </Box>
    );
}


/* =========================================================
   TOP FEATURE
========================================================= */

function TopFeature({ icon, title, subtitle, color }) {
    return (
        <Box
            sx={{
                minWidth: { xs: 132, sm: 150 },
                px: { xs: 1.4, sm: 1.8 },
                py: { xs: 1, sm: 1.2 },
                borderRadius: { xs: "9px", sm: "10px" },
                border: "1px solid #E8EBF0",
                background: "#fff",
            }}
        >
            <Stack direction="row" spacing={1.1} alignItems="center">
                <Box sx={{ color, display: "flex" }}>{icon}</Box>

                <Box>
                    <Typography
                        sx={{
                            fontSize: { xs: 11.5, sm: 12 },
                            fontWeight: 800,
                            color: "#172033",
                            whiteSpace: "nowrap",
                        }}
                    >
                        {title}
                    </Typography>

                    <Typography
                        sx={{
                            fontSize: { xs: 10, sm: 10.5 },
                            color: "#70798A",
                            mt: 0.2,
                            whiteSpace: "nowrap",
                        }}
                    >
                        {subtitle}
                    </Typography>
                </Box>
            </Stack>
        </Box>
    );
}

/* =========================================================
   MAIN APP
========================================================= */

export default function Packages({ data, wallet, handleSuccess, progress }) {
    const fund = parseFloat(wallet?.fundUsd || 0);
    const packageStyles = [
        {
            color: "#1976F3",
            lightColor: "#EFF6FF",
            borderColor: "#BBD8FF",
            popular: true,
        },
        {
            color: "#7928E8",
            lightColor: "#F5EEFF",
            borderColor: "#E4D1FF",
        },
        {
            color: "#0AA65B",
            lightColor: "#ECF9F2",
            borderColor: "#C6ECD8",
        },
        {
            color: "#FF9500",
            lightColor: "#FFF7EA",
            borderColor: "#FFE2B3",
        },
        {
            color: "#18A7B5",
            lightColor: "#EAF9FA",
            borderColor: "#BEECEF",
        },
        {
            color: "#F33E54",
            lightColor: "#FFF0F2",
            borderColor: "#FFD0D6",
            bestValue: true,
        },
    ];

    const packages = (data || []).map((item, index) => ({
        ...item,

        price: Number(item.priceUsd),

        ...(packageStyles[index] || packageStyles[0]),
    }));

    const theme = useTheme();

    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    const [cart, setCart] = useState([]);
    const [cartOpen, setCartOpen] = useState(false);

    /* Add package — only one package allowed in the cart at a time,
       and quantity is always locked at 1.
       - Adding the same package again does nothing (button is disabled anyway).
       - Adding a different package replaces whatever is currently in the cart. */
    const addToCart = (item) => {
        setCart((prev) => {
            const exists = prev.find(
                (cartItem) => cartItem.id === item.id
            );

            if (exists) {
                return prev;
            }

            return [
                {
                    ...item,
                    quantity: 1,
                },
            ];
        });

        if (isMobile) {
            setCartOpen(true);
        }
    };

    /* Delete */
    const deleteItem = (id) => {
        setCart((prev) =>
            prev.filter((item) => item.id !== id)
        );
    };

    const subtotal = useMemo(
        () =>
            cart.reduce(
                (total, item) => total + item.price,
                0
            ),
        [cart]
    );

    return (
        <>

            <Grid container spacing={{ xs: 1.5, sm: 2, md: 2.5 }}>
                {/* =================================================
                        LEFT SECTION
                    ================================================= */}
                <Grid
                    size={{
                        xs: 12,
                        md: 9,
                        lg: 9,
                    }}
                >
                    <Paper
                        elevation={0}
                        sx={{
                            borderRadius: { xs: "13px", sm: "16px" },
                            border: "1px solid #EDF0F4",
                            background: "#fff",
                            overflow: "hidden",
                        }}
                    >
                        {/* Header */}
                        <Box
                            sx={{
                                px: {
                                    xs: 1.75,
                                    sm: 2.5,
                                    md: 1,
                                },
                                py: { xs: 1.8, sm: 1 },

                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "flex-start",
                                }}
                            >
                                {/* Title */}
                                <Stack
                                    direction="row"
                                    spacing={{ xs: 1.2, sm: 1.5 }}
                                    alignItems="center"
                                >
                                    <Box
                                        sx={{
                                            width: { xs: 42, sm: 42 },
                                            height: { xs: 42, sm: 42 },
                                            flexShrink: 0,
                                            borderRadius: { xs: "10px", sm: "12px" },
                                            background:
                                                "#EAF3FF",
                                            display: "flex",
                                            alignItems:
                                                "center",
                                            justifyContent:
                                                "center",
                                        }}
                                    >
                                        <ShoppingBagRounded
                                            sx={{
                                                fontSize: { xs: 25, sm: 30 },
                                                color: "#1976F3",
                                            }}
                                        />
                                    </Box>

                                    <Box>
                                        <Typography fontWeight={900} fontSize={{ xs: 20, sm: 22, md: 24 }} lineHeight={1.15}>
                                            Invest in Growth
                                        </Typography>

                                        <Typography
                                            sx={{
                                                fontSize: { xs: 11.5, sm: 12 },
                                                color: "#667085",
                                                mt: 0.6,
                                            }}
                                        >
                                            Choose a package and
                                            start earning daily
                                            ROI
                                        </Typography>
                                    </Box>
                                </Stack>

                                {/* Top Features */}
                                <Stack
                                    direction="row"
                                    spacing={{ xs: 0.8, sm: 1 }}
                                    sx={{
                                        display: {
                                            xs: "none",
                                            md: "flex",
                                        },
                                        width: "auto",
                                        overflowX: "auto",
                                        pb: 0,
                                    }}
                                >
                                    <TopFeature
                                        color="#1976F3"
                                        icon={<AutorenewRounded />}
                                        title="Daily ROI"
                                        subtitle="Up to 1% Daily"
                                    />

                                    <TopFeature
                                        color="#16A05D"
                                        icon={<ShieldOutlined />}
                                        title="Trusted & Secure"
                                        subtitle="100% Transparent"
                                    />

                                    <TopFeature
                                        color="#7928E8"
                                        icon={<VerifiedRounded />}
                                        title="Instant Activation"
                                        subtitle="Start Earning Immediately"
                                    />
                                </Stack>
                            </Box>
                        </Box>

                        <Divider />

                        {/* Packages Heading */}
                        <Box
                            sx={{
                                px: {
                                    xs: 1.75,
                                    sm: 2.5,
                                    md: 3,
                                },
                                pt: { xs: 1.8, sm: 2.3 },
                                pb: { xs: 1.3, sm: 1.7 },
                            }}
                        >
                            <Stack
                                direction={{ xs: "column", sm: "row" }}
                                spacing={{ xs: 1.2, sm: 0 }}
                                alignItems={{ xs: "flex-start", sm: "center" }}
                                justifyContent="space-between"
                            >
                                <Stack
                                    direction="row"
                                    spacing={1}
                                    alignItems="center"
                                >
                                    <Typography
                                        sx={{
                                            fontSize: { xs: 14, sm: 15 },
                                            fontWeight: 800,
                                            color: "#172033",
                                        }}
                                    >
                                        Popular Packages
                                    </Typography>

                                    <Chip
                                        label={`${packages.length} Packages`}
                                        size="small"
                                        sx={{
                                            height: 25,
                                            fontSize: 10,
                                            background:
                                                "#F1F4F8",
                                            color: "#687386",
                                        }}
                                    />
                                </Stack>


                            </Stack>
                        </Box>

                        {/* Package Grid */}
                        <Box
                            sx={{
                                px: {
                                    xs: 1.25,
                                    sm: 2,
                                    md: 3,
                                },
                                pb: { xs: 1.8, sm: 2.5 },
                            }}
                        >
                            <Grid container spacing={{ xs: 1.5, sm: 2, md: 2.5 }}>
                                {packages.length === 0 ? (
                                    <Grid size={12}>
                                        <Box
                                            sx={{
                                                minHeight: 300,
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                textAlign: "center",
                                                borderRadius: 3,
                                                border: "1px dashed",
                                                borderColor: "divider",
                                                bgcolor: "background.paper",
                                                p: 4,
                                            }}
                                        >
                                            <Typography
                                                variant="h6"
                                                fontWeight={700}
                                                color="text.primary"
                                            >
                                                No Packages Available
                                            </Typography>

                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                sx={{ mt: 0.5 }}
                                            >
                                                There are currently no packages available for purchase.
                                            </Typography>
                                        </Box>
                                    </Grid>
                                ) : (
                                    packages.map((item) => {
                                        const cartItem = cart.find(
                                            (x) => x.id === item.id
                                        );

                                        return (
                                            <Grid
                                                key={item.id}
                                                size={{
                                                    xs: 12,
                                                    sm: 6,
                                                    md: 6,
                                                    lg: 4,
                                                }}
                                            >
                                                <PackageCard
                                                    item={item}
                                                    quantity={cartItem?.quantity || 0}
                                                    onAdd={addToCart}
                                                />

                                            </Grid>
                                        );
                                    })
                                )}
                            </Grid>

                            {/* <Paper
                                elevation={0}
                                sx={{
                                    mt: { xs: 1.8, sm: 2.5 },
                                    p: { xs: 1.4, sm: 1.8 },
                                    borderRadius: { xs: "10px", sm: "11px" },
                                    border: "1px solid #E7EAF0",
                                }}
                            >
                                <Stack
                                    direction={{
                                        xs: "column",
                                        sm: "row",
                                    }}
                                    divider={
                                        <Divider
                                            orientation={
                                                isMobile
                                                    ? "horizontal"
                                                    : "vertical"
                                            }
                                            flexItem
                                        />
                                    }
                                    spacing={{ xs: 1.5, sm: 2 }}
                                >
                                    <BottomFeature
                                        color="#7928E8"
                                        icon={
                                            <AutorenewRounded />
                                        }
                                        title="Daily ROI"
                                        subtitle="Earn up to 1% every day"
                                    />

                                    <BottomFeature
                                        color="#16A05D"
                                        icon={
                                            <BarChartRounded />
                                        }
                                        title="Level Income"
                                        subtitle="Up to 10 Levels deep"
                                    />

                                    <BottomFeature
                                        color="#FF9500"
                                        icon={
                                            <CompareArrowsRounded />
                                        }
                                        title="ROI Sharing"
                                        subtitle="10% Shared as per plan"
                                    />

                                    <BottomFeature
                                        color="#7928E8"
                                        icon={
                                            <CardGiftcardRounded />
                                        }
                                        title="Bonus Rewards"
                                        subtitle="Huge bonus on purchase"
                                    />
                                </Stack>
                            </Paper> */}
                        </Box>
                    </Paper>
                </Grid>

                {/* =================================================
                        DESKTOP CART
                    ================================================= */}
                {!isMobile && (
                    <Grid
                        size={{
                            md: 3,
                            lg: 3,
                        }}
                    >
                        <Paper
                            elevation={0}
                            sx={{
                                position: "sticky",
                                top: 16,
                                borderRadius: "16px",
                                border: "1px solid #EDF0F4",
                                background: "#fff",
                                overflow: "hidden",
                            }}
                        >
                            <CartContent
                                setCart={setCart}
                                handleSuccess={handleSuccess}
                                fund={fund}
                                cart={cart}
                                subtotal={subtotal}
                                onDelete={deleteItem}
                                isMobile={false}
                                onAddMore={() =>
                                    window.scrollTo({
                                        top: 0,
                                        behavior: "smooth",
                                    })
                                }
                            />
                        </Paper>
                        <br />
                        {/* <PurchaseHistory progress={progress} /> */}
                    </Grid>
                )}
            </Grid>

            {/* =========================================================
                MOBILE CART DRAWER
            ========================================================= */}

            <Dialog
                open={cartOpen}
                onClose={() => {
                    setCartOpen(false);
                    setCart([]);
                }}
                fullScreen
                PaperProps={{
                    sx: {
                        width: "100vw",
                        maxWidth: "100vw",
                        height: "100dvh",
                        maxHeight: "100dvh",
                        margin: 0,
                        borderRadius: 0,
                        display: "flex",
                        flexDirection: "column",
                        overflow: "hidden",
                    },
                }}
                sx={{
                    zIndex: 99999,
                }}
            >

                {/* Header */}
                <Box
                    sx={{
                        height: 64,
                        minHeight: 64,
                        px: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        borderBottom: "1px solid #EDF0F4",
                        backgroundColor: "#fff",
                        flexShrink: 0,
                    }}
                >
                    <Stack
                        direction="row"
                        alignItems="center"
                        spacing={{ xs: 1.2, sm: 1.5 }}
                    >
                        <ShoppingCartOutlined
                            sx={{
                                fontSize: { xs: 26, sm: 31 },
                                color: "#172033",
                            }}
                        />

                        <Typography
                            sx={{
                                fontSize: { xs: 16.5, sm: 18 },
                                fontWeight: 800,
                                color: "#172033",
                            }}
                        >
                            Your Cart
                        </Typography>

                        <Box
                            sx={{
                                width: 22,
                                height: 22,
                                borderRadius: "50%",
                                background: "#1976F3",
                                color: "#fff",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 11,
                                fontWeight: 800,
                                flexShrink: 0,
                            }}
                        >
                            {cart.length}
                        </Box>
                    </Stack>

                    <IconButton
                        onClick={() => {
                            setCartOpen(false);
                            setCart([]);
                        }}
                        sx={{
                            backgroundColor: "#F3F4F6",
                            "&:hover": {
                                backgroundColor: "#E5E7EB",
                            },
                        }}
                    >
                        <CloseRounded />
                    </IconButton>
                </Box>

                {/* Cart Content */}
                <Box
                    p={{ xs: 20 }}
                    sx={{
                        flex: 1,
                        minHeight: 0,
                        width: "100%",
                        overflowY: "auto",
                        overflowX: "hidden",
                        backgroundColor: "#fff",
                        WebkitOverflowScrolling: "touch",

                    }}
                >
                    <CartContent
                        setCart={setCart}
                        handleSuccess={handleSuccess}
                        fund={fund}
                        cart={cart}
                        subtotal={subtotal}
                        onDelete={deleteItem}
                        isMobile={true}
                        onAddMore={() => {
                            setCartOpen(false);
                            setCart([]);

                            window.scrollTo({
                                top: 0,
                                behavior: "smooth",
                            });
                        }}
                    />
                </Box>
            </Dialog >
        </>
    );
}
