import {
  Card,
  CardContent,
  Grid,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import Layout from "../../components/Layout";
import Sidebar from "./Sidebar";

import { useNavigate } from "react-router-dom";
import { getMethod } from "../../api/login";
import PersonalDetails from "./PersonalDetails";
import Security from "./Security";
import Support from "./Support";

const Settings = () => {
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [tab, setTab] = useState(isMobile ? "" : "personal");

  const navigate = useNavigate();

  const PROFILE_CACHE_KEY = "user_profile_cache";
  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem(PROFILE_CACHE_KEY);
    navigate("/signin", { replace: true });
  };

  const renderContent = () => {
    switch (tab) {
      case "personal":
        return <PersonalDetails />;

      case "security":
        return <Security />;

      case "support":
        return <Support />;

      default:
        return null;
    }
  };

  const content = renderContent();

  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(false);

  const fetchProfile = useCallback(async () => {
    setLoadingUser(true);

    try {
      const token = localStorage.getItem("token");

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
        // console.log(result.message);
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
  return (
    <Layout>
      <Grid
        container
        spacing={{
          xs: 2,
          md: 3,
        }}
        alignItems="stretch"
      >
        {/* Sidebar */}
        <Grid
          size={{
            xs: 11,
            sm: 4,
            md: 3,
          }}
        >
          <Sidebar
            loadingUser={loadingUser}
            user={user}
            tab={tab}
            setTab={setTab}
            handleLogout={handleLogout}
          />
        </Grid>

        {/* Content */}
        {content && (
          <Grid
            size={{
              xs: 12,
              sm: 8,
              md: 9,
            }}
          >
            <Card
              sx={{
                width: "100%",
                borderRadius: {
                  xs: 3,
                  md: 4,
                },
                minHeight: {
                  xs: "auto",
                  md: 650,
                },
                boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
              }}
            >
              <CardContent
                sx={{
                  p: {
                    xs: 2,
                    sm: 3,
                    md: 4,
                  },
                }}
              >
                {content}
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Layout>
  );
};

export default Settings;
