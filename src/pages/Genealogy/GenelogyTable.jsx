import AccountTreeRoundedIcon from "@mui/icons-material/AccountTreeRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import CircleIcon from "@mui/icons-material/Circle";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import PaidRoundedIcon from "@mui/icons-material/PaidRounded";
import PersonAddAlt1RoundedIcon from "@mui/icons-material/PersonAddAlt1Rounded";
import {
  alpha,
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  Divider,
  Pagination,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useState } from "react";
import { AddMemberModal } from "./add-member-modal";

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

const GenelogyTable = ({
  referralId,
  drillDown,
  drillLoading,
  currentRootId,
  drillHistory,
  setDrillDown,
  setCurrentRootId,
  setDrillHistory,
  fetchDrillDownline,
  fetchGenealogy,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [openAddMember, setOpenAddMember] = useState(false);

  /* ---------------- TABLE COLUMNS ---------------- */
  const drillColumns = [
    {
      field: "levelFromRoot",
      headerName: "Level",
      width: 160,
      align: "start",
      headerAlign: "start",

      renderCell: ({ value }) => (
        <Chip
          label={`Level ${value}`}
          size="small"
          sx={{
            height: 28,
            fontWeight: 700,
            borderRadius: 2,
            color: PRIMARY_DARK,
            bgcolor: alpha(PRIMARY, 0.12),
          }}
        />
      ),
    },

    {
      field: "superId",
      headerName: "User ID",
      width: 160,
      align: "start",
      headerAlign: "start",
      renderCell: ({ value }) => (
        <Box
          sx={{
            borderRadius: 2,
            fontWeight: 700,
            fontSize: 14,
          }}
        >
          SR{value}
        </Box>
      ),
    },

    {
      field: "username",
      headerName: "Username",
      // flex: 1,
      minWidth: 160,
      align: "start",
      headerAlign: "start",
      renderCell: ({ value, row }) => (
        <Box
          sx={{
            borderRadius: 2,
            fontWeight: 700,
            fontSize: 14,
          }}
        >
          {value || "Unknown"}
        </Box>
      ),
    },

    {
      field: "teamVolumeUsd",
      headerName: "Team Volume",
      width: 160,
      align: "center",
      headerAlign: "center",

      valueGetter: (_v, row) => row?.earnings?.teamVolumeUsd || 0,

      renderCell: ({ value }) => (
        <Box
          sx={{
            borderRadius: 2,
            fontWeight: 700,
            fontSize: 14,
          }}
        >
          ${Number(value).toLocaleString()}
        </Box>
      ),
    },

    {
      field: "active",
      headerName: "Status",
      width: 160,
      align: "center",
      headerAlign: "center",

      renderCell: ({ value }) => (
        <Chip
          size="small"
          icon={value ? <CheckCircleRoundedIcon /> : <CancelRoundedIcon />}
          label={value ? "Active" : "Inactive"}
          sx={{
            height: 28,
            fontWeight: 700,
            borderRadius: 2,
            color: value ? SUCCESS : "#64748B",
            bgcolor: value ? alpha(SUCCESS, 0.12) : alpha("#64748B", 0.12),

            "& svg": {
              fontSize: 16,
            },
          }}
        />
      ),
    },

    {
      field: "joinedAt",
      headerName: "Date",
      width: 160,
      align: "right",
      headerAlign: "right",

      renderCell: ({ value }) => (
        <Box
          sx={{
            borderRadius: 2,
            fontWeight: 700,
            fontSize: 14,
          }}
        >
          {value
            ? new Date(value).toLocaleDateString("en-US", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : "—"}
        </Box>
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

  return (
    <>
      <Card
        elevation={0}
        sx={{
          position: "relative",
          overflow: "hidden",
          borderRadius: 4,
          border: `1px solid ${BORDER}`,
          background: `
            linear-gradient(
                145deg,
                ${alpha(PRIMARY, 0.04)} 0%,
                transparent 35%
            ),
            #fff
        `,
          p: {
            xs: 2,
            sm: 3,
          },
        }}
      >
        {/* Decorative Glow */}
        <Box
          sx={{
            position: "absolute",
            right: -50,
            top: -50,
            width: 160,
            height: 160,
            borderRadius: "50%",
            background: alpha(PRIMARY, 0.08),
            filter: "blur(20px)",
          }}
        />

        {/* Header */}
        <Box
          sx={{
            display: "flex",
            flexDirection: {
              xs: "column",
              sm: "row",
            },
            alignItems: {
              xs: "stretch",
              sm: "center",
            },
            width: "100%",
            gap: 2,
            mb: 2.5,
          }}
        >
          {/* Left Side */}
          <Stack
            direction="row"
            spacing={1.5}
            alignItems="center"
            sx={{
              flex: 1,
            }}
          >
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: 2.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: gradient,
                color: "#fff",
                boxShadow: `0 8px 20px ${alpha(PRIMARY, 0.25)}`,
              }}
            >
              <GroupsRoundedIcon />
            </Box>

            <Box>
              <Typography
                fontWeight={900}
                fontSize={{
                  xs: 20,
                  sm: 22,
                  md: 24,
                }}
                lineHeight={1.15}
              >
                Level Info
              </Typography>

              <Typography
                sx={{
                  color: TEXT_MUTED,
                  fontSize: {
                    xs: 13,
                    sm: 14,
                  },
                  mt: 0.3,
                  fontWeight: 500,
                }}
              >
                Manage your network members
              </Typography>
            </Box>
          </Stack>

          {/* Right Side Button */}
          <Box
            sx={{
              display: "flex",
              justifyContent: {
                xs: "stretch",
                sm: "flex-end",
              },
            }}
          >
            <Button
              fullWidth={isMobile}
              variant="contained"
              startIcon={<PersonAddAlt1RoundedIcon />}
              onClick={() => setOpenAddMember(true)}
              sx={{
                height: 42,
                px: 2.5,
                borderRadius: 3,
                textTransform: "none",
                fontWeight: 700,
                background: gradient,
                boxShadow: `0 10px 25px ${alpha(PRIMARY, 0.3)}`,

                "&:hover": {
                  background: `linear-gradient(
                            135deg,
                            ${PRIMARY_DARK},
                            ${PRIMARY}
                        )`,
                },
              }}
            >
              Add Member
            </Button>
          </Box>
        </Box>

        <Divider
          sx={{
            borderColor: BORDER,
            mb: 2.5,
          }}
        />

        {/* Drill Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography
              sx={{
                fontWeight: 600,
              }}
              fontSize={15}
            >
              Drill Down
            </Typography>

            {currentRootId && (
              <Chip
                size="small"
                label={`Root #${currentRootId}`}
                sx={{
                  height: 24,
                  borderRadius: 2,
                  background: alpha(PRIMARY, 0.12),
                  color: PRIMARY_DARK,
                  fontWeight: 700,
                  fontSize: 12,
                }}
              />
            )}
          </Stack>

          <Button
            size="small"
            disabled={!drillHistory?.length}
            onClick={handleDrillBack}
            startIcon={<ArrowBackRoundedIcon fontSize="small" />}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 700,
              color: PRIMARY_DARK,

              "&.Mui-disabled": {
                color: "#CBD5E1",
              },
            }}
          >
            Back
          </Button>
        </Box>

        {isMobile ? (
          <Box
            sx={{
              mt: 2,
              borderRadius: 3,
              overflow: "hidden",
            }}
          >
            <MobileDrillList
              rows={drillDown}
              loading={drillLoading}
              onRowTap={handleRowClick}
            />
          </Box>
        ) : (
          <Box
            sx={{
              mt: 2,
              borderRadius: 3,
              overflow: "hidden",
              border: `1px solid ${BORDER}`,
            }}
          >
            <Box
              sx={{
                borderRadius: 3,
                overflow: "hidden",
                border: `1px solid ${BORDER}`,
                background: "#fff",
              }}
            >
              <DataGrid
                rows={drillLoading ? [] : drillDown || []}
                columns={drillColumns}
                getRowId={(row) => row.userId}
                autoHeight
                loading={drillLoading}
                density="comfortable"
                onRowClick={(params) => handleRowClick(params.row.userId)}
                disableRowSelectionOnClick
                disableColumnMenu
                pageSizeOptions={[10, 25, 50]}
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 10,
                      page: 0,
                    },
                  },
                }}
                slots={{
                  loadingOverlay: GridLoader,
                }}
                sx={{
                  border: "none",

                  "& .MuiDataGrid-main": {
                    borderRadius: 3,
                  },

                  "& .MuiDataGrid-columnHeaders": {
                    background: `linear-gradient(
                    90deg,
                    ${alpha(PRIMARY, 0.08)},
                    ${alpha(PRIMARY_LIGHT, 0.04)}
                )`,
                    borderBottom: `1px solid ${BORDER}`,
                    minHeight: 56,
                  },

                  "& .MuiDataGrid-columnHeader": {
                    "&:focus": {
                      outline: "none",
                    },
                  },

                  "& .MuiDataGrid-columnHeaderTitle": {
                    fontSize: 11,
                    fontWeight: 800,
                    color: TEXT_MUTED,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  },

                  "& .MuiDataGrid-cell": {
                    borderBottom: `1px solid ${alpha(BORDER, 0.6)}`,
                    color: "#334155",
                    fontSize: 14,

                    "&:focus": {
                      outline: "none",
                    },
                  },

                  "& .MuiDataGrid-row": {
                    transition: "all .2s ease",
                    cursor: "pointer",

                    "&:hover": {
                      background: alpha(PRIMARY, 0.05),
                      transform: "scale(1.003)",
                      boxShadow: "0 4px 14px rgba(15,23,42,.06)",
                    },
                  },

                  "& .MuiDataGrid-row.Mui-selected": {
                    background: alpha(PRIMARY, 0.08),

                    "&:hover": {
                      background: alpha(PRIMARY, 0.12),
                    },
                  },

                  "& .MuiDataGrid-footerContainer": {
                    borderTop: `1px solid ${BORDER}`,
                    background: "#FAFAFC",
                    minHeight: 55,
                  },

                  "& .MuiTablePagination-root": {
                    color: TEXT_MUTED,
                  },

                  "& .MuiDataGrid-virtualScroller": {
                    minHeight: 150,
                  },

                  "& .MuiDataGrid-columnSeparator": {
                    display: "none",
                  },
                }}
              />
            </Box>
          </Box>
        )}

        <AddMemberModal
          open={openAddMember}
          referralId={referralId}
          onClose={() => setOpenAddMember(false)}
          onSuccess={() => {
            setOpenAddMember(false);
            if (currentRootId) {
              fetchDrillDownline(currentRootId, 10);
            }
            fetchGenealogy();
          }}
        />
      </Card>
    </>
  );
};

export default GenelogyTable;

const GridLoader = () => (
  <Box
    sx={{
      minHeight: "20vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      gap: 2,
    }}
  >
    <Box
      sx={{
        width: 24,
        height: 24,
        borderRadius: "50%",
        border: "4px solid #e2e8f0",
        borderTop: "4px solid #2563eb",
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
      Loading...
    </Typography>
  </Box>
);

const ITEMS_PER_PAGE = 5;

const MobileDrillList = ({ rows, loading, onRowTap }) => {
  const [page, setPage] = useState(1);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "10vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Box
          sx={{
            width: 24,
            height: 24,
            borderRadius: "50%",
            border: "4px solid #e2e8f0",
            borderTop: "4px solid #2563eb",
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
          Loading downline...
        </Typography>
      </Box>
    );
  }

  if (!rows?.length) {
    return (
      <Box
        sx={{
          minHeight: "10vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography color="text.secondary">No downline members</Typography>
      </Box>
    );
  }

  const totalPages = Math.ceil(rows.length / ITEMS_PER_PAGE);

  const paginatedRows = rows.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  return (
    <>
      <Stack spacing={1.5}>
        {paginatedRows.map((row) => (
          <Card
            key={row.userId}
            onClick={() => onRowTap(row.userId)}
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 3,
              border: `1px solid ${alpha(BORDER, 0.8)}`,
              cursor: "pointer",

              transition: "all .2s ease",

              "&:hover": {
                borderColor: PRIMARY,
                bgcolor: alpha(PRIMARY, 0.02),
              },

              "&:active": {
                transform: "scale(.99)",
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <Stack
                direction="row"
                spacing={1.5}
                alignItems="center"
                flex={1}
                minWidth={0}
              >
                <Avatar
                  sx={{
                    width: 46,
                    height: 46,
                    bgcolor: alpha(PRIMARY, 0.12),
                    color: PRIMARY,
                    fontWeight: 700,
                  }}
                >
                  {(row.username || "U")[0].toUpperCase()}
                </Avatar>

                <Box minWidth={0}>
                  <Typography
                    noWrap
                    sx={{
                      fontSize: 15,
                      fontWeight: 700,
                    }}
                  >
                    {row.username || "Unknown User"}
                  </Typography>

                  <Typography
                    variant="caption"
                    sx={{
                      color: TEXT_MUTED,
                    }}
                  >
                    ID : {row.superId}
                  </Typography>
                </Box>
              </Stack>

              <ChevronRightRoundedIcon
                sx={{
                  color: "#94A3B8",
                  fontSize: 22,
                }}
              />
            </Box>

            <Divider sx={{ my: 1.5 }} />

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <Stack spacing={0.3}>
                <CircleIcon
                  sx={{
                    fontSize: 10,
                    color: row.active ? SUCCESS : "#CBD5E1",
                  }}
                />

                <Typography variant="caption" fontWeight={600}>
                  {row.active ? "Active" : "Inactive"}
                </Typography>
              </Stack>

              <Stack spacing={0.3} alignItems="center">
                <AccountTreeRoundedIcon
                  sx={{
                    fontSize: 18,
                    color: PRIMARY,
                  }}
                />

                <Typography variant="caption" fontWeight={600}>
                  Level {row.levelFromRoot}
                </Typography>
              </Stack>

              <Stack spacing={0.3} alignItems="flex-end">
                <PaidRoundedIcon
                  sx={{
                    fontSize: 18,
                    color: SUCCESS,
                  }}
                />

                <Typography variant="caption" fontWeight={600}>
                  ${row?.earnings?.teamVolumeUsd ?? 0}
                </Typography>
              </Stack>
            </Box>
          </Card>
        ))}
      </Stack>

      {/* Pagination only when more than 1 row */}
      {/* Modern Pagination */}
      {rows.length > 1 && (
        <Box
          sx={{
            mt: 2.5,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              px: 1.2,
              py: 0.8,
              borderRadius: 3,
              background: "#FFFFFF",
              border: `1px solid ${alpha(BORDER, 0.8)}`,
              boxShadow: "0 4px 16px rgba(15,23,42,0.06)",
            }}
          >
            <Pagination
              count={totalPages}
              page={page}
              onChange={(e, value) => setPage(value)}
              size="small"
              shape="rounded"
              color="primary"
              siblingCount={0}
              boundaryCount={1}
              sx={{
                "& .MuiPaginationItem-root": {
                  minWidth: 34,
                  height: 34,
                  borderRadius: 2,
                  fontSize: 13,
                  fontWeight: 700,
                  color: TEXT_MUTED,
                  transition: "all .2s ease",

                  "&:hover": {
                    backgroundColor: alpha(PRIMARY, 0.08),
                  },
                },

                "& .Mui-selected": {
                  backgroundColor: `${PRIMARY} !important`,
                  color: "#fff",
                  boxShadow: `0 4px 12px ${alpha(PRIMARY, 0.35)}`,

                  "&:hover": {
                    backgroundColor: PRIMARY,
                  },
                },

                "& .MuiPaginationItem-previousNext": {
                  backgroundColor: alpha(PRIMARY, 0.08),
                  color: PRIMARY,

                  "&:hover": {
                    backgroundColor: alpha(PRIMARY, 0.15),
                  },
                },
              }}
            />
          </Box>
        </Box>
      )}
    </>
  );
};
