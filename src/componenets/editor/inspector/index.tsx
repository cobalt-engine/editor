import clsx from "clsx";
import { Atom, Car, ShareNetwork, Trash } from "phosphor-react";
import Scrollbars from "react-custom-scrollbars-2";
import { Dropdown } from "react-overlays";

import { useSceneStore } from "../../../stores/scene";
import { Button } from "../../button";
import { Input } from "../../input";
import { Heading } from "../../typography/heading";
import { Paragraph } from "../../typography/paragraph";
import { PhysicsPanel } from "./panels/physics";
import { RenderingPanel } from "./panels/rendering";
import { TransformPanel } from "./panels/transform";
import classes from "./styles.module.scss";

export const Inspector = () => {
  const removeObject = useSceneStore((state) => state.removeObject);
  const changeObjectName = useSceneStore((state) => state.changeObjectName);
  const selectedObject = useSceneStore((state) => state.selectedObject);
  const enableComponent = useSceneStore((state) => state.enableComponent);

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
                }}
              >
                <Input
                  placeholder="Name"
                  onChange={(v) => changeObjectName(selectedObject, v)}
                  value={selectedObject.name}
                />
                <div className={classes.block}>
                  <Paragraph color="light">Позиция</Paragraph>
                  <TransformPanel />
                </div>
                {selectedObject.rendering.enabled && (
                  <div className={classes.block}>
                    <Paragraph color="light">Модель</Paragraph>
                    <RenderingPanel />
                  </div>
                )}
                {selectedObject.physics.enabled && (
                  <div className={classes.block}>
                    <Paragraph color="light">Физика</Paragraph>
                    <PhysicsPanel />
                  </div>
                )}
              </div>
            </Scrollbars>
            <Dropdown onToggle={() => null} drop="up">
              <Dropdown.Toggle>
                {(props) => (
                  <Button
                    {...props}
                    style={{ marginBottom: 8 }}
                    icon={<Atom />}
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
                      {[
                        {
                          title: "Рендеринг",
                          description: "Модели и материалы",
                          value: "rendering" as const,
                          icon: <Car />,
                        },
                        {
                          title: "Физика (Alpha)",
                          description: "Твёрдость и гравитация. Баги!",
                          value: "physics" as const,
                          icon: <Atom />,
                        },
                        // {
                        //   title: "Сеть",
                        //   description: "Синхронизация и эвенты",
                        //   value: "networking" as const,
                        //   icon: <ShareNetwork />,
                        // },
                      ]
                        .filter(({ value }) => !selectedObject[value].enabled)
                        .map(({ value, title, description, icon }, i) => (
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
                              <Paragraph style={{ marginTop: 2 }} color="light">
                                {description}
                              </Paragraph>
                            </div>
                          </button>
                        ))}
                    </Scrollbars>
                  </div>
                )}
              </Dropdown.Menu>
            </Dropdown>
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
