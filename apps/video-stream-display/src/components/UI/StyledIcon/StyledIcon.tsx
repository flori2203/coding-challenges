import { Icon } from "@mui/material";
import { IconProps } from "@mui/material/Icon";
import React from "react";

interface StyledIconProps {
  src: string;
  alt: string;
  iconProps?: IconProps;
}

const StyledIcon: React.FC<StyledIconProps> = (props) => {
  return (
    <Icon {...props.iconProps}>
      <img src={props.src} alt={props.alt} style={{ height: "100%" }} />
    </Icon>
  );
};

export default StyledIcon;
