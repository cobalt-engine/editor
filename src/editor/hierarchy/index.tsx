import { NodeModel, Tree } from "@minoru/react-dnd-treeview";
import clsx from "clsx";
import { Aperture, Camera, Cube, IconProps, Sun } from "phosphor-react";
import { createElement, FC, useEffect, useMemo, useState } from "react";
import {
  Item,
  Menu as ContextMenu,
  RightSlot,
  Submenu,
  useContextMenu,
} from "react-contexify";
import Scrollbars from "react-custom-scrollbars-2";
import Selecto from "react-selecto";

import { Paragraph } from "../../componenets/typography/paragraph";
import { GameObject } from "../../primitives/gameobject";
import {
  createDummyCamera,
  createDummyGameObject,
  createDummyLight,
} from "../../shared/gameobject";
import { useAppStore } from "../../stores/app";
import { useSceneStore } from "../../stores/scene";
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
  const removeObject = useSceneStore((state) => state.removeObject);
  const selectedObject = useSceneStore((state) => state.selectedObject);
  const setCreateObjectPopupVisible = useAppStore(
    (state) => state.setCreateObjectPopupVisible
  );
  const [selectedEditObject, setSelectedEditObject] =
    useState<GameObject | null>(null);
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
  const [multiSelection, setMultiSelection] = useState<GameObject[]>([]);
  const [isHierarchyDragging, setHierarchyDragging] = useState(false);

  const { show: showCreate } = useContextMenu({
    id: "CONTEXT_MENU_CREATE_OBJECT",
  });
  const { show: showMulti } = useContextMenu({
    id: "CONTEXT_MENU_MULTI_OBJECT",
  });
  const { show: showEdit } = useContextMenu({
    id: "CONTEXT_MENU_EDIT_OBJECT",
  });

  useEffect(() => {
    if (!scene.length) closeHierarchy();
    else openHierarchy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene.length]);

  return (
    <>
      <div
        className={clsx(classes.hierarchy, isHierarchyOpen && classes.open)}
        onContextMenu={(event) => showCreate({ event })}
      >
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
            placeholderRender={(node, { depth }) => (
              <Placeholder depth={depth} />
            )}
            onDragStart={() => setHierarchyDragging(true)}
            onDragEnd={() => setHierarchyDragging(false)}
            render={(node, { depth, isOpen, onToggle }) => (
              // <div style={{ marginLeft: depth * 10 }}>
              //   {node.droppable && (
              //     <button onClick={onToggle}>{isOpen ? "[-]" : "[+]"}</button>
              //   )}
              //   {node.text}
              // </div>
              <button
                onContextMenu={(event) => {
                  if (node.data) setSelectedEditObject(node.data);
                  showEdit({ event });
                  event.stopPropagation();
                }}
                id={node.data?.id}
                className={clsx(
                  classes.item,
                  (selectedEditObject?.id === node.data?.id ||
                    multiSelection.find(({ id }) => id === node.data?.id) ||
                    node.data?.id === selectedObject?.id) &&
                    classes.active
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

      <ContextMenu
        id="CONTEXT_MENU_CREATE_OBJECT"
        onVisibilityChange={(v) => setCreateObjectPopupVisible(v)}
      >
        <Item onClick={() => createDummyGameObject()}>
          <AddObjectMenuItem icon={Cube} keyCode="Ctrl + A">
            Пустой объект
          </AddObjectMenuItem>
        </Item>
        <Item onClick={() => createDummyCamera()}>
          <AddObjectMenuItem icon={Camera}>Камера</AddObjectMenuItem>
        </Item>
        {/* <Submenu
          label={
            <AddObjectMenuItem icon={Aperture}>
              Пост-процессинг
            </AddObjectMenuItem>
          }
        >
          <Item onClick={() => void null}>
            <AddObjectMenuItem icon={Aperture}>
              Глубина резкости
            </AddObjectMenuItem>
          </Item>
        </Submenu> */}
        <Item onClick={() => createDummyLight()}>
          <AddObjectMenuItem icon={Sun}>Свет</AddObjectMenuItem>
        </Item>
      </ContextMenu>

      <ContextMenu
        id="CONTEXT_MENU_MULTI_OBJECT"
        onVisibilityChange={(visible) => {
          if (visible) return;
          setMultiSelection([]);
        }}
      >
        <Item
          onClick={() => {
            for (const object of multiSelection) {
              removeObject(object);
            }
          }}
        >
          <Paragraph color="light">Удалить</Paragraph>
        </Item>
        <Item
          onClick={() => {
            alert("Не реализовано");
          }}
        >
          <Paragraph color="light">Сгруппировать</Paragraph>
        </Item>
      </ContextMenu>

      <ContextMenu
        id="CONTEXT_MENU_EDIT_OBJECT"
        onVisibilityChange={(visible) => {
          if (visible) return;
          setSelectedEditObject(null);
        }}
      >
        <Item
          onClick={() => {
            if (selectedEditObject) removeObject(selectedEditObject);
            setSelectedEditObject(null);
          }}
        >
          <Paragraph color="light">Удалить</Paragraph>
        </Item>
        <Item
          onClick={() => {
            alert("Не реализовано");
          }}
        >
          <Paragraph color="light">Переименовать</Paragraph>
        </Item>
      </ContextMenu>

      {!isHierarchyDragging && (
        <Selecto
          dragContainer={"." + classes.hierarchy}
          selectableTargets={["." + classes.item]}
          selectByClick={false}
          continueSelect={false}
          hitRate={0}
          preventClickEventOnDrag
          onSelectEnd={({ isClick, inputEvent }) => {
            if (isClick || !multiSelection.length) return;
            showMulti({
              event: inputEvent,
            });
          }}
          onSelect={({ added, removed }) => {
            setMultiSelection((old) => [
              ...old,
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              ...added.map(
                ({ id }) => scene.find((object) => object.id === id)!
              ),
            ]);
            setMultiSelection((old) => {
              const copy = [...old];
              const ids = removed.map(({ id }) => id);
              return copy.filter(({ id }) => !ids.includes(id));
            });
          }}
        />
      )}
    </>
  );
};

const AddObjectMenuItem = ({
  icon,
  children,
  keyCode,
}: {
  icon: FC<IconProps>;
  children: string;
  keyCode?: string;
}) => (
  <>
    {createElement(icon, { weight: "fill" })}
    <Paragraph color="light" style={{ marginLeft: 6 }}>
      {children}
    </Paragraph>
    {keyCode && (
      <RightSlot>
        <Paragraph color="custom" style={{ color: "var(--light-80)" }}>
          {keyCode}
        </Paragraph>
      </RightSlot>
    )}
  </>
);
