import { Box, Toolbar } from "@mui/material";

import MobileBottomNav from "./MobileBottomNav";
import Navbar from "./Navbar";
import { drawerWidth } from "./Sidebar";

const Layout = ({ children }) => {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#fff" }}>
      {/* Top Navbar */}
      <Navbar />

      {/* Desktop Sidebar */}
      {/* <Sidebar /> */}

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,

          width: {
            xs: "100%",
            md: `calc(100% - ${drawerWidth}px)`,
          },

          p: 2,

          ml: {
            xs: 0,
            // md: `${drawerWidth}px`,
          },

          pb: {
            xs: 10,
            md: 3,
          },
        }}
      >
        {/* Space below AppBar */}
        <Toolbar />

        {children}
        {/* <Footer /> */}
      </Box>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </Box>
  );
};

export default Layout;
