import { IconButton } from "@mui/material";
import StyledIcon from "apps/pong-game/src/components/UI/StyledIcon";
import gridViewIcon from "apps/pong-game/src/assets/materialSymbols/gridView.svg";
import closeIcon from "apps/pong-game/src/assets/materialSymbols/close.svg";
import backIcon from "apps/pong-game/src/assets/materialSymbols/back.svg";
import React from "react";
import { Location, useLocation, useNavigate } from "react-router-dom";

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
        alt={"menu"}
        iconProps={{ fontSize: "large" }}
      />
    </IconButton>
  );
};

export default AppBarNavButton;
