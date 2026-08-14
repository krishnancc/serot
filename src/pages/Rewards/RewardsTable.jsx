import CardGiftcardRoundedIcon from '@mui/icons-material/CardGiftcardRounded';
import {
    Box,
    Card,
    Chip,
    Divider,
    Pagination,
    Stack,
    Typography,
    alpha,
    useMediaQuery,
    useTheme
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';

// Keep these in sync with the Level Info / GenealogyView theme
const PRIMARY = '#6366F1';
const PRIMARY_DARK = '#4F46E5';
const ACCENT = '#8B5CF6';
const BORDER = '#E2E8F0';
const TEXT_MUTED = '#64748B';
const gradient = `linear-gradient(135deg, ${PRIMARY}, ${ACCENT})`;

// Resolve a DataGrid column's display value/renderCell for a given row,
// so the same `columns` prop can drive both the table and the card view.
const resolveColumnContent = (column, row) => {
    const value = column.valueGetter
        ? column.valueGetter({ row, field: column.field })
        : row[column.field];

    if (column.renderCell) {
        return column.renderCell({ row, value, field: column.field, id: row.rewardRuleId });
    }
    return value ?? '—';
};

const RewardsTable = ({ rows, columns, loading }) => {
    console.log('RewardsTable rows:', rows);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // First non-actions column becomes the card "title" row; the rest render as label/value pairs
    const [titleColumn, ...detailColumns] = columns.filter((c) => c.field !== 'actions');
    const actionColumn = columns.find((c) => c.field === 'actions');

    return (
        <Card
            elevation={0}
            sx={{
                position: 'relative',
                overflow: 'hidden',
                borderRadius: 4,
                border: `1px solid ${BORDER}`,
                width: '100%',
                background: `...`,
            }}
        >
            {/* Decorative Glow */}
            <Box
                sx={{
                    position: 'absolute',
                    right: -50,
                    top: -50,
                    width: 160,
                    height: 160,
                    borderRadius: '50%',
                    background: alpha(PRIMARY, 0.08),
                    filter: 'blur(20px)',
                }}
            />

            {/* Header */}
            <Box
                p={{ xs: 2, sm: 3 }}
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: { xs: 'stretch', sm: 'center' },
                    justifyContent: 'space-between',
                    width: '100%',
                    gap: 2,
                    mb: 2.5,
                    ml: { xs: 2, sm: 2.5 },
                    mr: { xs: 2, sm: 2.5 },
                    mt: 2.5,
                }}
            >
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flex: 1 }}>
                    <Box
                        sx={{
                            width: 42,
                            height: 42,
                            borderRadius: 2.5,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: gradient,
                            color: '#fff',
                            boxShadow: `0 8px 20px ${alpha(PRIMARY, 0.25)}`,
                            flexShrink: 0,
                        }}
                    >
                        <CardGiftcardRoundedIcon />
                    </Box>

                    <Box>
                        <Typography fontWeight={900} fontSize={{ xs: 20, sm: 22, md: 24 }} lineHeight={1.15}>
                            Eligible Rewards
                        </Typography>
                        <Typography sx={{ color: TEXT_MUTED, fontSize: { xs: 13, sm: 14 }, mt: 0.3, fontWeight: 500 }}>
                            Rewards you currently qualify for
                        </Typography>
                    </Box>
                </Stack>

                <Chip
                    size="small"
                    label={`${rows?.length ?? 0} ${rows?.length === 1 ? 'Reward' : 'Rewards'}`}
                    sx={{
                        alignSelf: { xs: 'flex-start', sm: 'center' },
                        height: 28,
                        borderRadius: 2,
                        background: alpha(PRIMARY, 0.12),
                        color: PRIMARY_DARK,
                        fontWeight: 700,
                        fontSize: 12.5,
                        px: 0.5,
                        mr: { xs: 0, sm: 4.5 },
                    }}
                />
            </Box>

            <Divider sx={{ borderColor: BORDER, mb: 2.5 }} />

            {isMobile ? (
                <Box
                    sx={{
                        mt: 2,
                        borderRadius: 3,
                        overflow: 'hidden',
                        mx: 1,
                        mb: 1,
                    }}
                >
                    <MobileRewardsList
                        rows={rows}
                        loading={loading}
                        titleColumn={titleColumn}
                        detailColumns={detailColumns}
                        actionColumn={actionColumn}
                    />
                </Box>
            ) : (
                <Box
                    sx={{
                        borderRadius: 3,
                        overflow: 'hidden',
                        border: `1px solid ${BORDER}`,
                        mx: 2.5,
                        mb: 2.5,
                    }}
                >
                    <Box
                        sx={{
                            borderRadius: 3,
                            overflow: 'hidden',
                            border: `1px solid ${BORDER}`,
                            background: '#fff',
                            boxShadow: '0 8px 30px rgba(15,23,42,0.06)',
                        }}
                    >
                        <DataGrid
                            rows={rows}
                            columns={columns}
                            getRowId={(row) => row.rewardRuleId}
                            loading={loading}
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
                                border: 'none',
                                background: '#fff',

                                /* Header */
                                '& .MuiDataGrid-columnHeaders': {
                                    minHeight: 54,
                                    background: `linear-gradient(
                    135deg,
                    ${alpha(PRIMARY, 0.08)},
                    ${alpha(PRIMARY, 0.04)}
                )`,
                                    borderBottom: `1px solid ${BORDER}`,
                                },

                                '& .MuiDataGrid-columnHeader': {
                                    px: 2,
                                },

                                '& .MuiDataGrid-columnHeaderTitle': {
                                    fontSize: 12,
                                    fontWeight: 800,
                                    color: '#475569',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.06em',
                                },


                                /* Rows */
                                '& .MuiDataGrid-row': {
                                    minHeight: 58,
                                    transition: 'all .25s ease',
                                },


                                '& .MuiDataGrid-row:nth-of-type(even)': {
                                    backgroundColor: alpha(PRIMARY, 0.015),
                                },


                                '& .MuiDataGrid-row:hover': {
                                    backgroundColor: alpha(PRIMARY, 0.07),
                                    cursor: 'pointer',
                                    transform: 'scale(1.002)',
                                    boxShadow: `0 4px 12px ${alpha(PRIMARY, 0.12)}`,
                                    zIndex: 1,
                                },


                                /* Cells */
                                '& .MuiDataGrid-cell': {
                                    borderBottom: `1px solid ${alpha(BORDER, 0.65)}`,
                                    fontSize: 14,
                                    color: '#334155',
                                    px: 2,
                                },


                                '& .MuiDataGrid-cell:first-of-type': {
                                    fontWeight: 700,
                                    color: '#0f172a',
                                },


                                /* Remove focus outline */
                                '& .MuiDataGrid-cell:focus-within, \
            & .MuiDataGrid-columnHeader:focus-within': {
                                    outline: 'none',
                                },


                                /* Remove separator */
                                '& .MuiDataGrid-columnSeparator': {
                                    display: 'none',
                                },


                                /* Footer */
                                '& .MuiDataGrid-footerContainer': {
                                    minHeight: 56,
                                    borderTop: `1px solid ${BORDER}`,
                                    background: '#fafafa',

                                    '& .MuiTablePagination-root': {
                                        color: '#475569',
                                        fontWeight: 600,
                                    },
                                },


                                /* Scrollbar */
                                '& .MuiDataGrid-virtualScroller::-webkit-scrollbar': {
                                    width: 8,
                                    height: 8,
                                },

                                '& .MuiDataGrid-virtualScroller::-webkit-scrollbar-thumb': {
                                    background: alpha(PRIMARY, 0.25),
                                    borderRadius: 10,
                                },


                                /* Empty/loading center */
                                '& .MuiDataGrid-overlay': {
                                    background: 'rgba(255,255,255,0.85)',
                                },
                            }}
                        />
                    </Box>
                </Box>
            )}
        </Card>
    );
};

export default RewardsTable;

// Mobile-only card list, replacing the DataGrid table below the `sm` breakpoint
const ITEMS_PER_PAGE = 5;

const MobileRewardsList = ({
    rows = [],
    loading,
    titleColumn,
    detailColumns = [],
    actionColumn,
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
        page * ITEMS_PER_PAGE
    );

    return (
        <Stack spacing={2} px={2} pb={3}>

            {paginatedRows.map((row) => (
                <Card
                    key={row.rewardRuleId}
                    elevation={0}
                    sx={{
                        borderRadius: 4,
                        border: `1px solid ${alpha(BORDER, 0.8)}`,
                        background: `
                            linear-gradient(
                                145deg,
                                ${alpha(PRIMARY, 0.04)},
                                #ffffff 45%
                            )
                        `,
                        p: 2.2,
                        transition: "all .25s ease",

                        "&:active": {
                            transform: "scale(.99)",
                        },
                    }}
                >

                    {/* Header */}
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="flex-start"
                        spacing={2}
                    >

                        <Box sx={{ minWidth: 0 }}>
                            <Typography
                                sx={{
                                    fontSize: 11,
                                    fontWeight: 700,
                                    color: TEXT_MUTED,
                                    textTransform: "uppercase",
                                    letterSpacing: "0.08em",
                                    mb: 0.8,
                                }}
                            >
                                {titleColumn?.headerName || "Reward"}
                            </Typography>


                            <Typography
                                sx={{
                                    fontSize: 17,
                                    lineHeight: 1.3,
                                    fontWeight: 800,
                                    color: "#0F172A",
                                    wordBreak: "break-word",
                                }}
                            >
                                {titleColumn
                                    ? resolveColumnContent(titleColumn, row)
                                    : row.rewardRuleId}
                            </Typography>

                        </Box>


                        {actionColumn && (
                            <Box
                                sx={{
                                    width: 38,
                                    height: 38,
                                    borderRadius: "50%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    background: alpha(PRIMARY, 0.1),
                                    color: PRIMARY,
                                    flexShrink: 0,
                                }}
                            >
                                {resolveColumnContent(actionColumn, row)}
                            </Box>
                        )}

                    </Stack>


                    {detailColumns.length > 0 && (
                        <>
                            <Divider
                                sx={{
                                    my: 2,
                                    borderColor: alpha(BORDER, 0.7),
                                }}
                            />


                            <Stack spacing={1.2}>

                                {detailColumns.map((col) => (
                                    <Box
                                        key={col.field}
                                        sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            gap: 2,
                                            px: 1.2,
                                            py: 1,
                                            borderRadius: 2,
                                            background: alpha("#64748B", 0.035),
                                        }}
                                    >

                                        <Typography
                                            sx={{
                                                fontSize: 12.5,
                                                color: TEXT_MUTED,
                                                fontWeight: 600,
                                            }}
                                        >
                                            {col.headerName}
                                        </Typography>


                                        <Box
                                            sx={{
                                                fontSize: 13.5,
                                                color: "#1E293B",
                                                fontWeight: 700,
                                                textAlign: "right",
                                            }}
                                        >
                                            {resolveColumnContent(col, row)}
                                        </Box>

                                    </Box>
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
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            py: 6,
        }}
    >
        <Stack alignItems="center" sx={{ textAlign: 'center' }} spacing={1}>
            <CardGiftcardRoundedIcon
                sx={{
                    pl: 14,
                    fontSize: 34,
                    color: alpha(PRIMARY, 0.35),
                }}
            />

            <Typography
                variant="body2"
                sx={{
                    color: TEXT_MUTED,
                    fontWeight: 600,
                }}
            >
                No eligible rewards yet
            </Typography>

            <Typography
                variant="caption"
                sx={{
                    color: TEXT_MUTED,
                    mb: 1,
                }}
            >
                Keep growing your network to unlock rewards
            </Typography>
        </Stack>
    </Box>
);
