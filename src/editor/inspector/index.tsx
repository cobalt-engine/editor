import clsx from "clsx";
import {
  ArrowsHorizontal,
  Atom,
  Camera,
  Car,
  CirclesThreePlus,
  CloudFog,
  ShareNetwork,
  Sun,
  Trash,
  X,
} from "phosphor-react";
import { ReactNode, useMemo } from "react";
import Scrollbars from "react-custom-scrollbars-2";
import { Dropdown } from "react-overlays";

import { Button } from "../../componenets/button";
import { Input } from "../../componenets/input";
import { Heading } from "../../componenets/typography/heading";
import { Paragraph } from "../../componenets/typography/paragraph";
import { ComponentName, useSceneStore } from "../../stores/scene";
import { CameraPanel } from "./panels/camera";
import { FogPanel } from "./panels/fog";
import { LightPanel } from "./panels/light";
import { NetworkingPanel } from "./panels/networking";
import { PhysicsPanel } from "./panels/physics";
import { RenderingPanel } from "./panels/rendering";
import { TransformPanel } from "./panels/transform";
import classes from "./styles.module.scss";

interface PanelInfo {
  title: string;
  description: string;
  value: ComponentName;
  icon: ReactNode;
  panel: ReactNode;
  removable?: boolean;
  isAlpha?: boolean;
}

export const Inspector = () => {
  const removeObject = useSceneStore((state) => state.removeObject);
  const changeObjectName = useSceneStore((state) => state.changeObjectName);
  const selectedObject = useSceneStore((state) => state.selectedObject);
  const enableComponent = useSceneStore((state) => state.enableComponent);
  const disableComponent = useSceneStore((state) => state.disableComponent);

  const panels = useMemo<PanelInfo[]>(
    () => [
      {
        title: "Трансформация",
        description: "Internal",
        value: "transform",
        icon: <ArrowsHorizontal />,
        panel: <TransformPanel />,
      },
      {
        title: "Рендеринг",
        description: "Модели и материалы",
        value: "rendering",
        icon: <Car />,
        panel: <RenderingPanel />,
        removable: true,
      },
      {
        title: "Физика",
        description: "Твёрдость и гравитация. Баги!",
        value: "physics",
        icon: <Atom />,
        panel: <PhysicsPanel />,
        removable: true,
        isAlpha: true,
      },
      {
        title: "Сеть",
        description: "Синхронизация и эвенты",
        value: "networking",
        icon: <ShareNetwork />,
        panel: <NetworkingPanel />,
        removable: true,
        isAlpha: true,
      },
      {
        title: "Свет",
        description: "Световые излучения",
        value: "light",
        icon: <Sun />,
        panel: <LightPanel />,
        removable: true,
      },
      {
        title: "Камера",
        description: "Камера и её настройки",
        value: "camera",
        icon: <Camera />,
        panel: <CameraPanel />,
        removable: true,
      },
      {
        title: "Туман",
        description: "Фоновая дымка",
        value: "fog",
        icon: <CloudFog />,
        panel: <FogPanel />,
        removable: true,
      },
    ],
    []
  );
  const availablePanels = useMemo(
    () =>
      panels.filter(({ value }) =>
        selectedObject ? !selectedObject[value].enabled : false
      ),
    [panels, selectedObject]
  );

  return (
    <>
      <div className={clsx(classes.inspector, selectedObject && classes.open)}>
        <header>
          <Heading color="light">Инспектор</Heading>
        </header>
        {selectedObject && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <Scrollbars
              width="100%"
              height="100%"
              style={{
                overflowX: "hidden",
                marginBottom: 12,
              }}
              thumbSize={40}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                  height: "100%",
                  paddingRight: 8,
                }}
              >
                <Input
                  style={{ flexShrink: 0 }}
                  placeholder="Name"
                  onChange={(v) => changeObjectName(selectedObject, v)}
                  value={selectedObject.name}
                />
                {panels.map(
                  ({ value, title, panel, isAlpha, removable }) =>
                    selectedObject[value].enabled && (
                      <div
                        key={`component-${value}-panel`}
                        className={classes.block}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginBottom: 4,
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <Paragraph color="light">{title}</Paragraph>
                            {isAlpha && (
                              <Paragraph
                                title="Может содержать критические баги и недочеты"
                                style={{
                                  marginLeft: 6,
                                  backgroundColor: "var(--light-100)",
                                  borderRadius: 6,
                                  padding: "2px 4px",
                                }}
                              >
                                Alpha
                              </Paragraph>
                            )}
                          </div>
                          {removable && (
                            <button
                              className={classes.disable}
                              onClick={() =>
                                disableComponent(selectedObject, value)
                              }
                            >
                              <X weight="bold" />
                            </button>
                          )}
                        </div>
                        {panel}
                      </div>
                    )
                )}
              </div>
            </Scrollbars>
            {availablePanels.length > 0 && (
              <Dropdown onToggle={() => null} drop="up">
                <Dropdown.Toggle>
                  {(props) => (
                    <Button
                      {...props}
                      style={{ marginBottom: 8 }}
                      icon={<CirclesThreePlus />}
                    >
                      Добавить компонент
                    </Button>
                  )}
                </Dropdown.Toggle>
                <Dropdown.Menu offset={[0, 12]}>
                  {(props, { toggle }) => (
                    <div className={classes.dropdown} {...props}>
                      <Input placeholder="Поиск по компонентам..." />
                      <Scrollbars
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          marginTop: 12,
                        }}
                      >
                        {availablePanels.map(
                          ({ value, title, description, icon }, i) => (
                            <button
                              key={`add-component-component-${value}`}
                              style={{
                                marginTop: i === 0 ? 0 : 6,
                                display: "flex",
                                alignItems: "center",
                                cursor: "pointer",
                              }}
                              onClick={() => {
                                enableComponent(selectedObject, value);
                                if (toggle) toggle(false);
                              }}
                            >
                              <div
                                style={{
                                  width: 32,
                                  height: 32,
                                  backgroundColor: "var(--light-100)",
                                  borderRadius: 6,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                {icon}
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  marginLeft: 8,
                                }}
                              >
                                <Paragraph
                                  style={{ fontWeight: "bold" }}
                                  color="light"
                                >
                                  {title}
                                </Paragraph>
                                <Paragraph
                                  style={{ marginTop: 2 }}
                                  color="light"
                                >
                                  {description}
                                </Paragraph>
                              </div>
                            </button>
                          )
                        )}
                      </Scrollbars>
                    </div>
                  )}
                </Dropdown.Menu>
              </Dropdown>
            )}
            <Button
              icon={<Trash />}
              onClick={() => removeObject(selectedObject)}
            >
              Удалить объект
            </Button>
          </div>
        )}
      </div>
    </>
  );
};
