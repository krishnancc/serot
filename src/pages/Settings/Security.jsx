import {
    Box,
    useMediaQuery,
    useTheme
} from "@mui/material";
import SecurityDetails from "./SecurityDetails";

const Security = () => {

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
                        pt: "30px",
                        px: { xs: 1.5, sm: 3 },
                    }}
                > <SecurityDetails />
                </Box>

                // </MobileNavbar>
            ) : (
                <SecurityDetails />
            )}
        </>

    );
};

export default Security;