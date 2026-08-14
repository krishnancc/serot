import { useEffect, useState } from "react";

import {
    Box,
    Button,
    CircularProgress,
    IconButton,
    InputAdornment,
    TextField,
    Typography
} from "@mui/material";

import {
    ArrowForward,
    Email,
    Lock,
    PeopleAlt,
    Person,
    Phone,
    Visibility,
    VisibilityOff
} from "@mui/icons-material";

import { useNavigate } from 'react-router-dom';

import { useFormik } from "formik";
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as Yup from "yup";
import { authSignIn, getGeneric } from "../api/login"; // adjust path
import AuthLeft from "./AuthLeft";
const SignupPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    // Referral lookup
    const [referralUser, setReferralUser] = useState(null);
    const [checkingReferral, setCheckingReferral] = useState(false);

    const [searchParams] = useSearchParams();
    const refFromUrl = searchParams.get("ref");
    const formik = useFormik({
        initialValues: {
            username: "",
            phoneNo: "",
            email: "",
            password: "",
            referralId: "",
        },

        validationSchema: Yup.object({
            username: Yup.string().min(3, 'Username must be at least 3 characters')
                .max(20, 'Username must be at most 20 characters')
                .required("User name is required"),

            phoneNo: Yup.string()
                .matches(/^[0-9]{10}$/, "Enter a valid 10-digit phone number")
                .required("Phone number is required"),

            email: Yup.string()
                .email("Enter valid email")
                .required("Email is required"),

            password: Yup.string()
                .min(8, 'Password must be at least 8 characters')
                .required("Password is required"),

            referralId: Yup.string().optional(),
        }),

        onSubmit: async (values) => {
            try {
                setLoading(true);

                const payload = {
                    email: values.email,
                    username: values.username.trim(),
                    phoneNo: values.phoneNo,
                    password: values.password,

                    ...(values.referralId && {
                        referralId: values.referralId,
                    }),
                };


                const result = await authSignIn(
                    "/api/auth/signup",
                    payload
                );


                if (result?.error) {
                    toast.error(
                        result.error.message || "Signup failed"
                    );
                    return;
                }


                sessionStorage.setItem(
                    "signup_email",
                    values.email
                );


                toast.success(
                    "Signup successful! Verify your email."
                );

                navigate("/verify-signup");
            } catch (err) {

                toast.error(
                    err?.message || "Signup failed"
                );

            } finally {
                setLoading(false);
            }
        },
    });

    useEffect(() => {

        if (refFromUrl) {

            const digitsOnly = refFromUrl
                .replace(/\D/g, "")
                .slice(0, 6);


            if (digitsOnly.length === 6) {

                formik.setFieldValue(
                    "referralId",
                    digitsOnly
                );

            }
        }

    }, [refFromUrl]);

    useEffect(() => {

        let timer;


        const referralId = formik.values.referralId;


        if (!referralId || referralId.length < 4) {

            setReferralUser(null);

        } else {


            timer = setTimeout(async () => {

                try {

                    setCheckingReferral(true);


                    const res = await getGeneric(
                        `/api/user/lookup-by-superid/${referralId}`
                    );


                    if (res?.success) {

                        setReferralUser(res.data);

                    } else {

                        setReferralUser(null);

                    }


                } catch (error) {

                    setReferralUser(null);

                } finally {

                    setCheckingReferral(false);

                }


            }, 400);

        }


        return () => {
            if (timer) clearTimeout(timer);
        };


    }, [formik.values.referralId]);
    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: {
                    xs: "flex-start",
                    md: "center",
                },
                justifyContent: "center",
                p: {
                    xs: 0,
                    sm: 2,
                    md: 4,
                },
                background: {
                    xs:
                        "linear-gradient(180deg,#eef4ff 0%,#ffffff 50%,#f8fafc 100%)",
                    md: `
          radial-gradient(circle at 10% 20%,#dbeafe 0%,transparent 35%),
          radial-gradient(circle at 90% 80%,#ede9fe 0%,transparent 35%),
          #f8fafc
          `,
                },
            }}
        >
            <Box
                sx={{
                    width: "100%",
                    maxWidth: 1280,
                    minHeight: {
                        xs: "100vh",
                        sm: "auto",
                        md: 720,
                    },
                    display: "flex",
                    flexDirection: {
                        xs: "column",
                        md: "row",
                    },
                    overflow: "hidden",
                    borderRadius: {
                        xs: 0,
                        md: 6,
                    },
                    background: {
                        xs: "transparent",
                        md: "rgba(255,255,255,.75)",
                    },
                    backdropFilter: {
                        md: "blur(30px)",
                    },
                    border: {
                        xs: "none",
                        md: "1px solid rgba(255,255,255,.6)",
                    },
                    boxShadow: {
                        xs: "none",
                        md: "0 40px 100px rgba(15,23,42,.15)",
                    },
                }}
            >
                {/* LEFT SECTION */}
                <AuthLeft />

                {/* RIGHT LOGIN SECTION */}
                <Box
                    sx={{
                        flex: 1,

                        display: "flex",

                        alignItems: {
                            xs: "flex-start",
                            md: "center",
                        },

                        justifyContent: "center",

                        px: {
                            xs: 2,
                            sm: 3,
                            md: 8,
                        },

                        pt: {
                            xs: 4,
                            sm: 2,
                            md: 0,
                        },

                        pb: {
                            xs: 4,
                            md: 0,
                        },
                    }}
                >

                    <Box
                        sx={{
                            width: "100%",
                            maxWidth: 430,
                        }}
                    >

                        {/* MOBILE LOGO */}

                        <Box
                            sx={{
                                display: {
                                    xs: "flex",
                                    md: "none",
                                },

                                flexDirection: "column",

                                alignItems: "center",

                                mb: 4,
                            }}
                        >

                            <Box
                                sx={{
                                    width: { xs: 56, sm: 70 },

                                    height: { xs: 56, sm: 70 },

                                    borderRadius: 4,

                                    display: "flex",

                                    alignItems: "center",

                                    justifyContent: "center",

                                    fontSize: { xs: 26, sm: 32 },

                                    fontWeight: 900,

                                    color: "#fff",

                                    background:
                                        "linear-gradient(135deg,#2563eb,#7c3aed)",

                                    boxShadow:
                                        "0 15px 35px rgba(37,99,235,.35)",
                                }}
                            >
                                S
                            </Box>


                            <Typography
                                mt={2}
                                fontSize={{ xs: 19, sm: 22 }}
                                fontWeight={800}
                            >
                                Serot
                            </Typography>


                        </Box>

                        <Typography
                            sx={{
                                fontSize: {
                                    xs: 24,
                                    sm: 28,
                                    md: 42,
                                },
                                fontWeight: 700,
                                textAlign: {
                                    xs: "center",
                                    md: "left",
                                },
                            }}
                        >
                            Create Account 🚀
                        </Typography>

                        <Typography
                            color="text.secondary"
                            sx={{
                                mt: 1,
                                mb: 4,
                                fontSize: { xs: 14, sm: 15 },
                                textAlign: {
                                    xs: "center",
                                    md: "left",
                                },
                            }}
                        >
                            Create your account to get started.
                        </Typography>
                        <Box
                            component="form"
                            onSubmit={formik.handleSubmit}
                            sx={{ width: "100%", maxWidth: 430 }}
                        >

                            {/* User Name */}

                            <TextField
                                fullWidth
                                name="username"
                                placeholder="Enter user name"
                                value={formik.values.username}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.username && Boolean(formik.errors.username)}
                                helperText={formik.touched.username && formik.errors.username}
                                sx={{
                                    mb: 2,
                                    "& .MuiOutlinedInput-root": {
                                        height: { xs: 50, sm: 54, md: 58 },
                                        borderRadius: 3,
                                        fontSize: { xs: 14, sm: 16 },
                                    },
                                }}
                                slotProps={{
                                    input: {
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Person sx={{ fontSize: 20 }} />
                                            </InputAdornment>
                                        ),
                                    },
                                }}
                            />

                            {/* Phone */}

                            <TextField
                                fullWidth
                                name="phoneNo"
                                placeholder="Enter phone number"
                                value={formik.values.phoneNo}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.phoneNo && Boolean(formik.errors.phoneNo)}
                                helperText={formik.touched.phoneNo && formik.errors.phoneNo}
                                sx={{
                                    mb: 2,
                                    "& .MuiOutlinedInput-root": {
                                        height: { xs: 50, sm: 54, md: 58 },
                                        borderRadius: 3,
                                        fontSize: { xs: 14, sm: 16 },
                                    },
                                }}
                                slotProps={{
                                    input: {
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Phone sx={{ fontSize: 20 }} />
                                            </InputAdornment>
                                        ),
                                    },
                                }}
                            />

                            {/* Email */}

                            <TextField
                                fullWidth
                                name="email"
                                placeholder="Enter email address"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.email && Boolean(formik.errors.email)}
                                helperText={formik.touched.email && formik.errors.email}
                                sx={{
                                    mb: 2,
                                    "& .MuiOutlinedInput-root": {
                                        height: { xs: 50, sm: 54, md: 58 },
                                        borderRadius: 3,
                                        fontSize: { xs: 14, sm: 16 },
                                    },
                                }}
                                slotProps={{
                                    input: {
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Email sx={{ fontSize: 20 }} />
                                            </InputAdornment>
                                        ),
                                    },
                                }}
                            />

                            {/* Password */}

                            <TextField
                                fullWidth
                                name="password"
                                placeholder="Enter password"
                                type={showPassword ? "text" : "password"}
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.password && Boolean(formik.errors.password)}
                                helperText={formik.touched.password && formik.errors.password}
                                sx={{
                                    mb: 2,
                                    "& .MuiOutlinedInput-root": {
                                        height: { xs: 50, sm: 54, md: 58 },
                                        borderRadius: 3,
                                        fontSize: { xs: 14, sm: 16 },
                                    },
                                }}
                                slotProps={{
                                    input: {
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Lock sx={{ fontSize: 20 }} />
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                >
                                                    {showPassword ? (
                                                        <VisibilityOff sx={{ fontSize: 20 }} />
                                                    ) : (
                                                        <Visibility sx={{ fontSize: 20 }} />
                                                    )}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    },
                                }}
                            />

                            {/* Referral */}

                            <TextField
                                fullWidth
                                name="referralId"
                                placeholder="Referral ID (Optional)"
                                value={formik.values.referralId}
                                onChange={formik.handleChange}
                                sx={{
                                    mb: 2,
                                    "& .MuiOutlinedInput-root": {
                                        height: { xs: 50, sm: 54, md: 58 },
                                        borderRadius: 3,
                                        fontSize: { xs: 14, sm: 16 },
                                    },
                                }}
                                slotProps={{
                                    input: {
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <PeopleAlt sx={{ fontSize: 20 }} />
                                            </InputAdornment>
                                        ),
                                    },
                                }}
                            />

                            {checkingReferral && (
                                <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: "block" }}>
                                    Checking referral…
                                </Typography>
                            )}

                            {referralUser && (
                                <Typography variant="caption" color="success.main" sx={{ mb: 1, display: "block" }} >
                                    Referred by:{' '}
                                    <b>{referralUser.username || referralUser.phoneNo}</b>
                                </Typography>
                            )}

                            {!checkingReferral && formik.values.referralId && !referralUser && (
                                <Typography variant="caption" color="error" sx={{ mb: 1, display: "block" }} >
                                    Invalid referral ID
                                </Typography>
                            )}

                            <Button
                                type="submit"
                                disabled={loading}
                                fullWidth
                                variant="contained"
                                endIcon={!loading && <ArrowForward />}
                                sx={{
                                    mt: 1,
                                    height: { xs: 52, sm: 60 },
                                    borderRadius: 3,
                                    textTransform: "none",
                                    fontWeight: 700,
                                    fontSize: { xs: 15, sm: 17 },
                                    background: "linear-gradient(90deg,#2563eb,#7c3aed)",
                                }}
                            >
                                {loading ? (
                                    <CircularProgress size={24} color="#fff" />
                                ) : (
                                    "Create Account"
                                )}
                            </Button>

                        </Box>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                mt: 4,
                                gap: 1,
                                flexWrap: "wrap",
                            }}
                        >
                            <Typography color="text.secondary" fontSize={{ xs: 14, sm: 16 }}>
                                Already have an account?
                            </Typography>

                            <Typography
                                color="primary"
                                fontWeight={700}
                                fontSize={{ xs: 14, sm: 16 }}
                                sx={{ cursor: "pointer" }}
                                onClick={() => navigate("/signin")}
                            >
                                Login
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};


export default SignupPage;
