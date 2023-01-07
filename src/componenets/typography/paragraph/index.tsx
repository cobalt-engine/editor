import clsx from "clsx";
import { HTMLAttributes } from "react";

import classes from "./styles.module.scss";

type Props = {
  size?: "sm" | "md";
  color?: "light" | "dark" | "custom";
  children: string;
} & HTMLAttributes<HTMLParagraphElement>;

export const Paragraph = ({
  size = "sm",
  color = "dark",
  children,
  ...props
}: Props) => {
  return (
    <p
      {...props}
      className={clsx(
        props.className,
        classes.paragraph,
        size === "sm" && classes.small,
        size === "md" && classes.medium,
        color === "dark" && classes.dark,
        color === "light" && classes.light
      )}
    >
      {children}
    </p>
  );
};
