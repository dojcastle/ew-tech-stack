import React, { ReactChild, useContext, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.min.css";
import "swiper/swiper.min.css";
import { updatedSelectedItem } from "../App";
import {
  AccordionContent,
  AccordionType,
} from "./Accordion/schema/AccordionSchemaType";
import { Card } from "./SidebarxModal/DetailCard";
import SidebarxModalProvider from "./SidebarxModal/SidebarxModalProvider";

interface CarouselProps {
  data?: AccordionType[] | undefined;
}

export default function Carousel(props: CarouselProps) {
  const { data } = props;
  const swiperRef = useRef<any>();
  const context = useContext(SidebarxModalProvider);

  const Cards = function (): ReactChild[] {
    if (data) {
      const cardData = [] as AccordionContent[];
      data.forEach((section) =>
        section.content.forEach((content) =>
          content.sections?.forEach((section) => {
            cardData.push(section.content);
          })
        )
      );
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
          <SwiperSlide key={title}>
            <Card
              sources={sources}
              variant={variant}
              readMore={readMore}
              readCaseStudy={readCaseStudy}
              body={body}
              title={title}
              setCurrent={() => {}}
              data={content}
              onClose={() => {
                context?.setCurrent(undefined);
                setTimeout(() => {
                  document.querySelectorAll(".item.selected").forEach((el) => {
                    el.classList.remove("selected");
                  });
                  updatedSelectedItem();
                }, 0);
              }}
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return context?.current ? (
    <div className="card-carousel">
      {data?.length && (
        <Swiper
          centeredSlides={true}
          slidesPerView={"auto"}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
        >
          {Cards()}
        </Swiper>
      )}
    </div>
  ) : null;
}