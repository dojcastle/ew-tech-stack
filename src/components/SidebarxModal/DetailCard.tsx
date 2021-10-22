import { useContext, useEffect, useRef } from "react";
import { updatedSelectedItem } from "../../App";
import { AccordionContent } from "../Accordion/schema/AccordionSchemaType";
import SidebarxModalProvider from "./SidebarxModalProvider";

interface DetailCardProps {
  data: AccordionContent | undefined;
}

export function Card({
  variant,
  readCaseStudy,
  title,
  setCurrent,
  data,
  readMore,
  sources,
  body,
  onClose,
}: {
  variant: string | undefined;
  readCaseStudy: string | null;
  title: string | undefined;
  setCurrent: Function;
  data: AccordionContent | undefined;
  body: string;
  readMore: string | undefined;
  sources: string[];
  onClose?: Function;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  const fixHeight = () => {
    if (!cardRef.current) return;
    const winHeight = window.innerHeight;
    const c = cardRef.current;
    if (c.clientHeight > winHeight) {
      const hHeight = c.querySelector("h1")?.clientHeight || 0;
      const fHeight = c.querySelector(".urls")?.clientHeight || 0;
      const body = c.querySelector(".body") as HTMLElement;

      if (body) {
        body.style.height = winHeight - hHeight - fHeight - 100 + "px";
      }
    }
  };

  useEffect(() => {
    fixHeight();
  }, []);

  return (
    <div
      ref={cardRef}
      className={["detail-card", variant, readCaseStudy ? "has-case-study" : ""]
        .join(" ")
        .trim()}
    >
      <h1>
        {title}
        <span
          className="close-btn"
          onClick={() => {
            if (onClose) {
              onClose();
              return;
            }
            setCurrent(data);
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
          <a target="_blank" rel="noreferrer" href={readMore}>
            Read More
          </a>
        )}
        {sources
          .filter((q) => q.toLowerCase().indexOf("read more") < 0)
          .map((source, index) => {
            let href =
              source.match(/(https?:\/\/[^ ]*)/); /* eslint-disable-line */
            if (href) {
              href = href[1].match(
                /(?:^https?:\/\/([^\/]+)(?:[\/,]|$)|^(.*)$)/ /* eslint-disable-line */
              );
            }
            return (
              <a
                key={index}
                target="_blank"
                rel="noreferrer"
                href={source.substr(source.indexOf(":") + 1).trim()}
              >
                {href && source.substr(0, source.indexOf(":"))}
              </a>
            );
          })}
      </div>
      {readCaseStudy && (
        <a
          target="_blank"
          rel="noreferrer"
          href={readCaseStudy}
          className="read-case-study"
        >
          Read Case Study
        </a>
      )}
    </div>
  );
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
  }, [context, props.data]);

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
        <Card
          sources={sources}
          variant={variant}
          readMore={readMore}
          readCaseStudy={readCaseStudy}
          body={body}
          title={title}
          setCurrent={setCurrent}
          data={props.data}
        />
      </div>
    );
  } else {
    return null;
  }
}