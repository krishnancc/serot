import { Lock, Logout, Person, Support } from "@mui/icons-material";

import {
  Avatar,
  Box,
  Button,
  Card,
  Divider,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import { useNavigate } from "react-router-dom";

const menus = [
  {
    id: "personal",
    title: "Personal Details",
    icon: <Person fontSize="small" />,
    path: "/settings/personal",
  },
  {
    id: "security",
    title: "Security",
    icon: <Lock fontSize="small" />,
    path: "/settings/security",
  },
  {
    id: "support",
    title: "Support",
    icon: <Support fontSize="small" />,
    path: "/settings/support",
  },
];

const Sidebar = ({ tab, setTab, handleLogout, user, loadingUser }) => {
  const navigate = useNavigate();

  const theme = useTheme();

  const mobileView = useMediaQuery(theme.breakpoints.down("sm"));

  const handleMenuClick = (item) => {
    if (mobileView) {
      navigate(item.path);
    } else {
      setTab(item.id);
    }
  };

  return (
    <Card
      sx={{
        width: "100%",

        maxWidth: {
          xs: "100%",
          sm: 280,
          md: 300,
        },

        // height: "100%",
        borderRadius: {
          xs: 3,
          md: 4,
        },

        p: {
          xs: 2,
          sm: 2.5,
          md: 3,
        },

        boxShadow: "0 15px 35px rgba(15,23,42,0.08)",

        background: "#fff",
      }}
    >
      {/* PROFILE */}

      <Box
        sx={{
          textAlign: "center",

          mb: {
            xs: 2,
            md: 3,
          },
        }}
      >
        <Avatar
          src={
            user?.profilePicUrl
              ? user.profilePicUrl.startsWith("http")
                ? user.profilePicUrl
                : `${process.env.REACT_APP_BASE_URL}${user.profilePicUrl}`
              : undefined
          }
          alt={user?.username || "Profile"}
          sx={{
            width: {
              xs: 64,
              sm: 80,
              md: 92,
            },
            height: {
              xs: 64,
              sm: 80,
              md: 92,
            },
            mx: "auto",
            background: "linear-gradient(135deg,#2563eb,#9333ea)",
            fontSize: {
              xs: 24,
              md: 34,
            },
            fontWeight: 800,
          }}
        >
          {user?.username?.charAt(0)?.toUpperCase()}
        </Avatar>

        <Typography
          mt={1.5}
          fontWeight={800}
          sx={{
            fontSize: {
              xs: 14,
              md: 16,
            },
          }}
        >
          {loadingUser ? "Loading..." : user?.username || "—"}
        </Typography>

        <Typography
          color="text.secondary"
          sx={{
            fontSize: {
              xs: 12,
              md: 14,
            },

            overflow: "hidden",

            textOverflow: "ellipsis",

            whiteSpace: "nowrap",
          }}
        >
          {loadingUser ? "" : user?.email || ""}
        </Typography>

        <Box
          sx={{
            mt: 1.5,
            display: "inline-block",
            px: 2,
            py: 0.5,
            borderRadius: 10,
            bgcolor: "rgba(37,99,235,0.06)",
          }}
        >
          <Typography color="text.secondary" fontSize={12} mt={0.5}>
            User Id : SN{user?.superId}
          </Typography>
        </Box>
      </Box>

      <Divider
        sx={{
          mb: {
            xs: 2,
            md: 2,
          },
        }}
      />

      {/* MENU */}

      <Stack spacing={1} mt={2}>
        {menus.map((item) => {
          const active = tab === item.id;

          return (
            <Button
              key={item.id}
              fullWidth
              startIcon={item.icon}
              endIcon={
                <Box
                  sx={{
                    display: {
                      xs: "block",
                      md: "none",
                    },
                    fontSize: 20,
                    fontWeight: 700,
                    color: active ? "#2563eb" : "#94a3b8",
                  }}
                >
                  ›
                </Box>
              }
              onClick={() => handleMenuClick(item)}
              sx={{
                minHeight: {
                  xs: 42,
                  md: 46,
                },

                justifyContent: "flex-start",

                px: {
                  xs: 1.5,
                  md: 2,
                },

                borderRadius: 3,

                textTransform: "none",

                fontWeight: 700,

                fontSize: {
                  xs: 13,
                  md: 15,
                },

                color: active ? "#2563eb" : "#64748b",

                background: active ? "#eff6ff" : "transparent",

                "&:hover": {
                  background: "#f8fafc",
                },

                "& .MuiButton-endIcon": {
                  marginLeft: "auto",
                },
              }}
            >
              {item.title}
            </Button>
          );
        })}
      </Stack>

      {/* LOGOUT */}

      <Box
        sx={{
          mt: {
            xs: 2,
            md: 3,
          },

          pt: 2,

          borderTop: "1px solid #e2e8f0",
        }}
      >
        <Button
          fullWidth
          startIcon={<Logout fontSize="small" />}
          onClick={handleLogout}
          sx={{
            minHeight: {
              xs: 42,
              md: 46,
            },

            justifyContent: "flex-start",

            px: {
              xs: 1.5,
              md: 2,
            },

            borderRadius: 3,

            textTransform: "none",

            fontWeight: 700,

            fontSize: {
              xs: 13,
              md: 15,
            },

            color: "#ef4444",

            background: "#fff1f2",
          }}
        >
          Logout
        </Button>
      </Box>
    </Card>
  );
};

export default Sidebar;
