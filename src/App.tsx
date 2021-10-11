import React, { useEffect, useState } from "react";
import Accordion from "./components/Accordion/Accordion";
import {
  AccordionContent,
  AccordionType,
} from "./components/Accordion/schema/AccordionSchemaType";
import validateSchema from "./components/Accordion/schema/utils/validateSchema";
import DetailCard from "./components/SidebarxModal/DetailCard";
import SidebarxModalProvider from "./components/SidebarxModal/SidebarxModalProvider";

const updateDetailCardPosition = (
  currentTarget: HTMLElement | null | Event
) => {
  if (window.innerWidth < 1433) {
    return;
  }
  const detailCard = document.querySelector("#detail-card");
  let top;

  if (currentTarget instanceof HTMLElement) {
    top =
      currentTarget.getBoundingClientRect().top -
      document.body.getBoundingClientRect().top;
  }

  if (detailCard instanceof HTMLElement) {
    const selectedItem = document.querySelector(".item.selected");

    if (
      window.scrollY &&
      selectedItem &&
      window.scrollY > selectedItem.getBoundingClientRect().top
    ) {
      top = window.scrollY + 30;
    } else {
      top = selectedItem?.getBoundingClientRect().top;
    }
    detailCard.style.top = top + "px";
    detailCard.style.right = "0px";
  }
};

function App() {
  const [data, setData] = useState<AccordionType[]>();
  const [current, setCurrent] = useState<AccordionContent>();
  const [error, setError] = useState<String>();

  const NestedAccordion = function (index: number) {
    if (!data) return null;
    if (index >= data.length) return null;

    const accordion = data[index];

    return (
      <Accordion
        key={index}
        title={accordion.title}
        parent={true}
        isOpen={accordion.open}
        data-section={accordion.title}
      >
        {accordion.content &&
          accordion.content.map((subAccordion, index) =>
            React.createElement(
              subAccordion.expandable ? Accordion : React.Fragment,
              {
                arrow: false,
                key: index,
                title: subAccordion.title,
                color: subAccordion.color,
                background: subAccordion.background,
                isOpen: subAccordion.open,
                fullWidth: subAccordion.fullWidth,
                style: {
                  flex: subAccordion.columns || 1,
                },
                "data-section": accordion.title,
              },
              subAccordion.sections && (
                <ul
                  className="category-items"
                  style={{
                    gridTemplateColumns: `repeat(${subAccordion.columns},1fr)`,
                    gap: 16,
                  }}
                >
                  {subAccordion.sections.map((section, index) => {
                    const style = {
                      background:
                        section.background ||
                        section.color ||
                        subAccordion.sectionColor,
                      border: `3px solid`,
                      borderColor: "",
                      color: section.color,
                    };
                    let dataColor = subAccordion.color;
                    if (style.background !== section.background) {
                      style.background += "80";
                    }
                    if (section.selected?.color) {
                      style.borderColor = section.selected.color;
                      dataColor = section.selected.color;
                    } else if (style.background)
                      style.borderColor = style.background;

                    return (
                      <li
                        className="item"
                        key={index}
                        style={style}
                        data-color={dataColor}
                        data-initial-color={subAccordion.color}
                        onClick={({ currentTarget }) => {
                          if (!currentTarget.classList.contains("selected")) {
                            document
                              .querySelectorAll(".item.selected")
                              .forEach((element) => {
                                element.classList.remove("selected");
                              });

                            currentTarget.classList.add("selected");
                            currentTarget.style.color =
                              currentTarget.getAttribute("data-color") + "";
                            setCurrent(section.content);
                          } else {
                            currentTarget.classList.remove("selected");

                            setCurrent(undefined);
                          }

                          document.querySelectorAll(".item").forEach((el) => {
                            const element = el as HTMLElement;
                            if (!element.classList.contains("selected")) {
                              element.style.color =
                                element.getAttribute("data-initial-color") + "";
                            }
                          });

                          setTimeout(() => {
                            updateDetailCardPosition(currentTarget);
                          }, 0);
                        }}
                      >
                        <h1>{section.title}</h1>
                        <h2>{section.subtitle}</h2>
                      </li>
                    );
                  })}
                </ul>
              )
            )
          )}
        {NestedAccordion(index + 1)}
      </Accordion>
    );
  };

  useEffect(() => {
    fetch("/accordion_data.json")
      .then((resp) => resp.json())
      .then((data) => {
        if (validateSchema(data).errors.length) {
          setError(validateSchema(data).errors[0].stack);
        } else {
          setData(data);
        }
      });
    window.addEventListener("scroll", updateDetailCardPosition);
    return () => {};
  }, []);

  return (
    <SidebarxModalProvider.Provider value={{ current, setCurrent }}>
      <div className="wrapper">
        {error && <b>{error}</b>}
        {data && !error && NestedAccordion(0)}
        <DetailCard />
      </div>
    </SidebarxModalProvider.Provider>
  );
}

export default App;
