import { Box, Container, Typography } from "@mui/material";

const Footer = () => {
    return (
        <Box
            component="footer"
            sx={{
                display: {
                    xs: "none",
                    sm: "none",
                    md: "block",
                },
                mt: 5,
                py: 2.5,
                borderTop: "1px solid",
                borderColor: "divider",
                bgcolor: "background.paper",
            }}
        >
            <Container maxWidth="xl">
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexDirection: {
                            xs: "column",
                            sm: "row",
                        },
                        gap: 1,
                    }}
                >
                    <Typography variant="body2" color="text.secondary">
                        © {new Date().getFullYear()} Serot. All Rights Reserved.
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                        Version 1.0.0
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;