import React, { useEffect, useState } from "react";
import Accordion from "./components/Accordion/Accordion";
import {
  AccordionContent,
  AccordionType,
} from "./components/Accordion/schema/AccordionSchemaType";
import validateSchema from "./components/Accordion/schema/utils/validateSchema";
import DetailCard from "./components/SidebarxModal/DetailCard";
import SidebarxModalProvider from "./components/SidebarxModal/SidebarxModalProvider";

declare global {
  interface Window {
    r: any;
    x: any;
  }
}

export function updatedSelectedItem() {
  document.querySelectorAll(".item").forEach((el) => {
    const element = el as HTMLElement;
    if (!element.classList.contains("selected")) {
      element.style.color = element.getAttribute("data-initial-color") + "";
    }
  });
}

const updateDetailCardPosition = () => {
  const detailCard = document.querySelector("#detail-card");
  const rootDiv = window.parent.document.querySelector("#nested-accordion");
  const internalDiv = document.querySelector("#nested-accordion");
  let top, bottom;

  top = window.parent.document.body.getBoundingClientRect().top * -1;

  if (rootDiv && rootDiv?.getBoundingClientRect().top < 20) {
    top -= top + rootDiv.getBoundingClientRect().top;

    if (detailCard instanceof HTMLElement) {
      if (internalDiv) {
        let topOffset =
          rootDiv.getBoundingClientRect().top +
          window.parent.document.documentElement.scrollTop;
        bottom = topOffset + internalDiv.clientHeight;
        if (
          window.parent.document.documentElement.scrollTop +
            detailCard.clientHeight >
          bottom
        ) {
          return;
        }
      }
      detailCard.style.top = top + 20 + "px";
    }
  }
};

function App() {
  const [data, setData] = useState<AccordionType[]>();
  const [detailCardData, setDetailCardData] = useState<AccordionContent>();
  const [current, setCurrent] = useState<AccordionContent>();
  const [error, setError] = useState<String>();

  const NestedAccordion = function (index: number) {
    if (!data) return null;
    if (index >= data.length) return null;

    const accordion = data[index];

    return (
      <Accordion
        key={index}
        parent={true}
        data-section={accordion.title}
        {...accordion}
      >
        {accordion.content &&
          accordion.content.map((subAccordion, index) =>
            React.createElement(
              subAccordion.expandable ? Accordion : React.Fragment,
              {
                arrow: false,
                key: index,
                ...subAccordion,
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

                          updatedSelectedItem();

                          setTimeout(() => {
                            updateDetailCardPosition();
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
          setData(data.data);
          setDetailCardData(data.detailCard);
        }
      });
    window.parent.addEventListener("scroll", updateDetailCardPosition);
    return () => {
      window.parent.removeEventListener("scrool", updateDetailCardPosition);
    };
  }, []);

  return (
    <SidebarxModalProvider.Provider value={{ current, setCurrent }}>
      <div className="wrapper">
        {error && <b>{error}</b>}
        {data && !error && NestedAccordion(0)}
        <DetailCard data={detailCardData} />
      </div>
    </SidebarxModalProvider.Provider>
  );
}

export default App;