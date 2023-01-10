import geckos, { ClientChannel } from "@geckos.io/client";
import { useRef } from "react";
import { useShortKey } from "use-short-key";

import { Controls } from "./editor/controls";
import { Hierarchy } from "./editor/hierarchy";
import { Inspector } from "./editor/inspector";
import { Library } from "./editor/library";
import { Menu } from "./editor/menu";
import { Editor } from "./editor/renderer";
import { useMount } from "./hooks/use-mount";
import { AppBusyModal } from "./modals/app-busy";
import { LoadSceneModal } from "./modals/load-scene";
import { createDummyGameObject } from "./shared/gameobject";
import { useAppStore } from "./stores/app";
import { BackendStatus, useNetworkStore } from "./stores/network";

export const App = () => {
  const changeBackendStatus = useAppStore((state) => state.changeBackendStatus);
  const setTick = useNetworkStore((state) => state.setTick);
  const rtc = useRef<ClientChannel | null>(null);

  useMount(() => {
    rtc.current = geckos();

    rtc.current.onConnect((error) => {
      if (error) {
        console.error(error.message, "Ошибка!");
        changeBackendStatus(BackendStatus.Error);
        return;
      }

      changeBackendStatus(BackendStatus.Ready);

      rtc.current?.onDisconnect(() => {
        changeBackendStatus(BackendStatus.Offline);
      });

      rtc.current?.on("tick", (tick) => setTick(tick as number));
      // const interval = setInterval(() => rtc.current?.emit("data", "test"), 16);
      // return () => clearInterval(interval);
    });
  });

  useShortKey({
    ctrlKey: true,
    code: "KeyA",
    keyup: () => createDummyGameObject(),
  });

  return (
    <>
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          userSelect: "none",
          overflow: "hidden",
        }}
      >
        <Menu />
        <div style={{ height: "100%", position: "relative" }}>
          <Editor />
          <Controls />
          <Hierarchy />
          <Inspector />
          <Library />
        </div>
      </div>
      <AppBusyModal />
      <LoadSceneModal />
    </>
  );
};
