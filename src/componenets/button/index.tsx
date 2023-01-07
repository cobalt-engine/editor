import { CSSProperties, forwardRef, MouseEventHandler, ReactNode } from "react";

import { Paragraph } from "../typography/paragraph";
import classes from "./styles.module.scss";

interface Props {
  children: string;
  icon?: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  style?: CSSProperties;
}

export const Button = forwardRef<HTMLButtonElement, Props>(
  function ButtonForwardRef({ children, onClick, icon, style }, ref) {
    return (
      <button
        ref={ref}
        style={style}
        className={classes.button}
        onClick={onClick}
      >
        {icon}
        <Paragraph>{children}</Paragraph>
      </button>
    );
  }
);
