import React, { ReactChild, useContext, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.min.css";
import "swiper/swiper.min.css";
import { updatedSelectedItem } from "../App";
import {
  AccordionContent,
  AccordionType,
} from "./Accordion/schema/AccordionSchemaType";
import { Card, fixCardsHeight } from "./SidebarxModal/DetailCard";
import SidebarxModalProvider from "./SidebarxModal/SidebarxModalProvider";

interface CarouselProps {
  data?: AccordionType[] | undefined;
}

export default function Carousel(props: CarouselProps) {
  const { data } = props;
  const swiperRef = useRef<any>();
  const context = useContext(SidebarxModalProvider);

  const onClose = () => {
    context?.setCurrent(undefined);
    setTimeout(() => {
      document.querySelectorAll(".item.selected").forEach((el) => {
        el.classList.remove("selected");
      });
      updatedSelectedItem();
    }, 0);
  };

  const getCardContents = function (): AccordionContent[] | [] {
    if (data) {
      const cardData = [] as AccordionContent[];
      data.forEach((section) =>
        section.content.forEach((content) =>
          content.sections?.forEach((section) => {
            cardData.push(section.content);
          })
        )
      );
      return cardData;
    }
    return [];
  };

  const updateArrows = () => {
    const cardData = getCardContents();

    if (cardData) {
      const leftArrow = document.querySelector(".arrow-left") as HTMLElement;
      const rightArrow = document.querySelector(".arrow-right") as HTMLElement;
      if (leftArrow && swiperRef.current.activeIndex === 0) {
        leftArrow.style.opacity = "0";
      } else {
        leftArrow.style.opacity = "1";
      }
      if (rightArrow && swiperRef.current.activeIndex === cardData.length - 1) {
        rightArrow.style.opacity = "0";
      } else {
        rightArrow.style.opacity = "1";
      }
    }
  };

  const Cards = function (): ReactChild[] {
    if (data) {
      const cardData = getCardContents();

      return cardData.map((content) => {
        const {
          title,
          body = "",
          variant = "simple",
          urls: { sources = [], readCaseStudy = null } = {},
        } = content;

        const readMore = sources
          .find((q) => q.toLowerCase().indexOf("read more") >= 0)
          ?.replace("Read more:", "");
        return (
          <SwiperSlide
            key={title}
            onClick={(e) => {
              if (e.currentTarget === e.target) {
                onClose();
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
              setCurrent={() => {}}
              data={content}
              onClose={onClose}
            />
          </SwiperSlide>
        );
      });
    } else return new Array(2).map(() => <React.Fragment></React.Fragment>);
  };

  useEffect(() => {
    if (context?.current && props.data && swiperRef.current) {
      const cardData = [] as AccordionContent[];
      props.data.forEach((section) =>
        section.content.forEach((content) =>
          content.sections?.forEach((section) => {
            cardData.push(section.content);
          })
        )
      );
      const index = cardData.findIndex(
        (q) => q.title === context?.current?.title
      );
      swiperRef.current.slideTo(index);
    }
  }, [context, props.data, swiperRef]);

  useEffect(() => {
    if (context?.setCurrent) {
      context.setCurrent(undefined);
    }
    window.addEventListener("resize", fixCardsHeight, false);

    return () => {
      window.removeEventListener("resize", fixCardsHeight, false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return context?.current ? (
    <div className="card-carousel">
      {data?.length && (
        <Swiper
          onSlideChange={() => {
            fixCardsHeight();
            updateArrows();
          }}
          centeredSlides={true}
          slidesPerView={"auto"}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
            updateArrows();
          }}
        >
          <span
            className="arrow-left"
            onClick={() => {
              swiperRef.current.slidePrev();
            }}
          ></span>
          <span
            className="arrow-right"
            onClick={() => {
              swiperRef.current.slideNext();
            }}
          ></span>
          {Cards()}
        </Swiper>
      )}
    </div>
  ) : null;
}