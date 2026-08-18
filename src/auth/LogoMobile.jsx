import { Box, Typography } from "@mui/material";
import Serot_logo from "../images/Serot_logo.png";

const LogoMobile = () => {
  return (
    <>
      <Box
        component="img"
        src={Serot_logo}
        alt="SEROT Logo"
        sx={{
          width: "25%",
          height: "25%",
          objectFit: "contain",
          p: 0.7,
          display: "block",
        }}
      />
      <Typography
        sx={{
          fontSize: 20,
          fontWeight: 800,
          letterSpacing: "-0.5px",
          lineHeight: 1,
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
        }}
      >
        SEROT
      </Typography>
    </>
  );
};

export default LogoMobile;
