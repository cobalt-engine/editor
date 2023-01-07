import { MoonLoader } from "react-spinners";

import { useModalStore } from "../stores/modals";
import { BaseModal } from "./base";

export const AppBusyModal = () => {
  const isAppBusyModalVisible = useModalStore(
    (state) => state.isAppBusyModalVisible
  );
  const closeAppBusyModal = useModalStore((state) => state.closeAppBusyModal);

  return (
    <BaseModal
      isClosable={false}
      show={isAppBusyModalVisible}
      onHide={closeAppBusyModal}
      style={{
        width: 100,
        height: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <MoonLoader
        size={30}
        cssOverride={{ display: "block", margin: "auto" }}
      />
    </BaseModal>
  );
};
