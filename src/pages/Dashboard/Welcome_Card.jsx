
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import RefreshIcon from "@mui/icons-material/Refresh";
import {
    Box,
    IconButton,
    Typography
} from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import { useState } from "react";


const Welcomecard = ({ user }) => {
    const getGreeting = () => {
        const hour = new Date().getHours();

        if (hour >= 5 && hour < 12) {
            return "Good Morning 👋";
        } else if (hour >= 12 && hour < 17) {
            return "Good Afternoon 👋";
        } else {
            return "Good Evening 👋";
        }
    };
    const [copied, setCopied] = useState(false);

    const handleCopyId = () => {
        const id = user?.superId;

        if (!id) return;

        // Fallback copy method
        const textArea = document.createElement("textarea");
        textArea.value = id;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);

        setCopied(true);

        setTimeout(() => {
            setCopied(false);
        }, 2000);
    };
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                mb: { xs: 0, sm: 3 },
            }}
        >
            {/* Left Side Text */}
            <Box>

                <Typography
                    variant="h6"
                    fontWeight={700}
                    gutterBottom
                    sx={{
                        pt: 1,
                        display: {
                            xs: "block",
                            sm: "none",
                        },
                        fontSize: "22px",
                        lineHeight: 1.3,
                    }}
                >
                    Hi, {user?.username || '—'}👋
                </Typography>

                <Typography
                    color="text.secondary"
                    component="div"
                    sx={{
                        display: {
                            xs: "flex",
                            sm: "none",
                        },
                        alignItems: "center",
                        gap: 1,
                        fontSize: "14px",
                        mb: 3,
                        lineHeight: 1.5,
                    }}
                >
                    User ID:

                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                        }}
                    >
                        <Box
                            component="span"
                            sx={{
                                color: "#2563eb",
                                fontWeight: 700,
                                backgroundColor: "#eff6ff",
                                px: 1,
                                py: 0.3,
                                borderRadius: "6px",
                            }}
                        >
                            {user?.superId || "-"}
                        </Box>

                        <Tooltip title={copied ? "Copied!" : "Copy ID"}>
                            <IconButton
                                onClick={handleCopyId}
                                size="small"
                                sx={{
                                    width: 26,
                                    height: 26,
                                    color: copied ? "#16a34a" : "#2563eb",
                                    backgroundColor: "#eff6ff",
                                    borderRadius: "6px",
                                    "&:hover": {
                                        backgroundColor: "#dbeafe",
                                    },
                                }}
                            >
                                {copied ? (
                                    <CheckRoundedIcon fontSize="10" />
                                ) : (
                                    <ContentCopyRoundedIcon fontSize="10" />
                                )}
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Typography>

                <Typography
                    color="text.secondary"
                    sx={{
                        display: {
                            xs: "none",
                            sm: "block",
                        },
                        fontSize: "16px",
                    }}
                >
                    {getGreeting()}
                </Typography>

                <Typography
                    variant="h6"
                    gutterBottom
                    sx={{
                        fontWeight: 700,
                        pt: 1,
                        display: {
                            xs: "none",
                            sm: "block",
                        },
                        fontSize: "24px",
                        lineHeight: 1.3,
                    }}
                >
                    Welcome Back, {user?.username || '—'} !
                </Typography>

                <Typography
                    sx={{
                        color: "#6B7280",
                        display: {
                            xs: "none",
                            sm: "block",
                        },
                        fontSize: "14px",
                    }}
                >
                    Here's your SEROT account overview 🚀
                </Typography>
            </Box>


            {/* Right Side Refresh Icon */}
            <Tooltip title="Refresh" arrow placement="top">
                <IconButton
                    sx={{
                        mt: 1,
                        backgroundColor: "#f3f4f6",
                        borderRadius: "12px",
                        width: 42,
                        height: 42,
                        "&:hover": {
                            backgroundColor: "#e5e7eb",
                        },
                    }}
                    onClick={() => window.location.reload()}
                >
                    <RefreshIcon
                        sx={{
                            fontSize: 22,
                            color: "#2563eb",
                        }}
                    />
                </IconButton>
            </Tooltip>
        </Box>
    )
}

export default Welcomecard
