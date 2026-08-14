import { useFormik } from 'formik';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import {
    Box,
    Button,
    CircularProgress,
    FormControl,
    FormHelperText,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography,
} from '@mui/material';


import { postMethod } from '../../api/login';

const fieldSx = {
    "& .MuiOutlinedInput-root": {
        borderRadius: 2.5,
        backgroundColor: "#F8FAFC",
        transition: "background-color 120ms ease, box-shadow 120ms ease",

        "& fieldset": {
            borderColor: "#E2E8F0",
        },

        "&:hover fieldset": {
            borderColor: "#CBD5E1",
        },

        "&.Mui-focused": {
            backgroundColor: "#fff",
        },

        "&.Mui-focused fieldset": {
            borderColor: "#6366F1",
            borderWidth: 2,
        },
    },

    "& .MuiInputBase-input.Mui-disabled": {
        WebkitTextFillColor: "#94A3B8",
    },

    "& .MuiOutlinedInput-root.Mui-disabled": {
        backgroundColor: "#F1F5F9",
    },

    "& .MuiInputLabel-root": {
        fontWeight: 300,
    },
};

export default function Withdraw({
    cryptos = [],
    balances = {},
    user = {},
    onSuccess,
}) {
    /* ===============================
       STEP STATE
       =============================== */

    const [step, setStep] = useState('FORM'); // FORM | OTP

    const feePercent = 10;

    /* ===============================
       AVAILABLE BALANCE (MAIN USD ONLY)
       =============================== */

    const availableUsd = useMemo(
        () => Number(balances?.main?.usd || 0),
        [balances]
    );

    /* ===============================
       WITHDRAW FORM (FORMIK + YUP)
       =============================== */

    const withdrawSchema = Yup.object({
        assetId: Yup.string().required('Crypto asset is required'),
        amount: Yup.number()
            .transform((val, orig) => (orig === '' ? undefined : val))
            .typeError('Enter a valid USD amount')
            .required('Enter a valid USD amount')
            .moreThan(0, 'Enter a valid USD amount')
            .max(availableUsd, `Insufficient balance. Available: $${availableUsd.toFixed(2)}`),
        address: Yup.string().min(20, 'Wallet address looks invalid').required('Wallet address is required'),
    });

    const withdrawForm = useFormik({
        initialValues: {
            assetId: '',
            amount: '',
            address: user?.withdrawAddress || '',
        },
        validationSchema: withdrawSchema,
        enableReinitialize: true,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                const payload = {
                    assetId: Number(values.assetId),
                    amountUSD: String(values.amount),
                    address: values.address,
                };

                const res = await postMethod('/api/crypto/withdraw/validate', payload);

                if (!res?.success) {
                    toast.error(res?.error?.message || 'Validation failed');
                    return;
                }

                toast.success('OTP sent to your email');
                setStep('OTP');
            } catch (err) {
                toast.error(err.message || 'Validation failed');
            } finally {
                setSubmitting(false);
            }
        },
    });

    /* ===============================
       OTP FORM (FORMIK + YUP)
       =============================== */

    const otpSchema = Yup.object({
        otp: Yup.string().matches(/^\d{4,6}$/, 'Invalid OTP').required('Invalid OTP'),
    });

    const otpForm = useFormik({
        initialValues: { otp: '' },
        validationSchema: otpSchema,
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            try {
                const payload = {
                    assetId: Number(withdrawForm.values.assetId),
                    amountUSD: String(withdrawForm.values.amount),
                    address: withdrawForm.values.address,
                    otp: values.otp.trim(),
                };

                const res = await postMethod('/api/crypto/withdraw/initiate', payload);

                if (!res?.success) {
                    toast.error(res?.error?.message || 'Withdrawal failed');
                    return;
                }

                toast.success('Withdrawal processed successfully');

                withdrawForm.resetForm({
                    values: { assetId: '', amount: '', address: '' },
                });
                resetForm();
                setStep('FORM');
                onSuccess?.();
            } catch (err) {
                toast.error(err.message || 'Withdrawal failed');
            } finally {
                setSubmitting(false);
            }
        },
    });

    /* ===============================
       SELECTED ASSET / ESTIMATE
       =============================== */

    const selectedAsset = useMemo(
        () => cryptos.find((a) => String(a.assetId) === withdrawForm.values.assetId),
        [cryptos, withdrawForm.values.assetId]
    );

    const estimatedCrypto =
        selectedAsset && withdrawForm.values.amount
            ? (Number(withdrawForm.values.amount) / Number(selectedAsset.priceUSD)).toFixed(6)
            : null;

    const estimatedNetCrypto = estimatedCrypto
        ? (Number(estimatedCrypto) * (1 - feePercent / 100)).toFixed(6)
        : null;

    /* ===============================
       KEEP ADDRESS IN SYNC WITH PROFILE
       =============================== */

    useEffect(() => {
        if (user?.withdrawAddress) {
            withdrawForm.setFieldValue('address', user.withdrawAddress);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.withdrawAddress]);

    const withdrawLocked = !user?.withdrawEnabled || !user?.canWithdrawNow;

    /* ===============================
       UI
       =============================== */

    return (
        <Stack spacing={3}>
            {step === 'FORM' && (
                <form onSubmit={withdrawForm.handleSubmit} noValidate>
                    <Stack spacing={3}>
                        {/* ===== ASSET SELECT ===== */}
                        <FormControl
                            fullWidth
                            sx={fieldSx}
                            error={withdrawForm.touched.assetId && !!withdrawForm.errors.assetId}
                        >
                            <InputLabel id="asset-label">Crypto Asset</InputLabel>

                            <Select
                                labelId="asset-label"
                                label="Crypto Asset"
                                name="assetId"
                                value={withdrawForm.values.assetId}
                                onBlur={withdrawForm.handleBlur}
                                onChange={(e) => {
                                    withdrawForm.setFieldValue('assetId', e.target.value);
                                    withdrawForm.setFieldValue('amount', '');
                                }}
                            >
                                {cryptos
                                    .filter((a) => a.canWithdraw)
                                    .map((a) => (
                                        <MenuItem key={a.assetId} value={String(a.assetId)}>
                                            {a.symbol}
                                        </MenuItem>
                                    ))}

                                {cryptos.filter((a) => a.canWithdraw).length === 0 && (
                                    <MenuItem disabled>No withdrawable assets</MenuItem>
                                )}
                            </Select>

                            {withdrawForm.touched.assetId && withdrawForm.errors.assetId && (
                                <FormHelperText>{withdrawForm.errors.assetId}</FormHelperText>
                            )}
                        </FormControl>

                        {/* ===== AMOUNT ===== */}
                        <Stack spacing={0.5}>
                            <Typography
                                variant="caption"
                                sx={{ textAlign: 'right', color: 'text.secondary' }}
                            >
                                Available balance: ${availableUsd.toFixed(2)}
                            </Typography>

                            <TextField
                                label="Amount (USD)"
                                type="number"
                                name="amount"
                                value={withdrawForm.values.amount}
                                onChange={withdrawForm.handleChange}
                                onBlur={withdrawForm.handleBlur}
                                error={withdrawForm.touched.amount && !!withdrawForm.errors.amount}
                                helperText={withdrawForm.touched.amount && withdrawForm.errors.amount}
                                fullWidth
                                disabled={!withdrawForm.values.assetId}
                                sx={fieldSx}
                                slotProps={{
                                    input: {
                                        endAdornment: (
                                            <Button
                                                size="small"
                                                onClick={() =>
                                                    withdrawForm.setFieldValue('amount', availableUsd.toFixed(2))
                                                }
                                                disabled={!withdrawForm.values.assetId || availableUsd <= 0}
                                                sx={{ minWidth: 'auto', px: 1, fontWeight: 700, fontSize: 12 }}
                                            >
                                                MAX
                                            </Button>
                                        ),
                                    },
                                }}
                            />

                            {estimatedNetCrypto && selectedAsset && (
                                <Typography variant="caption" color="warning.main">
                                    ≈ {estimatedNetCrypto} {selectedAsset.symbol} after 10% fee
                                </Typography>
                            )}
                        </Stack>

                        {/* ===== ADDRESS ===== */}
                        <TextField
                            label="Destination Wallet Address"
                            name="address"
                            value={withdrawForm.values.address}
                            onChange={withdrawForm.handleChange}
                            onBlur={withdrawForm.handleBlur}
                            disabled={!!user?.withdrawAddress}
                            error={withdrawForm.touched.address && !!withdrawForm.errors.address}
                            sx={fieldSx}
                            helperText={
                                user?.withdrawAddress
                                    ? 'Withdrawal address locked. Update it from Profile settings.'
                                    : withdrawForm.touched.address && withdrawForm.errors.address
                            }
                            fullWidth
                        //   slotProps={{ ...commonTextFieldSlots }}
                        />

                        {withdrawLocked && (
                            <Box mt={-1}>
                                <Typography variant="caption" color='#ff0000' align="center">
                                    {!user?.withdrawAddress
                                        ? 'Withdrawals are disabled. Please set a withdrawal address in your profile.'
                                        : !user?.withdrawEnabled
                                            ? 'Withdrawals are currently disabled.'
                                            : `Withdrawals locked until ${new Date(
                                                user.withdrawCooldown
                                            ).toLocaleTimeString()}`}
                                </Typography>
                            </Box>
                        )}

                        <Button
                            type="submit"
                            variant="contained"
                            disabled={
                                withdrawForm.isSubmitting ||
                                availableUsd <= 0 ||
                                !withdrawForm.values.assetId ||
                                withdrawLocked
                            }
                            fullWidth
                        >
                            {withdrawForm.isSubmitting ? <CircularProgress size={18} /> : 'Continue'}
                        </Button>

                        <Typography
                            variant="caption"
                            align="center"
                            sx={{ color: 'rgba(0, 0, 0, 0.55)' }}
                        >
                            ⚠️ 10% withdrawal fee will be deducted from the entered amount.
                        </Typography>
                    </Stack>
                </form>
            )}

            {step === 'OTP' && (
                <form onSubmit={otpForm.handleSubmit} noValidate>
                    <Stack spacing={2}>
                        <Typography variant="h6" align="center">
                            Confirm Withdrawal
                        </Typography>

                        <Typography variant="body2" color="text.secondary" align="center">
                            Enter the OTP sent to your registered email
                        </Typography>

                        <TextField
                            label="One-Time Password"
                            name="otp"
                            value={otpForm.values.otp}
                            onChange={(e) =>
                                otpForm.setFieldValue('otp', e.target.value.replace(/\D/g, '').slice(0, 6))
                            }
                            sx={fieldSx}
                            onBlur={otpForm.handleBlur}
                            error={otpForm.touched.otp && !!otpForm.errors.otp}
                            helperText={otpForm.touched.otp && otpForm.errors.otp}
                            fullWidth
                            inputProps={{
                                inputMode: 'numeric',
                                pattern: '[0-9]*',
                                maxLength: 6,
                                style: {
                                    textAlign: 'center',
                                    fontSize: '1.25rem',
                                    letterSpacing: '0.3em',
                                },
                            }}
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            disabled={otpForm.isSubmitting || otpForm.values.otp.length < 4}
                            fullWidth
                            size="large"
                        >
                            {otpForm.isSubmitting ? <CircularProgress size={20} /> : 'Confirm Withdrawal'}
                        </Button>

                        <Typography variant="caption" align="center" color="text.secondary">
                            Didn’t receive the code? Check spam or try again.
                        </Typography>
                    </Stack>
                </form>
            )}
        </Stack>
    );
}
