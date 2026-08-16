import { Box, useMediaQuery, useTheme } from "@mui/material";

import PersonalDetailsContent from "./PersonalDetailsContent";

const PersonalDetails = () => {
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <>
      {isMobile ? (
        // <MobileNavbar>
        <Box
          sx={{
            pt: "60px",
            px: { xs: 1.5, sm: 3 },
          }}
        >
          {" "}
          <PersonalDetailsContent />
        </Box>
      ) : (
        <PersonalDetailsContent />
      )}
    </>
  );
};

export default PersonalDetails;
