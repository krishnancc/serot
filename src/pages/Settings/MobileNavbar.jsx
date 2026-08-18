import {
  KeyboardArrowDownRounded,
  LogoutRounded,
  NotificationsNoneRounded,
  PersonRounded,
} from "@mui/icons-material";
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Divider,
  IconButton,
  Popover,
  Toolbar,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMethod } from "../../api/login";
const MobileNavbar = ({ children }) => {
  const [notificationAnchor, setNotificationAnchor] = useState(null);
  const [profileAnchor, setProfileAnchor] = useState(null);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const notificationOpen = Boolean(notificationAnchor);
  const profileOpen = Boolean(profileAnchor);

  const [loadingUser, setLoadingUser] = useState(false);
  const PROFILE_CACHE_KEY = "user_profile_cache";

  const fetchProfile = useCallback(async () => {
    setLoadingUser(true);

    try {
      const token = localStorage.getItem("serot_token");

      if (!token) {
        console.log("Token not found");
        return;
      }

      // Check session cache first
      const cachedUser = sessionStorage.getItem(PROFILE_CACHE_KEY);

      if (cachedUser) {
        setUser(JSON.parse(cachedUser));
        return;
      }

      const result = await getMethod("/api/user/profile");

      if (result?.error) {
        console.log(result?.error?.message);
        return;
      }

      if (result?.data) {
        sessionStorage.setItem(PROFILE_CACHE_KEY, JSON.stringify(result.data));

        setUser(result.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingUser(false);
    }
  }, []);
  // console.log(user)
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleLogout = () => {
    localStorage.removeItem("serot_token");
    sessionStorage.removeItem("serot_token");
    sessionStorage.removeItem(PROFILE_CACHE_KEY);
    navigate("/signin", { replace: true });
  };
  return (
    <>
      <AppBar
        position="fixed"
        elevation={0.5}
        sx={{
          bgcolor: "#fff",
          color: "#1e293b",
          borderBottom: "1px solid #e2e8f0",
          zIndex: 1300,
        }}
      >
        <Toolbar
          sx={{
            height: 72,
            px: { xs: 2, md: 3 },
          }}
        >
          {/* Logo */}
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: 3,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg,#2563eb,#7c3aed)",
                color: "#fff",
                fontWeight: 900,
                fontSize: 22,
              }}
            >
              S
            </Box>

            <Typography
              fontSize={22}
              fontWeight={900}
              sx={{
                background: "linear-gradient(135deg,#2563eb,#7c3aed)",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              SEROT
            </Typography>
          </Box>

          {/* Notification */}
          <IconButton
            onClick={(e) => setNotificationAnchor(e.currentTarget)}
            sx={{
              mr: 1,
              bgcolor: "#d6e6f6",
              width: { xs: 34, sm: 40, md: 42 },
              height: { xs: 34, sm: 40, md: 42 },
            }}
          >
            <Badge badgeContent={0} color="error">
              <NotificationsNoneRounded
                sx={{
                  color: "#2563eb",
                  fontSize: {
                    xs: 20,
                    sm: 24,
                    md: 24,
                  },
                }}
              />
            </Badge>
          </IconButton>

          {/* Notification Popup */}
          <Popover
            open={notificationOpen}
            anchorEl={notificationAnchor}
            onClose={() => setNotificationAnchor(null)}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            PaperProps={{
              sx: {
                mt: 1.5,
                width: 300,
                borderRadius: 4,
                boxShadow: "0 15px 35px rgba(0,0,0,.15)",
              },
            }}
          >
            <Box sx={{ p: 2.5 }}>
              <Typography fontWeight={800} fontSize={17}>
                Notifications
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Box
                sx={{
                  textAlign: "center",
                  py: 2,
                }}
              >
                <NotificationsNoneRounded
                  sx={{
                    fontSize: 50,
                    color: "#cbd5e1",
                  }}
                />

                <Typography fontWeight={600} mt={1}>
                  You have 0 unread messages
                </Typography>

                <Typography fontSize={12} color="text.secondary" mt={0.5}>
                  You're all caught up 🎉
                </Typography>
              </Box>
            </Box>
          </Popover>

          {/* Profile Icon */}
          <Box
            onClick={(e) => setProfileAnchor(e.currentTarget)}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: { xs: 0, sm: 1.2 },
              px: { xs: 0, sm: 1.2, md: 1.5 },
              py: { xs: 0, sm: 0.7 },
              height: { xs: "auto", sm: 40 },

              borderRadius: { xs: 0, sm: "999px" },
              bgcolor: { xs: "transparent", sm: "#fff" },
              border: { xs: "none", sm: "1px solid #E5E7EB" },
              boxShadow: { xs: "none", sm: "0 2px 8px rgba(0,0,0,0.08)" },

              cursor: "pointer",
              transition: "all .25s ease",

              "&:hover": {
                bgcolor: { xs: "transparent", sm: "#F9FAFB" },
                boxShadow: { xs: "none", sm: "0 6px 16px rgba(0,0,0,.12)" },
              },
            }}
          >
            {/* Left Section */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: { xs: 0.8, sm: 1.2 },
              }}
            >
              <Avatar
                src={user?.profilePicUrl || undefined}
                alt={user?.username || "User"}
                sx={{
                  width: { xs: 34, sm: 34, md: 34 },
                  height: { xs: 34, sm: 34, md: 34 },
                  background: "linear-gradient(135deg,#2563eb,#7c3aed)",
                }}
              >
                <PersonRounded sx={{ fontSize: { xs: 18, sm: 20 } }} />
              </Avatar>

              {/* Hide text on mobile */}
              <Box
                sx={{
                  display: {
                    xs: "none",
                    sm: "flex",
                  },
                  flexDirection: "column",
                  overflow: "hidden",
                }}
              >
                <Typography
                  sx={{
                    fontSize: { sm: 14, md: 15 },
                    fontWeight: 600,
                    color: "#111827",
                    lineHeight: 1.2,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: { sm: 120, md: 180 },
                  }}
                >
                  {user?.username || "User Name"}
                </Typography>

                <Typography
                  sx={{
                    fontSize: { sm: 11, md: 12 },
                    color: "#6B7280",
                    lineHeight: 1.2,
                    whiteSpace: "nowrap",
                  }}
                >
                  User ID : {user?.superId || "-"}
                </Typography>
              </Box>
            </Box>

            {/* Arrow */}
            <KeyboardArrowDownRounded
              sx={{
                display: { xs: "none", sm: "block" },
                color: "#6B7280",
                fontSize: { sm: 22 },
              }}
            />
          </Box>

          {/* Profile Popup */}
          <Popover
            open={profileOpen}
            anchorEl={profileAnchor}
            onClose={() => setProfileAnchor(null)}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            PaperProps={{
              sx: {
                mt: 1.5,
                width: 310,
                borderRadius: 4,
                overflow: "hidden",
                boxShadow: "0 20px 45px rgba(0,0,0,.18)",
              },
            }}
          >
            {/* Profile Header */}
            <Box
              sx={{
                p: 3,
                textAlign: "center",
                color: "#fff",
                background: "linear-gradient(135deg,#2563eb,#7c3aed)",
              }}
            >
              <Avatar
                src={user?.profilePicUrl || undefined}
                alt={user?.username || "User"}
                sx={{
                  width: 72,
                  height: 72,
                  mx: "auto",
                  mb: 1.5,
                  bgcolor: "#fff",
                  color: "#2563eb",
                  fontWeight: 900,
                  fontSize: 25,
                }}
              >
                {user?.username?.charAt(0)?.toUpperCase()}
              </Avatar>

              <Typography fontWeight={900} fontSize={17}>
                {loadingUser ? "Loading..." : user?.username || "—"}
              </Typography>

              <Typography fontSize={13} sx={{ opacity: 0.85 }}>
                {loadingUser ? "" : user?.email || ""}
              </Typography>

              <Box
                sx={{
                  mt: 1.5,
                  display: "inline-block",
                  px: 2,
                  py: 0.5,
                  borderRadius: 10,
                  bgcolor: "rgba(255,255,255,.2)",
                }}
              >
                <Typography fontSize={11} fontWeight={700}>
                  User Id : {user?.superId}
                </Typography>
              </Box>
            </Box>

            {/* Menu */}
            <Box sx={{ p: 1.5 }}>
              <Box
                onClick={() => {
                  setProfileAnchor(null);
                  navigate("/settings");
                }}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  p: 1.5,
                  borderRadius: 3,
                  cursor: "pointer",
                  "&:hover": {
                    bgcolor: "#f1f5f9",
                  },
                }}
              >
                <PersonRounded sx={{ color: "#2563eb" }} />

                <Typography fontWeight={700} fontSize={14}>
                  My Profile
                </Typography>
              </Box>

              <Divider sx={{ my: 1 }} />

              <Box
                onClick={handleLogout}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  p: 1.5,
                  borderRadius: 3,
                  cursor: "pointer",
                  color: "#ef4444",
                  "&:hover": {
                    bgcolor: "#fef2f2",
                  },
                }}
              >
                <LogoutRounded />

                <Typography fontWeight={700} fontSize={14}>
                  Logout
                </Typography>
              </Box>
            </Box>
          </Popover>
        </Toolbar>
      </AppBar>
      {/* Content Area */}
      <Box
        sx={{
          pt: "90px", // space below navbar
          px: { xs: 2, sm: 3 },
        }}
      >
        {children}
      </Box>
    </>
  );
};

export default MobileNavbar;
