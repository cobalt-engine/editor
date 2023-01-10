import clsx from "clsx";
import Scrollbars from "react-custom-scrollbars-2";

import { Heading } from "../../componenets/typography/heading";
import { useAppStore } from "../../stores/app";
import { useLibraryStore } from "../../stores/library";
import { useSceneStore } from "../../stores/scene";
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
        <div style={{ display: "flex" }}>
          {library.map(({ src, name, id }, i) => (
            <LibraryItem
              key={id}
              style={{ marginLeft: i === 0 ? 0 : 12 }}
              name={name}
              src={src}
            />
          ))}
        </div>
      </Scrollbars>
    </div>
  );
};
