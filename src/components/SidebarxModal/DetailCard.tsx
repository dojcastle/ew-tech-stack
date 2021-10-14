import { useContext, useEffect } from "react";
import { updatedSelectedItem } from "../../App";
import { AccordionContent } from "../Accordion/schema/AccordionSchemaType";
import SidebarxModalProvider from "./SidebarxModalProvider";

interface DetailCardProps {
  data: AccordionContent | undefined;
}

export default function DetailCard(props: DetailCardProps) {
  const context = useContext(SidebarxModalProvider);

  useEffect(() => {
    if (
      context &&
      !context?.current &&
      props.data &&
      window.innerWidth >= 1015
    ) {
      context.setCurrent(props.data);
    }
    if (!context?.current) {
      document.querySelectorAll(".item.selected").forEach((el) => {
        el.classList.remove("selected");
      });
      updatedSelectedItem();
    }
  }, [context]);

  if (context?.current) {
    const {
      current: {
        title,
        body = "",
        variant = "simple",
        urls: { sources = [], readCaseStudy = null } = {},
      },
      setCurrent,
    } = context;

    const readMore = sources
      .find((q) => q.toLowerCase().indexOf("read more") >= 0)
      ?.replace("Read more:", "");

    return (
      <div
        className="detail-card-container"
        onClick={({ currentTarget }) => {
          if (window.getComputedStyle(currentTarget).position === "fixed") {
            setCurrent(undefined);
          }
        }}
      >
        <div
          id="detail-card"
          className={[variant, readCaseStudy ? "has-case-study" : ""]
            .join(" ")
            .trim()}
        >
          <h1>
            {title}

            <span
              className="close-btn"
              onClick={() => {
                setCurrent(props.data);
              }}
            >
              &times;
            </span>
          </h1>
          <div
            className="body"
            dangerouslySetInnerHTML={{
              __html: body.replaceAll("\n", "<br/>"),
            }}
          />
          <div className="urls">
            {readMore && (
              <a target="_blank" href={readMore}>
                Read More
              </a>
            )}
            {sources
              .filter((q) => q.toLowerCase().indexOf("read more") < 0)
              .map((source, index) => {
                let href = source.match(/(https?:\/\/[^ ]*)/);
                if (href) {
                  href = href[1].match(
                    /(?:^https?:\/\/([^\/]+)(?:[\/,]|$)|^(.*)$)/
                  );
                }
                return (
                  <a
                    key={index}
                    target="_blank"
                    href={source.substr(source.indexOf(":") + 1).trim()}
                  >
                    {href && source.substr(0, source.indexOf(":"))}
                  </a>
                );
              })}
          </div>
          {readCaseStudy && (
            <a target="_blank" href={readCaseStudy} className="read-case-study">
              Read Case Study
            </a>
          )}
        </div>
      </div>
    );
  } else {
    return null;
  }
}
