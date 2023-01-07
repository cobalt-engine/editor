import { Controls } from "./componenets/editor/controls";
import { Editor } from "./componenets/editor/editor";
import { Hierarchy } from "./componenets/editor/hierarchy";
import { Inspector } from "./componenets/editor/inspector";
import { Library } from "./componenets/editor/library";
import { Menu } from "./componenets/menu";
import { AppBusyModal } from "./modals/app-busy";
import { LoadSceneModal } from "./modals/load-scene";

export const App = () => {
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
