import { IconButton } from "@mui/material";
import StyledIcon from "components/UI/StyledIcon";
import gridViewIcon from "assets/materialSymbols/gridView.svg";
import closeIcon from "assets/materialSymbols/close.svg";
import backIcon from "assets/materialSymbols/back.svg";
import React from "react";
import { Location, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const checkForExistingMenuSubroutes = (path: string) => {
  const subroutes = path.split("/").filter((item) => item !== "");
  console.log(subroutes);
};

const getCorrectIcon = (location: Location) => {
  /* if (location.pathname === "/menu") {
    return {
      icon: closeIcon,
      altKey: "closeAlt",
      link: location.state.background || "/home",
    };
  } */

  checkForExistingMenuSubroutes(location.pathname);
  /* if () {
        return {icon: closeIcon, altKey: "closeAlt", link: location.state.background || "/home"};
      } */
};

const AppBarNavButton = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  getCorrectIcon(location);

  /* console.log(location.state)
  console.log(location.state.background) */

  return (
    <IconButton
      aria-label="menu-button"
      onClick={() => {
        navigate("/menu", {
          state: { background: window.location.pathname },
        });
      }}
    >
      <StyledIcon
        src={gridViewIcon}
        alt={t("menu")}
        iconProps={{ fontSize: "large" }}
      />
    </IconButton>
  );
};

export default AppBarNavButton;
