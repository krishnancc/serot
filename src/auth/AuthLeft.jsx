import { Box, Typography } from "@mui/material";
import Serot_logo from "../images/Serot_logo.png";

const AuthLeft = () => {
  return (
    <Box
      sx={{
        flex: 1,
        display: {
          xs: "none",
          md: "flex",
        },
        flexDirection: "column",
        justifyContent: "center",
        px: 9,
        color: "#fff",
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(145deg,#2563eb,#7c3aed)",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          width: 450,
          height: 450,
          borderRadius: "50%",
          background: "rgba(255,255,255,.12)",
          top: -180,
          right: -150,
        }}
      />

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          mb: 8,
        }}
      >
        <Box
          sx={{
            width: 54,
            height: 54,
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            // background: "linear-gradient(135deg, #2563EB, #7C3AED)",
            overflow: "hidden",
            flexShrink: 0,
            // boxShadow: "0 4px 12px rgba(99, 102, 241, 0.25)",
          }}
        >
          <Box
            component="img"
            src={Serot_logo}
            alt="SEROT Logo"
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              p: 0.7,
              display: "block",
            }}
          />
        </Box>

        <Typography
          sx={{
            fontSize: 20,
            fontWeight: 900,
            letterSpacing: "-0.5px",
            lineHeight: 1,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
          }}
        >
          SEROT
        </Typography>
      </Box>

      <Typography
        sx={{
          fontSize: 56,

          fontWeight: 900,

          lineHeight: 1.1,
        }}
      >
        Grow your
        <br />
        business
        <br />
        network
      </Typography>

      <Typography
        sx={{
          mt: 3,

          maxWidth: 420,

          fontSize: 18,

          lineHeight: 1.7,

          opacity: 0.85,
        }}
      >
        Manage your team, track performance and grow your network with powerful
        tools.
      </Typography>

      <Box
        sx={{
          display: "flex",

          gap: 2,

          mt: 6,
        }}
      >
        {[
          ["10K+", "Members"],
          ["500+", "Teams"],
          ["98%", "Growth"],
        ].map((item, index) => (
          <Box
            key={index}
            sx={{
              px: 3,

              py: 2,

              borderRadius: 3,

              background: "rgba(255,255,255,.15)",
            }}
          >
            <Typography fontWeight={800} fontSize={20}>
              {item[0]}
            </Typography>

            <Typography
              fontSize={13}
              sx={{
                opacity: 0.8,
              }}
            >
              {item[1]}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default AuthLeft;
