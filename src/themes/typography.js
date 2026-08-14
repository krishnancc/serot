// ==============================|| DEFAULT THEME - TYPOGRAPHY  ||============================== //
const Typography = (fontFamily) => ({
  htmlFontSize: 16,
  fontFamily,
  fontWeightLight: 300,
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightBold: 700,
  h1: {
    fontWeight: 600,
    fontSize: '38px',
    lineHeight: 1.21
  },
  h2: {
    fontWeight: 600,
    fontSize: '30px',
    lineHeight: 1.27
  },
  h3: {
    fontWeight: 700,
    fontSize: '24px',
    lineHeight: 1.33
  },
  h4: {
    fontWeight: 600,
    fontSize: '20px',
    lineHeight: 1.4
  },
  h5: {
    fontWeight: 400,
    fontSize: '16px',
    lineHeight: 1.5
  },
  h6: {
    fontWeight: 400,
    fontSize: '14px',
    lineHeight: 1.57
  },
  caption: {
    fontWeight: 400,
    fontSize: '12px',
    lineHeight: 1.66
  },
  body1: {
    fontSize: '14px',
    lineHeight: 1.57
  },
  body2: {
    fontSize: '12px',
    lineHeight: 1.66
  },
  subtitle1: {
    fontSize: '14px',
    fontWeight: 600,
    lineHeight: 1.57
  },
  subtitle2: {
    fontSize: '12px',
    fontWeight: 500,
    lineHeight: 1.66
  },
  subtitle3: {
    fontSize: '14px',
    fontWeight: 500,
    lineHeight: 1.57
  },
  overline: {
    lineHeight: 1.66
  },
  button: {
    textTransform: 'capitalize'
  },
  subtitle4: {
    color: '#262626',
    fontSize: '16px',
    fontWeight: 500,
    lineHeight: '42px',
    paddingLeft: '12px'
  }
});

export default Typography;
