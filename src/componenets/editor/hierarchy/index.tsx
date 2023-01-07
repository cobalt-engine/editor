import { NodeModel, Tree } from "@minoru/react-dnd-treeview";
import clsx from "clsx";
import { Cube } from "phosphor-react";
import { useEffect, useMemo } from "react";
import Scrollbars from "react-custom-scrollbars-2";

import { GameObject } from "../../../primitives/gameobject";
import { useAppStore } from "../../../stores/app";
import { useSceneStore } from "../../../stores/scene";
import { Paragraph } from "../../typography/paragraph";
import classes from "./styles.module.scss";

export const Placeholder = (props: { depth: number }) => {
  const left = props.depth * 24;
  return <div className={classes.placeholder} style={{ left }} />;
};

export const Hierarchy = () => {
  const isHierarchyOpen = useAppStore((state) => state.isHierarchyOpen);
  const closeHierarchy = useAppStore((state) => state.closeHierarchy);
  const openHierarchy = useAppStore((state) => state.openHierarchy);
  const scene = useSceneStore((state) => state.objects);
  const setScene = useSceneStore((state) => state.setScene);
  const selectObject = useSceneStore((state) => state.selectObject);
  const selectedObject = useSceneStore((state) => state.selectedObject);
  const tree = useMemo<NodeModel<GameObject>[]>(
    () =>
      scene.map((gameObject) => ({
        id: gameObject.id,
        parent: 0,
        droppable: false,
        text: gameObject.name,
        data: gameObject,
      })),
    [scene]
  );

  useEffect(() => {
    if (!scene.length) closeHierarchy();
    else openHierarchy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene.length]);

  return (
    <div className={clsx(classes.hierarchy, isHierarchyOpen && classes.open)}>
      <Scrollbars
        style={{ width: "100%", height: "100%" }}
        autoHide
        thumbSize={32}
      >
        <Tree
          classes={{
            root: classes.treeRoot,
            placeholder: classes.placeholderContainer,
          }}
          tree={tree}
          rootId={0}
          onDrop={(tree, options) => {
            console.log(tree, options);
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            setScene(tree.map(({ data }) => data!));
          }}
          sort={false}
          insertDroppableFirst={false}
          canDrop={(tree, { dragSource, dropTargetId, dropTarget }) => {
            if (dragSource?.parent === dropTargetId) {
              return true;
            }
          }}
          dropTargetOffset={6}
          placeholderRender={(node, { depth }) => <Placeholder depth={depth} />}
          render={(node, { depth, isOpen, onToggle }) => (
            // <div style={{ marginLeft: depth * 10 }}>
            //   {node.droppable && (
            //     <button onClick={onToggle}>{isOpen ? "[-]" : "[+]"}</button>
            //   )}
            //   {node.text}
            // </div>
            <button
              className={clsx(
                classes.item,
                node.data?.id === selectedObject?.id && classes.active
              )}
              onClick={() => {
                if (node.data) selectObject(node.data);
              }}
            >
              <Cube weight="fill" />
              <Paragraph color="custom">{node.text}</Paragraph>
            </button>
          )}
        />
      </Scrollbars>
    </div>
  );
};
