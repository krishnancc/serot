import { Box, useMediaQuery, useTheme } from "@mui/material";
import SupportDetails from "./SupportDetails";

const Support = () => {
    const theme = useTheme();

    const isMobile = useMediaQuery(
        theme.breakpoints.down("sm")
    );
    return (
        <>
            {isMobile ? (
                // <MobileNavbar>
                <Box
                    sx={{
                        pt: "20px",
                        px: { xs: 1.5, sm: 3 },
                    }}
                >
                    <SupportDetails />
                </Box>

                // </MobileNavbar>
            ) : (
                <SupportDetails />
            )}
        </>
    )
}

export default Support
