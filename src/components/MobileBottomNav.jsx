import {
  AccountBalanceWalletRounded,
  AccountTreeRounded,
  CardGiftcardRounded,
  DashboardRounded,
  ShoppingCartRounded,
} from "@mui/icons-material";
import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Paper,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const menus = [
  {
    label: "Home",
    icon: <DashboardRounded />,
    path: "/",
  },
  {
    label: "Genealogy",
    icon: <AccountTreeRounded />,
    path: "/genealogy",
  },
  {
    label: "Purchase",
    icon: <ShoppingCartRounded />,
    path: "/purchase",
    center: true,
  },
  {
    label: "Rewards",
    icon: <CardGiftcardRounded />,
    path: "/reward",
  },
  {
    label: "Wallet",
    icon: <AccountBalanceWalletRounded />,
    path: "/wallet",
  },
];

const MobileBottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [value, setValue] = useState(location.pathname);

  useEffect(() => {
    setValue(location.pathname);
  }, [location.pathname]);

  return (
    <Paper
      elevation={12}
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: 68,
        display: {
          xs: "block",
          md: "none",
        },
        zIndex: 1400,
        borderRadius: "22px 22px 0 0",
        overflow: "visible",
      }}
    >
      <BottomNavigation
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
          navigate(newValue);
        }}
        showLabels
        sx={{
          height: 68,
          bgcolor: "#fff",
          borderRadius: "22px 22px 0 0",
          "& .MuiBottomNavigationAction-root": {
            minWidth: 0,
            color: "#94a3b8",
            transition: "all .3s",
          },
          "& .Mui-selected": {
            color: "#2563eb",
          },
        }}
      >
        {menus.map((item) => {
          const active = value === item.path;

          return (
            <BottomNavigationAction
              key={item.path}
              value={item.path}
              label={item.label}
              sx={{
                "& .MuiBottomNavigationAction-label": {
                  fontSize: "11px",
                  fontWeight: 600,
                  marginTop: "4px",
                },
                "& .MuiBottomNavigationAction-label.Mui-selected": {
                  fontSize: "11px",
                  fontWeight: 700,
                },
              }}
              icon={
                item.center ? (
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      mt: "-18px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: active
                        ? "linear-gradient(135deg,#2563eb,#7c3aed)"
                        : "#eef2ff",
                      color: active ? "#fff" : "#2563eb",
                      border: "4px solid #fff",
                      boxShadow: active
                        ? "0 5px 18px rgba(37,99,235,.35)"
                        : "0 3px 12px rgba(0,0,0,.08)",
                      transition: "0.3s",
                      transform: "translateY(-5px)",
                    }}
                  >
                    {item.icon}
                  </Box>
                ) : (
                  <Box
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: 3,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: active
                        ? "rgba(37,99,235,.12)"
                        : "transparent",
                      transition: "0.3s",
                    }}
                  >
                    {item.icon}
                  </Box>
                )
              }
            />
          );
        })}
      </BottomNavigation>
    </Paper>
  );
};

export default MobileBottomNav;
