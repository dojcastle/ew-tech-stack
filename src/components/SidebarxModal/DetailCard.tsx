import { useContext } from "react";
import SidebarxModalProvider from "./SidebarxModalProvider";

export default function DetailCard() {
  const context = useContext(SidebarxModalProvider);
  if (!context) return null;
  if (context?.current) {
    const {
      current: {
        title,
        body,
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
          <h1>{title}</h1>
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