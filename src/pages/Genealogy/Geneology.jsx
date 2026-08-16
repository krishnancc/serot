import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import PersonAddAlt1RoundedIcon from "@mui/icons-material/PersonAddAlt1Rounded";

import {
  alpha,
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getMethod } from "../../api/login";
import Layout from "../../components/Layout";

/* ===================================================== */
/* ================= THEME TOKENS ======================= */

const PRIMARY = "#6366F1";
const PRIMARY_DARK = "#4F46E5";
const PRIMARY_LIGHT = "#8B5CF6";
const SURFACE = "#F8FAFC";
const BORDER = "#E2E8F0";
const TEXT_MUTED = "#64748B";
const SUCCESS = "#10B981";
const WARNING = "#F59E0B";
const INFO = "#0EA5E9";

const gradient = `linear-gradient(135deg, ${PRIMARY} 0%, ${PRIMARY_LIGHT} 100%)`;

/* ===================================================== */

export default function GenealogyView() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [drillDown, setDrillDown] = useState([]);
  const [drillLoading, setDrillLoading] = useState(false);

  const [referralId, setReferralId] = useState("");
  const [openAddMember, setOpenAddMember] = useState(false);

  const [currentRootId, setCurrentRootId] = useState(null);
  const [drillHistory, setDrillHistory] = useState([]);

  /* ---------------- TABLE COLUMNS ---------------- */

  const drillColumns = [
    {
      field: "superId",
      headerName: "User ID",
      width: 110,
      renderCell: ({ value }) => (
        <Typography variant="body2" fontWeight={600} color={PRIMARY_DARK}>
          #{value}
        </Typography>
      ),
    },
    {
      field: "username",
      headerName: "Username",
      width: 200,
      renderCell: ({ row, value }) => (
        <Stack direction="row" spacing={1.25} alignItems="center">
          <Avatar
            sx={{
              width: 30,
              height: 30,
              fontSize: 13,
              fontWeight: 700,
              background: gradient,
            }}
          >
            {(value || "U").charAt(0).toUpperCase()}
          </Avatar>
          <Typography variant="body2" fontWeight={500}>
            {value || "—"}
          </Typography>
        </Stack>
      ),
    },
    {
      field: "levelFromRoot",
      headerName: "Level",
      width: 100,
      align: "center",
      headerAlign: "center",
      renderCell: ({ value }) => (
        <Chip
          label={`L${value}`}
          size="small"
          sx={{
            fontWeight: 700,
            color: PRIMARY_DARK,
            bgcolor: alpha(PRIMARY, 0.1),
          }}
        />
      ),
    },
    {
      field: "active",
      headerName: "Status",
      width: 130,
      align: "center",
      headerAlign: "center",
      renderCell: ({ value }) => (
        <Chip
          size="small"
          icon={
            value ? (
              <CheckCircleRoundedIcon sx={{ fontSize: 15 }} />
            ) : (
              <CancelRoundedIcon sx={{ fontSize: 15 }} />
            )
          }
          label={value ? "Active" : "Inactive"}
          sx={{
            fontWeight: 600,
            color: value ? SUCCESS : "#94A3B8",
            bgcolor: value ? alpha(SUCCESS, 0.12) : alpha("#94A3B8", 0.12),
            "& .MuiChip-icon": { color: "inherit" },
          }}
        />
      ),
    },
    {
      field: "teamVolumeUsd",
      headerName: "Team Volume",
      width: 160,
      align: "center",
      headerAlign: "center",
      valueGetter: (_v, row) => row?.earnings?.teamVolumeUsd ?? "0",
      renderCell: ({ value }) => (
        <Typography variant="body2" fontWeight={600}>
          ${value}
        </Typography>
      ),
    },
    {
      field: "joinedAt",
      headerName: "Joined At",
      width: 130,
      align: "right",
      headerAlign: "right",
      renderCell: ({ value }) => (
        <Typography variant="body2" color={TEXT_MUTED}>
          {new Date(value).toLocaleDateString()}
        </Typography>
      ),
    },
  ];

  /* ---------------- HANDLERS ---------------- */

  const handleRowClick = (userId) => {
    if (drillLoading || !userId) return;

    setDrillHistory((prev) => [
      ...prev,
      { rootUserId: currentRootId, data: drillDown },
    ]);

    setCurrentRootId(userId);
    fetchDrillDownline(userId, 10);
  };

  const handleDrillBack = () => {
    if (!drillHistory.length) return;

    const last = drillHistory[drillHistory.length - 1];
    setDrillDown(last.data);
    setCurrentRootId(last.rootUserId);
    setDrillHistory((prev) => prev.slice(0, -1));
  };

  /* ---------------- API CALLS ---------------- */

  const fetchDrillDownline = async (rootUserId, depth = 10) => {
    try {
      setDrillLoading(true);
      const res = await getMethod(
        `/api/mlmTree/drill?rootUserId=${rootUserId}&depth=${depth}`,
      );

      if (res?.error) {
        toast.error(res.error?.message || "Failed to load drill data");
      } else {
        setDrillDown(res.data || []);
      }
    } catch (err) {
      toast.error(err.message || "Failed to load drill data");
    } finally {
      setDrillLoading(false);
    }
  };

  const fetchGenealogy = async () => {
    try {
      setLoading(true);
      const res = await getMethod("/api/mlmTree/info");

      if (res?.error) {
        toast.error(res.error?.message || "Failed to load genealogy data");
        return;
      }

      setData(res.data);

      const sponsorSuperId = String(res.data?.me?.superId || "");
      setReferralId(sponsorSuperId);

      const rootUserId = res.data?.me?.userId;
      if (rootUserId) {
        setCurrentRootId(rootUserId);
        fetchDrillDownline(rootUserId, 10);
      }
    } catch (err) {
      toast.error(err.message || "Failed to load genealogy data");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- EFFECTS ---------------- */

  useEffect(() => {
    fetchGenealogy();
  }, []);

  /* ---------------- STATES ---------------- */

  if (loading) {
    return (
      <Layout>
        <Box
          sx={{
            minHeight: "60vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Box
            sx={{
              width: 55,
              height: 55,
              borderRadius: "50%",
              border: "5px solid #e2e8f0",
              borderTop: "5px solid #2563eb",
              animation: "spin 1s linear infinite",
              "@keyframes spin": {
                "0%": {
                  transform: "rotate(0deg)",
                },
                "100%": {
                  transform: "rotate(360deg)",
                },
              },
            }}
          />

          <Typography
            sx={{
              fontSize: 14,
              fontWeight: 600,
              color: "#475569",
            }}
          >
            Loading Geneology...
          </Typography>
        </Box>
      </Layout>
    );
  }

  if (!data) {
    return <Typography>No genealogy data</Typography>;
  }

  const { network = {}, earnings = {} } = data;

  /* ===================================================== */

  return (
    <>
      {/* ================= HEADER ================= */}

      {/* ================= NETWORK STATS ================= */}

      {/* ================= MAIN ================= */}
      <Grid container spacing={{ xs: 2, md: 3 }}>
        {/* LEFT */}
        <Grid size={{ xs: 12, md: 8, lg: 9 }}>
          <Card
            elevation={0}
            sx={{
              border: `1px solid ${BORDER}`,
              borderRadius: 3,
              p: { xs: 2, sm: 3 },
            }}
          >
            <Box
              display="flex"
              flexDirection={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", sm: "center" }}
              gap={1.5}
              mb={2}
            >
              <Typography variant="subtitle1" fontWeight={700}>
                Level Info
              </Typography>

              <Button
                variant="contained"
                startIcon={<PersonAddAlt1RoundedIcon />}
                onClick={() => setOpenAddMember(true)}
                sx={{
                  background: gradient,
                  borderRadius: 2.5,
                  px: 2.5,
                  fontWeight: 600,
                  boxShadow: `0 8px 20px ${alpha(PRIMARY, 0.35)}`,
                  "&:hover": {
                    background: `linear-gradient(135deg, ${PRIMARY_DARK} 0%, ${PRIMARY} 100%)`,
                  },
                }}
              >
                Add Member
              </Button>
            </Box>

            <Divider sx={{ borderColor: BORDER, mb: 2 }} />

            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="subtitle1" fontWeight={700}>
                  Drill Down
                </Typography>
                {currentRootId && (
                  <Chip
                    size="small"
                    label={`Root #${currentRootId}`}
                    sx={{
                      bgcolor: alpha(PRIMARY, 0.1),
                      color: PRIMARY_DARK,
                      fontWeight: 600,
                    }}
                  />
                )}
              </Stack>

              <Button
                size="small"
                startIcon={<ArrowBackRoundedIcon sx={{ fontSize: 16 }} />}
                disabled={!drillHistory.length}
                onClick={handleDrillBack}
                sx={{
                  color: PRIMARY_DARK,
                  fontWeight: 600,
                  "&.Mui-disabled": { color: "#CBD5E1" },
                }}
              >
                Back
              </Button>
            </Box>

            {isMobile ? (
              <MobileDrillList
                rows={drillDown}
                loading={drillLoading}
                onRowTap={handleRowClick}
              />
            ) : (
              <Box sx={{ position: "relative" }}>
                <DataGrid
                  rows={drillDown}
                  columns={drillColumns}
                  getRowId={(row) => row.userId}
                  autoHeight
                  density="standard"
                  loading={drillLoading}
                  onRowClick={(params) => handleRowClick(params.row.userId)}
                  disableRowSelectionOnClick
                  pageSizeOptions={[10]}
                  initialState={{
                    pagination: {
                      paginationModel: { pageSize: 10, page: 0 },
                    },
                  }}
                  slots={{ loadingOverlay: GridLoader }}
                  sx={{
                    border: "none",
                    backgroundColor: "transparent",

                    "& .MuiDataGrid-columnHeaders": {
                      backgroundColor: SURFACE,
                      borderBottom: `1px solid ${BORDER}`,
                    },
                    "& .MuiDataGrid-columnHeader": {
                      display: "flex",
                      alignItems: "center",
                    },
                    "& .MuiDataGrid-columnHeaderTitle": {
                      fontWeight: 700,
                      color: TEXT_MUTED,
                      fontSize: 12.5,
                      textTransform: "uppercase",
                      letterSpacing: "0.03em",
                    },
                    "& .MuiDataGrid-cell": {
                      display: "flex",
                      alignItems: "center",
                      borderBottom: `1px solid ${alpha(BORDER, 0.7)}`,
                    },
                    "& .MuiDataGrid-row": { cursor: "pointer" },
                    "& .MuiDataGrid-row:hover": {
                      backgroundColor: alpha(PRIMARY, 0.04),
                    },
                    "& .MuiDataGrid-columnSeparator": { display: "none" },
                    "& .MuiDataGrid-cell:focus, & .MuiDataGrid-columnHeader:focus":
                      { outline: "none" },
                    "& .MuiDataGrid-footerContainer": {
                      borderTop: `1px solid ${BORDER}`,
                    },
                  }}
                />
              </Box>
            )}
          </Card>
        </Grid>

        {/* RIGHT */}
        <Grid size={{ xs: 12, md: 4, lg: 3 }}>
          <Card
            elevation={0}
            sx={{
              border: `1px solid ${BORDER}`,
              borderRadius: 3,
              p: { xs: 2, sm: 3 },
              position: { md: "sticky" },
              top: { md: 24 },
            }}
          >
            <Typography variant="subtitle1" fontWeight={700} mb={2}>
              Earnings
            </Typography>

            <Earning label="Direct Income" value={earnings.directIncome} />
            <Divider sx={{ my: 2, borderColor: BORDER }} />
            <Earning label="Level Income" value={earnings.levelIncome} />
            <Divider sx={{ my: 2, borderColor: BORDER }} />

            <Box
              sx={{
                mt: 1,
                p: 2,
                borderRadius: 2.5,
                background: gradient,
              }}
            >
              <Typography variant="h4" fontWeight={800} color="#fff">
                ${earnings.totalIncome ?? 0}
              </Typography>
              <Typography color={alpha("#fff", 0.85)} variant="body2" mt={0.5}>
                Total Income
              </Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* ================= ADD MEMBER MODAL ================= */}
      {/* <AddMemberModal
                open={openAddMember}
                referralId={referralId}
                onClose={() => setOpenAddMember(false)}
                onSuccess={() => {
                    if (currentRootId) {
                        fetchGenealogy();
                    }
                }}
            /> */}
    </>
  );
}

/* ===================================================== */
/* ================= SMALL HELPERS ===================== */

const StatCard = ({ title, value = 0, icon, accent, subtitle }) => (
  <Grid size={{ xs: 6, sm: 6, md: 3 }}>
    <Card
      elevation={0}
      sx={{
        position: "relative",
        overflow: "hidden",
        height: "100%",
        minHeight: {
          xs: 130,
          sm: 150,
          md: 165,
        },

        borderRadius: {
          xs: 3,
          md: 4,
        },

        p: {
          xs: 1.5,
          sm: 2,
          md: 2.5,
        },

        border: "1px solid",
        borderColor: alpha(accent, 0.18),

        background: `
                    linear-gradient(
                        145deg,
                        rgba(255,255,255,0.95),
                        rgba(250,250,250,0.85)
                    )
                `,

        backdropFilter: "blur(10px)",

        transition: "all .3s ease",

        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: `0 15px 35px ${alpha(accent, 0.18)}`,
        },
      }}
    >
      {/* Glow Background */}
      <Box
        sx={{
          position: "absolute",
          width: 90,
          height: 90,
          right: -25,
          top: -25,
          borderRadius: "50%",
          background: `radial-gradient(
                        circle,
                        ${alpha(accent, 0.22)},
                        transparent 70%
                    )`,
        }}
      />

      {/* Top Section */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        position="relative"
      >
        {/* Text */}
        <Box>
          <Typography
            sx={{
              fontSize: {
                xs: 10,
                sm: 11,
                md: 12,
              },
              fontWeight: 700,
              color: TEXT_MUTED,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            {title}
          </Typography>

          <Typography
            sx={{
              mt: 0.8,
              fontWeight: 900,
              lineHeight: 1,

              fontSize: {
                xs: 24,
                sm: 30,
                md: 36,
              },

              background: `linear-gradient(
                                90deg,
                                ${accent},
                                ${alpha(accent, 0.65)}
                            )`,

              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {value}
          </Typography>
        </Box>

        {/* Icon */}
        <Box
          sx={{
            width: {
              xs: 38,
              sm: 46,
              md: 52,
            },

            height: {
              xs: 38,
              sm: 46,
              md: 52,
            },

            borderRadius: "18px",

            display: "flex",
            alignItems: "center",
            justifyContent: "center",

            color: accent,

            background: `linear-gradient(
                            135deg,
                            ${alpha(accent, 0.2)},
                            ${alpha(accent, 0.08)}
                        )`,

            boxShadow: `inset 0 0 15px ${alpha(accent, 0.12)}`,

            "& svg": {
              fontSize: {
                xs: 20,
                sm: 24,
                md: 28,
              },
            },
          }}
        >
          {icon}
        </Box>
      </Stack>

      {/* Bottom Info */}
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        mt={{
          xs: 1.5,
          md: 2,
        }}
      >
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: accent,
          }}
        />

        <Typography
          sx={{
            fontSize: {
              xs: 11,
              sm: 12,
            },
            color: TEXT_MUTED,
            fontWeight: 600,
          }}
        >
          {subtitle}
        </Typography>
      </Stack>

      {/* Bottom Accent */}
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 3,
          background: `linear-gradient(
                        90deg,
                        ${accent},
                        transparent
                    )`,
        }}
      />
    </Card>
  </Grid>
);

const Earning = ({ label, value = 0 }) => (
  <Box>
    <Typography variant="h5" fontWeight={700} color="text.primary">
      ${value}
    </Typography>
    <Typography color={TEXT_MUTED} variant="body2">
      {label}
    </Typography>
  </Box>
);

const GridLoader = () => (
  <Box height="100%" display="flex" alignItems="center" justifyContent="center">
    <CircularProgress size={32} sx={{ color: PRIMARY }} />
  </Box>
);

/* ---------------- MOBILE DRILL LIST ---------------- */
/* DataGrid is not a great fit under ~600px, so on mobile we render
   the same drill-down data as a tappable card list instead. */

const MobileDrillList = ({ rows, loading, onRowTap }) => {
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={4}>
        <CircularProgress size={28} sx={{ color: PRIMARY }} />
      </Box>
    );
  }

  if (!rows?.length) {
    return (
      <Box py={4} textAlign="center">
        <Typography color={TEXT_MUTED} variant="body2">
          No downline members at this level
        </Typography>
      </Box>
    );
  }

  return (
    <Stack spacing={1.25}>
      {rows.map((row) => (
        <Box
          key={row.userId}
          onClick={() => onRowTap(row.userId)}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            p: 1.5,
            borderRadius: 2.5,
            border: `1px solid ${BORDER}`,
            cursor: "pointer",
            transition: "background-color 0.15s ease",
            "&:active": { bgcolor: alpha(PRIMARY, 0.06) },
          }}
        >
          <Avatar
            sx={{
              width: 38,
              height: 38,
              fontWeight: 700,
              background: gradient,
            }}
          >
            {(row.username || "U").charAt(0).toUpperCase()}
          </Avatar>

          <Box flexGrow={1} minWidth={0}>
            <Stack direction="row" spacing={0.75} alignItems="center">
              <Typography variant="body2" fontWeight={600} noWrap>
                {row.username || `#${row.superId}`}
              </Typography>
              <Chip
                size="small"
                label={`L${row.levelFromRoot}`}
                sx={{
                  height: 18,
                  fontSize: 11,
                  fontWeight: 700,
                  color: PRIMARY_DARK,
                  bgcolor: alpha(PRIMARY, 0.1),
                }}
              />
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center" mt={0.25}>
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  bgcolor: row.active ? SUCCESS : "#CBD5E1",
                }}
              />
              <Typography variant="caption" color={TEXT_MUTED}>
                {row.active ? "Active" : "Inactive"} · $
                {row?.earnings?.teamVolumeUsd ?? "0"} vol.
              </Typography>
            </Stack>
          </Box>

          <ChevronRightRoundedIcon sx={{ color: "#CBD5E1" }} />
        </Box>
      ))}
    </Stack>
  );
};
