import RefreshIcon from "@mui/icons-material/Refresh";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

import {
  alpha,
  Box,
  Card,
  CircularProgress,
  Divider,
  IconButton,
  MenuItem,
  Pagination,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

import { getMethod } from "../../api/login";

const PRIMARY = "#6366F1";
const PRIMARY_DARK = "#4F46E5";
const ACCENT = "#8B5CF6";
const BORDER = "#E2E8F0";
const TEXT_MUTED = "#64748B";
const gradient = `linear-gradient(135deg, ${PRIMARY}, ${ACCENT})`;

const LedgerTransactions = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [ledgerRows, setLedgerRows] = useState([]);
  const [ledgerRowCount, setLedgerRowCount] = useState(0);
  const [ledgerLoading, setLedgerLoading] = useState(false);
  const [ledgerSource, setLedgerSource] = useState("");

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 15, // 25
  });

  const [sortField, setSortField] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  const ledgerColumns = useMemo(
    () => [
      {
        field: "currency",
        headerName: "Currency",
        width: 185,
        align: "left",
        headerAlign: "left",
        renderCell: ({ value }) => (
          <Box
            sx={{
              py: 0.4,
              borderRadius: 2,
              fontWeight: 700,
              fontSize: 14,
            }}
          >
            {value}
          </Box>
        ),
      },
      {
        field: "amount",
        headerName: "Amount",
        width: 185,
        align: "left",
        headerAlign: "left",
        renderCell: ({ value, row }) => (
          <Box
            sx={{
              py: 0.4,
              borderRadius: 2,
              fontWeight: 700,
              fontSize: 14,
              color: row.entryType === "CREDIT" ? "success.main" : "error.main",
            }}
          >
            {row.entryType === "CREDIT" ? "+ " : "- "}
            {value}
          </Box>
        ),
      },
      {
        field: "balanceType",
        headerName: "Wallet",
        width: 185,
        align: "left",
        headerAlign: "left",
        renderCell: ({ value }) => (
          <Box
            sx={{
              py: 0.4,
              borderRadius: 2,
              fontWeight: 700,
              fontSize: 14,
            }}
          >
            {value === "FUND"
              ? "SUPER"
              : value === "MAIN"
                ? "AVAILABLE"
                : value}
          </Box>
        ),
      },
      {
        field: "entryType",
        headerName: "Type",
        width: 185,
        align: "left",
        headerAlign: "left",
        renderCell: ({ value }) => (
          <Box
            sx={{
              px: 1.2,
              py: 0.4,
              borderRadius: 2,
              fontWeight: 700,
              fontSize: 14,
              color: value === "CREDIT" ? "success.main" : "error.main",
            }}
          >
            {value}
          </Box>
        ),
      },
      {
        field: "source",
        headerName: "Source",
        width: 185,
        align: "left",
        headerAlign: "left",
        renderCell: ({ value }) => (
          <Box
            sx={{
              py: 0.4,
              borderRadius: 2,
              fontWeight: 700,
              fontSize: 14,
            }}
          >
            {value === "DIRECT" ? "SPOT" : value}
          </Box>
        ),
      },
      {
        field: "status",
        headerName: "Status",
        width: 185,
        align: "left",
        headerAlign: "left",
        renderCell: ({ value }) => (
          <Box
            sx={{
              py: 0.4,
              borderRadius: 2,
              fontWeight: 700,
              fontSize: 14,
              color: value === "CREDITED" ? "success.main" : "error.main",
            }}
          >
            {value}
          </Box>
        ),
      },
      {
        field: "createdAt",
        headerName: "Date",
        width: 185,
        align: "right",
        headerAlign: "right",

        renderCell: ({ value }) => (
          <Box
            sx={{
              py: 0.4,
              borderRadius: 2,
              fontWeight: 700,
              fontSize: 14,
            }}
          >
            {new Date(value).toLocaleString()}
          </Box>
        ),
      },
    ],
    [],
  );

  const fetchLedger = async () => {
    try {
      setLedgerLoading(true);
      const { page, pageSize } = paginationModel;

      const res = await getMethod(
        `/api/wallet/ledger?page=${page}&pageSize=${pageSize}&sortField=${sortField}&sortOrder=${sortOrder}&source=${ledgerSource}`,
      );

      if (res?.error) {
        toast.error(res.error?.message || "Failed to load ledger");
        return;
      }

      setLedgerRows(res.rows || []);
      setLedgerRowCount(res.rowCount || 0);
    } catch (err) {
      toast.error(err.message || "Failed to load ledger");
    } finally {
      setLedgerLoading(false);
    }
  };

  useEffect(() => {
    fetchLedger();
  }, [
    paginationModel.page,
    paginationModel.pageSize,
    sortField,
    sortOrder,
    ledgerSource,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(ledgerRowCount / paginationModel.pageSize),
  );

  return (
    <Card
      elevation={0}
      sx={{
        position: "relative",
        borderRadius: 4,
        border: `1px solid ${alpha(BORDER, 0.8)}`,
        background: `linear-gradient(145deg, ${alpha(PRIMARY, 0.04)}, #ffffff 45%)`,
        overflow: "hidden",
        transition: "all .25s ease",
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
          pointerEvents: "none",
        }}
      />

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "flex-start", sm: "center" },
          justifyContent: "space-between",
          width: "100%",
          gap: 1.5,
          mb: 2,
          px: { xs: 1.5, sm: 2.5 },
          pt: { xs: 1.5, sm: 2.5 },
        }}
      >
        <Stack
          direction="row"
          spacing={1.5}
          alignItems="center"
          sx={{ flex: 1, width: "100%", justifyContent: "space-between" }}
        >
          <Typography
            fontWeight={900}
            fontSize={{ xs: 18, sm: 22, md: 24 }}
            lineHeight={1.15}
          >
            Ledger Transactions
          </Typography>

          {isMobile && (
            <IconButton
              onClick={fetchLedger}
              disabled={ledgerLoading}
              size="small"
              sx={{
                pr: 4.5, // increase clickable padding
              }}
            >
              {ledgerLoading ? (
                <CircularProgress size={16} />
              ) : (
                <RefreshIcon
                  sx={{
                    fontSize: 20,
                    color: "#2563eb",
                  }}
                />
              )}
            </IconButton>
          )}
        </Stack>

        {!isMobile && (
          <IconButton
            sx={{ mr: 4.5 }}
            onClick={fetchLedger}
            disabled={ledgerLoading}
          >
            {ledgerLoading ? (
              <CircularProgress size={18} />
            ) : (
              <RefreshIcon sx={{ fontSize: 22, color: "#2563eb" }} />
            )}
          </IconButton>
        )}
      </Box>

      <Divider sx={{ borderColor: BORDER, mb: 2 }} />

      <Box sx={{ mx: { xs: 1.5, sm: 2.5 }, mb: 2 }}>
        <TextField
          select
          fullWidth={isMobile}
          size="small"
          label="Ledger Type"
          value={ledgerSource}
          onChange={(e) => {
            setLedgerSource(e.target.value);
            setPaginationModel((prev) => ({ ...prev, page: 0 }));
          }}
          sx={{ minWidth: { xs: "100%", sm: 185 } }}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="ROI">ROI</MenuItem>
          <MenuItem value="DIRECT">DIRECT</MenuItem>
          <MenuItem value="LEVEL">LEVEL</MenuItem>
          <MenuItem value="REWARD">REWARD</MenuItem>
          <MenuItem value="PURCHASE">PURCHASE</MenuItem>
          <MenuItem value="WITHDRAWAL">WITHDRAWAL</MenuItem>
        </TextField>
      </Box>

      {isMobile ? (
        <MobileLedgerList
          rows={ledgerRows}
          loading={ledgerLoading}
          page={paginationModel.page}
          totalPages={totalPages}
          onPageChange={(newPage) =>
            setPaginationModel((prev) => ({ ...prev, page: newPage }))
          }
        />
      ) : (
        <Box
          sx={{
            borderRadius: 3,
            overflow: "hidden",
            border: `1px solid ${BORDER}`,
            background: "#fff",
            boxShadow: "0 8px 30px rgba(15,23,42,0.06)",
            mx: 2.5,
            mb: 2.5,
          }}
        >
          <DataGrid
            rows={ledgerRows}
            columns={ledgerColumns}
            rowCount={ledgerRowCount}
            loading={ledgerLoading}
            paginationMode="server"
            sortingMode="server"
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            autoHeight
            density="comfortable"
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
              noRowsOverlay: EmptyState,
            }}
            disableRowSelectionOnClick
            disableColumnMenu
            sx={{
              border: "none",
              background: "#fff",

              /* Header */
              "& .MuiDataGrid-columnHeaders": {
                minHeight: 54,
                background: `linear-gradient(
                                                      135deg,
                                                      ${alpha(PRIMARY, 0.08)},
                                                      ${alpha(PRIMARY, 0.04)}
                                                  )`,
                borderBottom: `1px solid ${BORDER}`,
              },

              "& .MuiDataGrid-columnHeader": {
                px: 2,
              },

              "& .MuiDataGrid-columnHeaderTitle": {
                fontSize: 12,
                fontWeight: 800,
                color: "#475569",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              },

              /* Rows */
              "& .MuiDataGrid-row": {
                minHeight: 58,
                transition: "all .25s ease",
              },

              "& .MuiDataGrid-row:nth-of-type(even)": {
                backgroundColor: alpha(PRIMARY, 0.015),
              },

              "& .MuiDataGrid-row:hover": {
                backgroundColor: alpha(PRIMARY, 0.07),
                cursor: "pointer",
                transform: "scale(1.002)",
                boxShadow: `0 4px 12px ${alpha(PRIMARY, 0.12)}`,
                zIndex: 1,
              },

              /* Cells */
              "& .MuiDataGrid-cell": {
                borderBottom: `1px solid ${alpha(BORDER, 0.65)}`,
                fontSize: 14,
                color: "#334155",
                px: 2,
              },

              "& .MuiDataGrid-cell:first-of-type": {
                fontWeight: 700,
                color: "#0f172a",
              },

              /* Remove focus outline */
              "& .MuiDataGrid-cell:focus-within, \
                                              & .MuiDataGrid-columnHeader:focus-within":
                {
                  outline: "none",
                },

              /* Remove separator */
              "& .MuiDataGrid-columnSeparator": {
                display: "none",
              },

              /* Footer */
              "& .MuiDataGrid-footerContainer": {
                minHeight: 56,
                borderTop: `1px solid ${BORDER}`,
                background: "#fafafa",

                "& .MuiTablePagination-root": {
                  color: "#475569",
                  fontWeight: 600,
                },
              },

              /* Scrollbar */
              "& .MuiDataGrid-virtualScroller::-webkit-scrollbar": {
                width: 8,
                height: 8,
              },

              "& .MuiDataGrid-virtualScroller::-webkit-scrollbar-thumb": {
                background: alpha(PRIMARY, 0.25),
                borderRadius: 10,
              },

              /* Empty/loading center */
              "& .MuiDataGrid-overlay": {
                background: "rgba(255,255,255,0.85)",
              },
            }}
          />
        </Box>
      )}
    </Card>
  );
};

export default LedgerTransactions;
const ITEMS_PER_PAGE = 5;
const MobileLedgerList = ({ rows, loading, onPageChange }) => {
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [rows]);

  if (loading) return <GridLoader />;

  if (!rows.length) return <EmptyState />;

  const totalPages = Math.ceil(rows.length / ITEMS_PER_PAGE);

  const paginatedRows = rows.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );
  return (
    <Box sx={{ px: 1.5, pb: 2.5 }}>
      <Stack spacing={1.25}>
        {paginatedRows.map((row) => (
          <Box
            key={row.id}
            sx={{
              borderRadius: 3,
              border: `1px solid ${BORDER}`,
              background: "#fff",
              p: 1.75,
              boxShadow: "0 4px 14px rgba(15,23,42,0.04)",
            }}
          >
            <Stack spacing={1}>
              <Stack
                direction="row"
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <Typography fontSize={13} fontWeight={700} color={PRIMARY_DARK}>
                  Source
                </Typography>
                <Typography fontSize={12} color="text.secondary">
                  {/* {row.source || "—"} */}
                  {row.source === "DIRECT" ? "SPOT" : row.source}
                </Typography>
              </Stack>

              <Stack
                direction="row"
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <Typography fontSize={13} fontWeight={700} color={PRIMARY_DARK}>
                  Amount
                </Typography>
                <Typography
                  fontSize={12}
                  sx={{
                    color: row.entryType === "CREDIT" ? "#047857" : "#B45309",
                  }}
                >
                  {row.entryType === "CREDIT" ? "+" : "-"}
                  {row.amount} {row.currency}
                </Typography>
              </Stack>

              <Stack
                direction="row"
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <Typography fontSize={13} fontWeight={700} color={PRIMARY_DARK}>
                  Type
                </Typography>
                <Typography
                  fontSize={12}
                  sx={{
                    color: row.entryType === "CREDIT" ? "#047857" : "#B45309",
                  }}
                >
                  {row.entryType}
                </Typography>
              </Stack>

              <Stack
                direction="row"
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <Typography fontSize={13} fontWeight={700} color={PRIMARY_DARK}>
                  Wallet
                </Typography>
                <Typography fontSize={12}>
                  {row.balanceType === "FUND"
                    ? "SUPER"
                    : row.balanceType === "MAIN"
                      ? "AVAILABLE"
                      : row.balanceType}
                </Typography>
              </Stack>
            </Stack>
            <Divider sx={{ my: 1, borderColor: alpha(BORDER, 0.9) }} />

            <Typography fontSize={11.5} color={TEXT_MUTED}>
              Date:{" "}
              {new Date(row.createdAt).toLocaleString("en-IN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true,
              })}
            </Typography>
          </Box>
        ))}
      </Stack>

      {totalPages > 0 && (
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
            display: "flex",
            justifyContent: "center",
            pt: 1,

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
      )}
    </Box>
  );
};

const EmptyState = () => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      py: 6,
    }}
  >
    <Stack alignItems="center" sx={{ textAlign: "center" }} spacing={1}>
      {/* <CardGiftcardRoundedIcon
                sx={{
                    fontSize: 34,
                    color: alpha(PRIMARY, 0.35),
                }}
            /> */}

      <Typography
        variant="body2"
        sx={{
          color: TEXT_MUTED,
          fontWeight: 600,
        }}
      >
        No transactions yet
      </Typography>

      <Typography
        variant="caption"
        sx={{
          color: TEXT_MUTED,
          mb: 1,
        }}
      >
        {/* Keep growing your network to unlock rewards */}
      </Typography>
    </Stack>
  </Box>
);

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
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
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
