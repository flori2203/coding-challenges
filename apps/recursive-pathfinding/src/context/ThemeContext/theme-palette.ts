import { PaletteMode } from "@mui/material";

const getLightPalette = (mode: string) => ({
  mode: mode as PaletteMode,
  background: {
    default: "#303030",
    paper: "#212121",
  },
  error: {
    main: "#C90023",
    light: "#ff0833",
    dark: "#a1001c",
  },
  warning: {
    main: "#FFD02F",
    light: "#FFD959",
    dark: "#F2BB00",
  },
  info: {
    main: "#0D59C5",
    light: "#1e75f0",
    dark: "#0a479e",
  },
  success: {
    main: "#61AF29",
    light: "#7DD240",
    dark: "#4E8C21",
  },
  text: {
    primary: "#ffffff",
    secondary: "#595959",
    disabled: "#8C8C8C",
  },
});

const getDarkPalette = (mode: string) => ({
  mode: mode as PaletteMode,
});

export const createThemePalette = (mode: string) => {
  const palette =
    mode === "light" ? getLightPalette(mode) : getDarkPalette(mode);

  return palette;
};
