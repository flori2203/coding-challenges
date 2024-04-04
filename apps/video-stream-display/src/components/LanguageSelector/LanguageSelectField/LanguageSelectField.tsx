import { InputAdornment, TextField } from "@mui/material";
import { useTranslation } from "react-i18next";
import React from "react";
import StyledIcon from "components/UI/StyledIcon";
import translationIcon from "assets/materialSymbols/translate.svg";

interface LanguageSelectFieldProps {
  short?: boolean;
  onChange?: (newLanguage: string) => void;
  children?: React.ReactNode;
  value?: string;
  variant: "short" | "outlined" | "standard";
}

const LanguageSelectField: React.FC<LanguageSelectFieldProps> = (props) => {
  const { t } = useTranslation();

  const InputProps =
    props.variant === "short"
      ? {
          disableUnderline: true,
        }
      : props.variant === "standard"
      ? {
          startAdornment: (
            <InputAdornment position="start">
              <StyledIcon src={translationIcon} alt={t("translateIconAlt")} />
            </InputAdornment>
          ),
          disableUnderline: true,
        }
      : {
          startAdornment: (
            <InputAdornment position="start">
              <StyledIcon src={translationIcon} alt={t("translateIconAlt")} />
            </InputAdornment>
          ),
        };

  return (
    <TextField
      select
      id="languageSelector"
      aria-label="Language selector"
      InputProps={InputProps}
      value={props.value ? props.value : t("language")}
      variant={props.variant !== "short" ? props.variant : "standard"}
      onChange={(event) =>
        props.onChange
          ? event.target.value && props.onChange(event.target.value)
          : null
      }
    >
      {props.children}
    </TextField>
  );
};

export default LanguageSelectField;
