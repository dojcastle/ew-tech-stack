import { useContext, useEffect } from "react";
import { updatedSelectedItem } from "../../App";
import { AccordionContent } from "../Accordion/schema/AccordionSchemaType";
import SidebarxModalProvider from "./SidebarxModalProvider";

interface DetailCardProps {
  data: AccordionContent | undefined;
}

export const fixCardsHeight = () => {
  document.querySelectorAll(".detail-card").forEach((card) => {
    const c = card as HTMLElement;
    const winHeight = window.innerHeight;
    const hHeight = c.querySelector("h1")?.clientHeight || 0;
    const fHeight = c.querySelector(".urls")?.clientHeight || 0;
    const body = c.querySelector(".body") as HTMLElement;
    if (window.getComputedStyle(body)["maxHeight"] === "none")
      body.style.maxHeight = body.clientHeight + "px";

    if (c.clientHeight > winHeight || body.scrollHeight > body.clientHeight) {
      if (body) {
        let newHeight = winHeight - hHeight - fHeight - 100;
        if (newHeight < 200) {
          newHeight = 200;
        }
        body.style.height = newHeight + "px";
        if (c.clientHeight > winHeight) {
          c.style.alignSelf = "flex-start";
          c.style.margin = "10px auto";
          if (c.parentElement) c.parentElement.style.overflow = "auto";
        } else {
          c.style.alignSelf = "center";
          c.style.margin = "0 auto";
          if (c.parentElement) c.parentElement.style.overflow = "initial";
        }
      }
    } else {
      c.style.alignSelf = "center";
      c.style.margin = "0 auto";
      if (c.parentElement) c.parentElement.style.overflow = "initial";
    }
  });
};

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
  useEffect(() => {
    fixCardsHeight();
  }, []);

  return (
    <div
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
