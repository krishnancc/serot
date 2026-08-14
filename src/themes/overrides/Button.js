// ==============================|| OVERRIDES - BUTTON ||============================== //

export default function Button(theme) {
  const disabledStyle = {
    '&.Mui-disabled': {
      backgroundColor: theme.palette.grey[200]
    }
  };

  return {
    MuiButton: {
      defaultProps: {
        disableElevation: true
      },
      styleOverrides: {
        root: {
          fontWeight: 600,
          fontsize: '20px'
        },
        contained: {
          backgroundColor: '#00BBAB',
          color: '#fff',
          borderColor: '#00BBAB',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderRadius: '5px',
          fontWeight: '700',
          fontSize: '16px',
          '&:hover': {
            backgroundColor: '#00A899',
            bordercolor: '#BFBFBF'
          }
        },
        contained1: {
          backgroundColor: '#fff',
          color: '#959595',
          borderColor: '#959595',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderRadius: '5px',
          fontWeight: '700',
          fontSize: '16px',
          '&:hover': {
            backgroundColor: '#FAFAFA'
          }
        },
        outlined: {
          ...disabledStyle
        }
      }
    }
  };
}
