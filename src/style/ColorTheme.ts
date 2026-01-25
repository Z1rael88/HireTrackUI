import { createTheme, alpha } from "@mui/material/styles";

export const TOKENS = {
  radius: {
    xs: 10,
    sm: 12,
    md: 16,
    lg: 18,
    xl: 22,
    pill: 999
  },
  shadow: {
    menu: "0 14px 40px rgba(26,26,26,0.18)",
    soft: "0 10px 34px rgba(26,26,26,0.10)",
    glass: "0 18px 70px rgba(26,26,26,0.12)"
  }
};

export const COLORS = {
  white: "#FFFFFF",
  black: "#1A1A1A",

  bg: "#ECEDEF",
  surface: "#F4F5F7",
  surface2: "#E6E8EB",

  accent: "#F4C400",
  accentHover: "#D9A800",

  success: "#19502a",
  error: "#9e1d1d",
  warning: "#F4C400",

  textPrimary: "#1A1A1A",
  textSecondary: "rgba(26,26,26,0.70)",
  textMuted: "rgba(26,26,26,0.55)",

  border: "rgba(26,26,26,0.12)",
  borderSoft: "rgba(26,26,26,0.09)",
  divider: "rgba(26,26,26,0.08)",

  inputBg: "#F4F5F7",
  inputBorder: "rgba(26,26,26,0.22)",

  menuItemHoverBg: "rgba(26,26,26,0.06)",
  menuItemSelectedBg: "rgba(244,196,0,0.20)",
  menuItemSelectedHoverBg: "rgba(244,196,0,0.26)",

  selectIconDefault: "#667085"
};

const menuPaper = {
  backgroundColor: alpha(COLORS.surface, 0.94),
  color: COLORS.textPrimary,
  border: `1px solid ${alpha(COLORS.black, 0.10)}`,
  boxShadow: TOKENS.shadow.menu,
  borderRadius: 14,
  backdropFilter: "blur(10px)"
};

const optionBase = {
  borderRadius: 10,
  paddingBlock: 8,
  paddingInline: 12,
  fontSize: 14.5,
  fontWeight: 600,
  lineHeight: 1.2,
  color: "inherit",
  transition: "background-color .15s ease, color .15s ease",
  "&:not(:last-of-type)": { marginBottom: 4 },
  "&:hover": { backgroundColor: COLORS.menuItemHoverBg },
  "&.Mui-disabled": { opacity: 0.5 }
};

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: COLORS.black, contrastText: COLORS.white },
    secondary: { main: COLORS.accent, contrastText: COLORS.black },
    error: { main: COLORS.error },
    success: { main: COLORS.success },
    warning: { main: COLORS.warning },
    background: { default: COLORS.bg, paper: COLORS.surface },
    text: { primary: COLORS.textPrimary, secondary: COLORS.textSecondary },
    divider: COLORS.divider
  },

  shape: { borderRadius: 12 },

  typography: {
    fontFamily: `"Inter", system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif`,
    h1: { fontSize: "2.25rem", fontWeight: 850, lineHeight: 1.12, letterSpacing: "-0.02em" },
    h2: { fontSize: "1.875rem", fontWeight: 850, lineHeight: 1.18, letterSpacing: "-0.02em" },
    h3: { fontSize: "1.5rem", fontWeight: 850, lineHeight: 1.22, letterSpacing: "-0.015em" },
    h4: { fontSize: "1.25rem", fontWeight: 800, lineHeight: 1.24 },
    h5: { fontSize: "1.125rem", fontWeight: 750, lineHeight: 1.28 },
    h6: { fontSize: "1rem", fontWeight: 750, lineHeight: 1.3 },
    body1: { fontSize: "1rem", lineHeight: 1.55 },
    body2: { fontSize: "0.9375rem", lineHeight: 1.55 },
    caption: { fontSize: "0.8125rem", lineHeight: 1.4, color: COLORS.textMuted },
    button: { fontWeight: 750, textTransform: "none" }
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        "html, body": {
          width: "100%",
          overflowX: "hidden"
        },
        "#root": {
          width: "100%",
          overflowX: "hidden"
        },
        body: {
          color: COLORS.textPrimary,
          backgroundImage: `
            radial-gradient(900px 420px at 72% 60%, ${alpha(COLORS.accent, 0.10)} 0%, transparent 60%),
            radial-gradient(900px 520px at 20% 10%, ${alpha(COLORS.black, 0.06)} 0%, transparent 60%)
          `,
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed"
        },
        "*": { boxSizing: "border-box" },

        ".app-shell": {
          maxWidth: 1320,
          marginInline: "auto",
          padding: 24
        },

        ".glass": {
          backgroundColor: alpha(COLORS.surface, 0.88),
          border: `1px solid ${COLORS.borderSoft}`,
          boxShadow: TOKENS.shadow.glass,
          backdropFilter: "blur(12px)",
          borderRadius: 22
        },

        ".glass-soft": {
          backgroundColor: alpha(COLORS.surface, 0.78),
          border: `1px solid ${COLORS.borderSoft}`,
          boxShadow: TOKENS.shadow.soft,
          backdropFilter: "blur(10px)",
          borderRadius: 20
        },

        ".section": {
          backgroundColor: alpha(COLORS.surface, 0.78),
          border: `1px solid ${COLORS.borderSoft}`,
          boxShadow: TOKENS.shadow.soft,
          backdropFilter: "blur(10px)",
          borderRadius: 18
        },

        ".sidebar": { padding: 14 },
        ".content": { padding: 18 },

        "@media (max-width:900px)": {
          ".app-shell": { padding: 12 },
          ".glass": { borderRadius: 18 },
          ".glass-soft": { borderRadius: 18 },
          ".section": { borderRadius: 16 },
          ".sidebar": { padding: 12 },
          ".content": { padding: 12 }
        },

        "@media (max-width:600px)": {
          ".app-shell": { padding: 10 },
          ".glass": { borderRadius: 16 },
          ".glass-soft": { borderRadius: 16 },
          ".section": { borderRadius: 14 }
        }
      }
    },

    MuiPaper: {
      styleOverrides: {
        root: { border: `1px solid ${COLORS.borderSoft}` }
      }
    },

    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: alpha(COLORS.surface, 0.88),
          color: COLORS.black,
          boxShadow: "none",
          borderBottom: `1px solid ${alpha(COLORS.black, 0.08)}`,
          backdropFilter: "blur(12px)"
        }
      }
    },

    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: alpha(COLORS.surface2, 0.75),
          borderRight: `1px solid ${COLORS.borderSoft}`,
          backdropFilter: "blur(10px)"
        }
      }
    },

    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          paddingInline: 12,
          transition: "background-color .15s ease, color .15s ease",
          "&:hover": { backgroundColor: alpha(COLORS.black, 0.05) },
          "&.Mui-selected": {
            backgroundColor: alpha(COLORS.accent, 0.16),
            "&:hover": { backgroundColor: alpha(COLORS.accent, 0.20) }
          }
        }
      }
    },

    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          textTransform: "none",
          transition: "color .25s, background-color .25s, border-color .25s",
          "& .MuiButton-startIcon > *:first-of-type": { fontSize: 18 }
        },
        text: {
          "&:hover": {
            color: COLORS.accentHover,
            textDecoration: "underline",
            textUnderlineOffset: "5px",
            backgroundColor: "transparent"
          }
        },
        outlined: {
          borderColor: COLORS.inputBorder,
          color: COLORS.black,
          "&:hover": {
            borderColor: COLORS.accent,
            backgroundColor: alpha(COLORS.accent, 0.08)
          }
        },
        contained: {
          backgroundColor: COLORS.accent,
          color: COLORS.black,
          boxShadow: "none",
          "&:hover": { backgroundColor: COLORS.accentHover, boxShadow: "none" }
        }
      }
    },

    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: alpha(COLORS.surface, 0.94),
          border: `1px solid ${COLORS.borderSoft}`,
          boxShadow: "none",
          borderRadius: 16,
          backdropFilter: "blur(8px)"
        }
      }
    },

    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 18,
          backgroundColor: alpha(COLORS.surface, 0.94),
          border: `1px solid ${COLORS.borderSoft}`,
          boxShadow: "none",
          backdropFilter: "blur(12px)",
          "@media (max-width:600px)": {
            margin: 12,
            width: "calc(100% - 24px)",
            maxWidth: "calc(100% - 24px)"
          }
        }
      }
    },

    MuiTextField: {
      defaultProps: { variant: "outlined", fullWidth: true }
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          backgroundColor: COLORS.inputBg,
          padding: 10,
          "& .MuiOutlinedInput-notchedOutline": { borderColor: COLORS.inputBorder },
          "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: alpha(COLORS.black, 0.30) },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: COLORS.accent },
          "@media (max-width:600px)": {
            padding: 8,
            borderRadius: 12
          }
        },
        input: {
          fontSize: 16,
          color: COLORS.black,
          "&::placeholder": { color: COLORS.textMuted, opacity: 1 },
          "&::-ms-reveal": { display: "none" },
          "&::-ms-clear": { display: "none" },
          "@media (max-width:600px)": {
            fontSize: 15
          }
        }
      }
    },

    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: COLORS.textMuted,
          "&.Mui-focused": { color: COLORS.accentHover }
        }
      }
    },

    MuiFormHelperText: {
      styleOverrides: { root: { marginLeft: 0 } }
    },

    MuiTabs: {
      styleOverrides: {
        root: { minHeight: 38 },
        indicator: { height: 2, borderRadius: 1, backgroundColor: COLORS.accent }
      }
    },

    MuiTab: {
      styleOverrides: {
        root: {
          minHeight: 38,
          paddingInline: 12,
          textTransform: "none",
          fontWeight: 600,
          "&.Mui-selected": { color: COLORS.black },
          "@media (max-width:600px)": { paddingInline: 10 }
        }
      }
    },

    MuiMenu: {
      styleOverrides: {
        paper: menuPaper,
        list: {
          paddingBlock: 6,
          paddingInline: 6,
          minWidth: 200,
          "@media (max-width:600px)": { minWidth: "min(92vw, 320px)" }
        }
      }
    },

    MuiMenuItem: {
      styleOverrides: {
        root: {
          ...optionBase,
          "&.Mui-selected": {
            backgroundColor: COLORS.menuItemSelectedBg,
            color: COLORS.black,
            "&:hover": { backgroundColor: COLORS.menuItemSelectedHoverBg }
          }
        }
      }
    },

    MuiAutocomplete: {
      styleOverrides: {
        paper: menuPaper,
        listbox: {
          paddingBlock: 6,
          paddingInline: 6,
          minWidth: 200,
          "@media (max-width:600px)": { minWidth: "min(92vw, 320px)" }
        },
        option: {
          ...optionBase,
          "&[aria-selected=\"true\"]": {
            backgroundColor: COLORS.menuItemSelectedBg,
            color: COLORS.black,
            "&:hover": { backgroundColor: COLORS.menuItemSelectedHoverBg }
          },
          "&.Mui-focused": { backgroundColor: COLORS.menuItemHoverBg }
        },
        root: {
          "& .MuiOutlinedInput-root.MuiAutocomplete-inputRoot": {
            padding: "15px !important",
            paddingRight: "52px !important",
            display: "flex",
            alignItems: "center"
          },
          "& .MuiOutlinedInput-root.MuiAutocomplete-inputRoot .MuiAutocomplete-input": {
            padding: "0 !important"
          },
          "& .MuiAutocomplete-endAdornment": { right: 10 },
          "@media (max-width:600px)": {
            "& .MuiOutlinedInput-root.MuiAutocomplete-inputRoot": {
              padding: "12px !important",
              paddingRight: "44px !important"
            },
            "& .MuiAutocomplete-endAdornment": { right: 8 }
          }
        }
      }
    },

    MuiSvgIcon: {
      styleOverrides: {
        root: {
          "&.MuiSelect-icon": { color: COLORS.selectIconDefault },
          "&.MuiSelect-iconOpen": { color: COLORS.accentHover }
        }
      }
    }
  }
});

export default theme;
