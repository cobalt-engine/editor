import { CSSProperties, forwardRef, HTMLAttributes, ReactNode } from "react";
import { Modal } from "react-overlays";

type BackdropProps = {
  children?: ReactNode;
  isClosable: boolean;
} & HTMLAttributes<HTMLDivElement>;

export const renderBackdrop = (props: BackdropProps) => {
  return <Backdrop {...props} />;
};

export const Backdrop = forwardRef<HTMLDivElement, BackdropProps>(
  function Component({ isClosable, children, ...props }, ref) {
    return (
      <div
        ref={ref}
        style={{
          position: "fixed",
          zIndex: 1040,
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "#000",
          opacity: 0.5,
          cursor: isClosable ? "pointer" : "default",
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

interface Props {
  show: boolean;
  onHide: () => void;
  children: ReactNode;
  isClosable?: boolean;
  style?: CSSProperties;
}

export const BaseModal = ({
  show,
  onHide,
  children,
  isClosable = true,
  style,
}: Props) => {
  return (
    <Modal
      show={show}
      onHide={!isClosable ? undefined : onHide}
      renderBackdrop={(props) => renderBackdrop({ ...props, isClosable })}
    >
      <div
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          position: "fixed",
          width: 400,
          zIndex: 1040,
          backgroundColor: "var(--dark-60)",
          padding: 20,
          borderRadius: 6,
          ...style,
        }}
      >
        {children}
      </div>
    </Modal>
  );
};
