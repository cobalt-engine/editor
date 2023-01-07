import clsx from "clsx";
import Scrollbars from "react-custom-scrollbars-2";

import { useAppStore } from "../../../stores/app";
import { useLibraryStore } from "../../../stores/library";
import { useSceneStore } from "../../../stores/scene";
import { Heading } from "../../typography/heading";
import { LibraryItem } from "./item";
import classes from "./styles.module.scss";

export const Library = () => {
  const isLibraryOpen = useAppStore((state) => state.isLibraryOpen);
  const isHierarchyOpen = useAppStore((state) => state.isHierarchyOpen);
  const selectedObject = useSceneStore((state) => state.selectedObject);
  const library = useLibraryStore((state) => state.objects);

  return (
    <div
      className={clsx(
        classes.library,
        isLibraryOpen && classes.open,
        !selectedObject && classes.noInspector,
        !isHierarchyOpen && classes.noHierarchy
      )}
    >
      <header>
        <Heading color="light">Библиотека</Heading>
      </header>
      <Scrollbars style={{ width: "100%", height: "100%" }}>
        {library.map(({ name, id }) => (
          <LibraryItem key={id} name={name} />
        ))}
      </Scrollbars>
    </div>
  );
};
