"use client";

import React from "react";
import { usePostEditorContext } from "@/context/PostEditorContext";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import DraggableCaption from "./DraggableCaption";
import "swiper/css";
import "swiper/css/pagination";

export const CaptionSwiper = () => {
  const { captionSuggestions } = usePostEditorContext();
  return (
    <Swiper
      modules={[Pagination]}
      spaceBetween={10}
      slidesPerView={1.4}
      centeredSlides={true}
      grabCursor={false}
      simulateTouch={false}
      pagination={{ clickable: true }}
      className="h-full"
    >
      {captionSuggestions.map((caption, index) => (
        <SwiperSlide
          key={`caption-${index}`}
          className="w-auto flex item-stretch h-full pb-10"
        >
          <DraggableCaption
            id={`caption-${index}`}
            text={caption}
            index={index}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};
