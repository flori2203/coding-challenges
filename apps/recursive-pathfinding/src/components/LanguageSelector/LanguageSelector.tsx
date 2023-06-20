import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { MenuItem } from "@mui/material";
import LanguageSelectField from "./LanguageSelectField";

const languageName = new Intl.DisplayNames(["en"], {
  type: "language",
});

const getItems = (
  availableLanguageCodes: string[],
  variant: "short" | "outlined" | "standard"
) => {
  const items = availableLanguageCodes.map((languageCode) => {
    const languageCountry = languageCode.split("-");
    const countryCode = languageCountry[0];

    const country =
      variant === "short"
        ? countryCode.toUpperCase()
        : languageName.of(countryCode);

    return (
      <MenuItem key={languageCode} value={languageCode}>
        {country}
      </MenuItem>
    );
  });
  return items;
};

interface LanguageSelectorProps {
  variant: "short" | "outlined" | "standard";
}

const LanguageSelector: React.FC<LanguageSelectorProps> = (props) => {
  const { i18n } = useTranslation();
  const availableLanguageCodes = Object.keys(i18n.services.resourceStore.data);
  const [lang, setLang] = useState(i18n.language);

  const languageChangeHandler = (newLanguage: string) => {
    i18n.changeLanguage(newLanguage);
    setLang(newLanguage);
  };

  const selectFieldItems = getItems(availableLanguageCodes, props.variant);

  return (
    <LanguageSelectField
      variant={props.variant}
      onChange={(newLanguage) => languageChangeHandler(newLanguage)}
      value={lang.split("-")[0]}
    >
      {selectFieldItems}
    </LanguageSelectField>
  );
};

export default LanguageSelector;
