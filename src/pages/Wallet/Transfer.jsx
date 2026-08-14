// Internal Transfer (Extended – Safe Version)
import { useFormik } from 'formik';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import {
    Button,
    CircularProgress,
    MenuItem,
    Stack,
    TextField,
    Typography,
} from '@mui/material';

import { getMethod, postMethod } from '../../api/login';

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

export default function Transfer({ balances = {}, onSuccess }) {
    const [step, setStep] = useState('FORM');

    const [recipient, setRecipient] = useState(null);
    const [checkingUser, setCheckingUser] = useState(false);

    /* ---------------- TRANSFER FORM (FORMIK) ---------------- */

    const transferForm = useFormik({
        initialValues: {
            transferTo: 'SELF',
            mode: 'DEFAULT', // NEW (for OTHERS only)
            transferType: 'MAIN_TO_FUND',
            toUserId: '',
            amount: '',
        },
        validate: (values) => {
            // Yup's synchronous validate() can't easily see `recipient`/`availableUsd`
            // (both live outside formik state), so validation runs through the
            // schema below, and the OTHERS/recipient check is added on top here.
            const errors = {};

            if (values.transferTo === 'OTHERS' && !recipient) {
                errors.toUserId = 'Invalid recipient user';
            }

            return errors;
        },
        validationSchema: Yup.lazy((values) =>
            Yup.object({
                transferTo: Yup.string().oneOf(['SELF', 'OTHERS']).required(),
                transferType: Yup.string()
                    .oneOf(['MAIN_TO_FUND', 'MAIN_TO_MAIN', 'FUND_TO_FUND'])
                    .required(),
                toUserId: Yup.string().notRequired(),
                amount: Yup.number()
                    .transform((val, orig) => (orig === '' ? undefined : val))
                    .typeError('Enter a valid amount')
                    .required('Enter a valid amount')
                    .moreThan(0, 'Enter a valid amount')
                    .max(
                        availableUsdFor(values.transferType, balances),
                        `Insufficient balance. Available: $${availableUsdFor(
                            values.transferType,
                            balances
                        ).toFixed(2)}`
                    ),
            })
        ),
        onSubmit: async (values, { setSubmitting }) => {
            try {
                const payload = {
                    transferTo: values.transferTo,
                    transferType: values.transferType,
                    amount: values.amount,
                    ...(values.transferTo === 'OTHERS' && {
                        toUserId: Number(values.toUserId),
                    }),
                };

                const res = await postMethod('/api/wallet/internal-transfer/validate', payload);

                if (!res?.success) {
                    toast.error(res?.message || 'Validation failed');
                    return;
                }

                toast.success('OTP sent');
                setStep('OTP');
            } catch (err) {
                toast.error(err.message || 'Validation failed');
            } finally {
                setSubmitting(false);
            }
        },
    });

    const { values, setFieldValue, touched, errors } = transferForm;

    /* ---------------- OTP FORM (FORMIK) ---------------- */

    const otpForm = useFormik({
        initialValues: { otp: '' },
        validationSchema: Yup.object({
            otp: Yup.string().matches(/^\d{4,6}$/, 'Invalid OTP').required('Invalid OTP'),
        }),
        onSubmit: async (otpValues, { setSubmitting, resetForm }) => {
            try {
                const res = await postMethod('/api/wallet/internal-transfer/initate', {
                    ...values,
                    otp: otpValues.otp,
                    ...(values.transferTo === 'OTHERS' && {
                        toUserId: Number(values.toUserId),
                    }),
                });

                if (!res?.success) {
                    toast.error(res?.error?.message || 'Transfer failed');
                    return;
                }

                toast.success('Transfer successful');

                transferForm.resetForm({
                    values: {
                        transferTo: 'SELF',
                        mode: 'DEFAULT',
                        transferType: 'MAIN_TO_FUND',
                        toUserId: '',
                        amount: '',
                    },
                });
                resetForm();
                setRecipient(null);
                setStep('FORM');

                onSuccess?.();
            } catch (err) {
                toast.error(err.message || 'Transfer failed');
            } finally {
                setSubmitting(false);
            }
        },
    });

    /* ---------------- DERIVE TRANSFER TYPE ---------------- */

    useEffect(() => {
        if (values.transferTo === 'SELF') {
            setFieldValue('transferType', 'MAIN_TO_FUND');
            return;
        }

        // OTHERS
        setFieldValue('transferType', values.mode === 'MAIN' ? 'MAIN_TO_MAIN' : 'FUND_TO_FUND');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [values.transferTo, values.mode]);

    /* ---------------- AVAILABLE BALANCE ---------------- */

    const availableUsd = useMemo(
        () => availableUsdFor(values.transferType, balances),
        [values.transferType, balances]
    );

    /* ---------------- AUTO FETCH RECIPIENT ---------------- */

    useEffect(() => {
        let timer;

        if (values.transferTo !== 'OTHERS') {
            setRecipient(null);
        } else if (!values.toUserId || values.toUserId.length < 5) {
            setRecipient(null);
        } else {
            timer = setTimeout(async () => {
                try {
                    setCheckingUser(true);
                    const res = await getMethod(`/api/user/lookup-by-superid/${values.toUserId}`);
                    setRecipient(res?.success ? res.data : null);
                } catch {
                    setRecipient(null);
                } finally {
                    setCheckingUser(false);
                }
            }, 400);
        }

        return () => {
            if (timer) clearTimeout(timer);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [values.toUserId, values.transferTo]);

    /* ================= UI ================= */

    return (
        <Stack spacing={3}>
            {step === 'FORM' && (
                <form onSubmit={transferForm.handleSubmit} noValidate>
                    <Stack spacing={3}>
                        <TextField
                            sx={fieldSx}
                            select
                            label="Transfer To"
                            name="transferTo"
                            value={values.transferTo}
                            onChange={(e) => {
                                setFieldValue('transferTo', e.target.value);
                                setFieldValue('mode', 'DEFAULT');
                                setFieldValue('toUserId', '');
                                setRecipient(null);
                            }}
                            fullWidth
                        >
                            <MenuItem value="SELF">Self</MenuItem>
                            <MenuItem value="OTHERS">Other User</MenuItem>
                        </TextField>

                        {values.transferTo === 'OTHERS' && (
                            <TextField
                                sx={fieldSx}
                                select
                                label="Transfer Mode"
                                name="mode"
                                value={values.mode}
                                onChange={(e) => setFieldValue('mode', e.target.value)}
                                fullWidth
                            >
                                <MenuItem value="DEFAULT">Fund → Fund</MenuItem>
                                <MenuItem value="MAIN">Main → Main</MenuItem>
                            </TextField>
                        )}

                        {values.transferTo === 'SELF' && (
                            <TextField sx={fieldSx} label="Transfer Type" value={values.transferType} disabled fullWidth />
                        )}

                        {values.transferTo === 'OTHERS' && (
                            <Stack spacing={0.5}>
                                <TextField
                                    sx={fieldSx}
                                    label="Recipient User ID"
                                    name="toUserId"
                                    value={values.toUserId}
                                    onChange={(e) =>
                                        setFieldValue('toUserId', e.target.value.replace(/\D/g, ''))
                                    }
                                    onBlur={transferForm.handleBlur}
                                    error={touched.toUserId && !!errors.toUserId}
                                    helperText={touched.toUserId && errors.toUserId}
                                    InputProps={{
                                        startAdornment: (
                                            <Typography sx={{ mr: 0.5, color: 'text.secondary' }}>UN</Typography>
                                        ),
                                    }}
                                    fullWidth
                                />

                                {checkingUser && <Typography variant="caption">Checking user…</Typography>}

                                {recipient && (
                                    <Typography variant="caption" color="success.main">
                                        User found: <b>{recipient.username || recipient.phoneNo}</b>
                                    </Typography>
                                )}
                            </Stack>
                        )}

                        <Stack spacing={0.5}>
                            <TextField
                                sx={fieldSx}
                                label="Amount (USD)"
                                type="number"
                                name="amount"
                                value={values.amount}
                                onChange={transferForm.handleChange}
                                onBlur={transferForm.handleBlur}
                                error={touched.amount && !!errors.amount}
                                helperText={touched.amount && errors.amount}
                                fullWidth
                            />

                            <Typography variant="caption">
                                Available balance: ${availableUsd.toFixed(2)}
                            </Typography>
                        </Stack>

                        <Button
                            type="submit"
                            variant="contained"
                            disabled={
                                transferForm.isSubmitting ||
                                availableUsd <= 0 ||
                                (values.transferTo === 'OTHERS' && !recipient)
                            }
                            fullWidth
                        >
                            {transferForm.isSubmitting ? <CircularProgress size={18} /> : 'Continue'}
                        </Button>
                    </Stack>
                </form>
            )}

            {step === 'OTP' && (
                <form onSubmit={otpForm.handleSubmit} noValidate>
                    <Stack spacing={2}>
                        <Typography variant="h6" align="center">
                            Confirm Internal Transfer
                        </Typography>

                        <Typography variant="body2" color="text.secondary" align="center">
                            Enter the OTP sent to your registered email
                        </Typography>

                        <TextField
                            sx={fieldSx}
                            label="One-Time Password"
                            name="otp"
                            value={otpForm.values.otp}
                            onChange={(e) =>
                                otpForm.setFieldValue('otp', e.target.value.replace(/\D/g, '').slice(0, 6))
                            }
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
                            {otpForm.isSubmitting ? <CircularProgress size={20} /> : 'Confirm Transfer'}
                        </Button>

                        <Typography variant="caption" align="center" color="text.secondary">
                            OTP is time-sensitive. Please confirm promptly.
                        </Typography>
                    </Stack>
                </form>
            )}
        </Stack>
    );
}

/* ---------------- SHARED HELPER ---------------- */

function availableUsdFor(transferType, balances) {
    if (transferType === 'MAIN_TO_FUND') return Number(balances?.main?.usd || 0);
    if (transferType === 'MAIN_TO_MAIN') return Number(balances?.main?.usd || 0);
    if (transferType === 'FUND_TO_FUND') return Number(balances?.fund?.usd || 0);
    return 0;
}
