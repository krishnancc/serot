import {
  alpha,
  Box,
  Card,
  Divider,
  Pagination,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
// Keep these in sync with the Level Info / GenealogyView theme
const PRIMARY = "#6366F1";
const PRIMARY_DARK = "#4F46E5";
const ACCENT = "#8B5CF6";
const BORDER = "#E2E8F0";
const TEXT_MUTED = "#64748B";
const gradient = `linear-gradient(135deg, ${PRIMARY}, ${ACCENT})`;

// Resolve a DataGrid column's renderCell/value for a given row, so the
// same `purchaseColumns` definitions drive both the table and the cards.
const resolveColumnContent = (column, row) => {
  const value = column.valueGetter
    ? column.valueGetter({ row, field: column.field })
    : row[column.field];

  if (column.renderCell) {
    return column.renderCell({
      row,
      value,
      field: column.field,
      id: row.purchaseId,
    });
  }
  return value ?? "—";
};

const PurchaseHistroyTable = ({
  purchaseRows,
  purchaseLoading,
  purchasePage,
  purchasePageSize,
  purchaseRowCount,
  setPurchasePageSize,
  setPurchasePage,
  setPurchaseSortField,
  setPurchaseSortOrder,
}) => {
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const purchaseColumns = [
    {
      field: "purchaseId",
      headerName: "Purchase ID",
      flex: 0.2,
      renderCell: ({ value }) => (
        <Box
          sx={{
            px: 1.2,
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
      field: "packageName",
      headerName: "Package",
      flex: 0.3,
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
          }}
        >
          {value}
        </Box>
      ),
    },
    {
      field: "priceUsd",
      headerName: "Amount",
      flex: 0.2,
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
          }}
        >
          $ {value}
        </Box>
      ),
    },
    {
      field: "purchasedAt",
      headerName: "Purchased On",
      flex: 0.2,
      align: "right",
      headerAlign: "right",
      renderCell: ({ value }) => (
        <Box
          sx={{
            px: 1.2,
            py: 0.4,
            borderRadius: 2,
            fontWeight: 700,
            fontSize: 14,
          }}
        >
          {new Date(value).toLocaleDateString()}
        </Box>
      ),
    },
  ];

  // First column becomes the card title; the rest render as label/value rows
  const [titleColumn, ...detailColumns] = purchaseColumns;

  const pageCount = Math.max(
    Math.ceil((purchaseRowCount || 0) / (purchasePageSize || 10)),
    1,
  );

  return (
    <div>
      <Card
        elevation={0}
        sx={{
          position: "relative",
          overflow: "hidden",
          borderRadius: 4,
          border: `1px solid ${BORDER}`,
          width: "100%",
          background: `...`,
        }}
      >
        {/* Header */}
        <Box
          p={{ xs: 2, sm: 3 }}
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "stretch", sm: "center" },
            justifyContent: "space-between",
            width: "100%",
            gap: 2,
            px: { xs: 1.75, sm: 2, md: 2.5 },
            py: { xs: 1.5, sm: 1.75, md: 2 },
          }}
        >
          <Typography
            fontWeight={900}
            fontSize={{ xs: 20, sm: 22, md: 24 }}
            lineHeight={1.15}
          >
            Purchase History
          </Typography>
        </Box>

        <Divider sx={{ borderColor: BORDER, mb: 2.5 }} />

        {isMobile ? (
          <MobilePurchaseList
            rows={purchaseRows}
            loading={purchaseLoading}
            titleColumn={titleColumn}
            detailColumns={detailColumns}
            page={purchasePage}
            pageCount={pageCount}
            onPageChange={setPurchasePage}
          />
        ) : (
          <Box
            sx={{
              borderRadius: 3,
              overflow: "hidden",
              border: `1px solid ${BORDER}`,
              mx: 2.5,
              mb: 2.5,
            }}
          >
            <Box
              sx={{
                borderRadius: 3,
                overflow: "hidden",
                border: `1px solid ${BORDER}`,
                background: "#fff",
                boxShadow: "0 8px 30px rgba(15,23,42,0.06)",
              }}
            >
              <DataGrid
                rows={purchaseRows}
                columns={purchaseColumns}
                getRowId={(row) => row.purchaseId}
                rowCount={purchaseRowCount}
                loading={purchaseLoading}
                paginationMode="server"
                sortingMode="server"
                page={purchasePage}
                pageSize={purchasePageSize}
                onPageChange={(newPage) => setPurchasePage(newPage)}
                onPageSizeChange={(newSize) => {
                  setPurchasePageSize(newSize);
                  setPurchasePage(0);
                }}
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
                disableRowSelectionOnClick
                disableColumnMenu
                slots={{
                  loadingOverlay: GridLoader,
                  noRowsOverlay: EmptyState,
                }}
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
                        & .MuiDataGrid-columnHeader:focus-within": {
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
          </Box>
        )}
      </Card>
    </div>
  );
};

export default PurchaseHistroyTable;

// Mobile-only card list, replacing the DataGrid table below the `sm` breakpoint
const ITEMS_PER_PAGE = 5;
const MobilePurchaseList = ({
  rows,
  loading,
  titleColumn,
  detailColumns,
  pageCount,
  onPageChange,
}) => {
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
    <Stack
      spacing={1}
      sx={{
        paddingLeft: "8px",
        paddingRight: "8px",
        paddingBottom: "8px",
      }}
    >
      {paginatedRows.map((row) => (
        <Card
          key={row.purchaseId}
          elevation={0}
          sx={{
            border: `1px solid ${BORDER}`,
            borderRadius: 3,
            p: 2,
            background: alpha(PRIMARY, 0.015),
          }}
        >
          <Box sx={{ justifyContent: "space-between" }}>
            <Typography
              sx={{
                fontSize: 11,
                fontWeight: 800,
                color: TEXT_MUTED,
                textTransform: "uppercase",
                letterSpacing: ".05em",
                mb: 0.3,
              }}
            >
              {titleColumn?.headerName} :{" "}
              <Box
                component="span"
                sx={{
                  fontSize: 14,
                  fontWeight: 800,
                  letterSpacing: 0,
                  color: "#334155",
                }}
              >
                {row.purchaseId}
              </Box>
            </Typography>
          </Box>

          {detailColumns.length > 0 && (
            <>
              <Divider sx={{ borderColor: alpha(BORDER, 0.7), my: 1.5 }} />
              <Stack spacing={1}>
                {detailColumns.map((col) => (
                  <Stack
                    key={col.field}
                    direction="row"
                    alignItems="center"
                    sx={{
                      justifyContent: "space-between",
                      textAlign: "center",
                      alignItems: "center",
                    }}
                    spacing={2}
                  >
                    <Typography
                      sx={{
                        fontSize: 12.5,
                        color: TEXT_MUTED,
                        fontWeight: 500,
                      }}
                    >
                      {col.headerName}
                    </Typography>
                    <Box
                      sx={{
                        fontSize: 13.5,
                        color: "#334155",
                        fontWeight: 600,
                        textAlign: "right",
                      }}
                    >
                      {resolveColumnContent(col, row)}
                    </Box>
                  </Stack>
                ))}
              </Stack>
            </>
          )}
        </Card>
      ))}

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
    </Stack>
  );
};

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
      Loading Rewards...
    </Typography>
  </Box>
);

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
        No Purchase History
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
