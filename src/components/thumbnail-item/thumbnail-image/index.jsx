import React from "react";
import "./index.scss";

export const ThumbnailImage = ({ image, height = 140, radius = false }) => {
  const inHeight = `${height}px`;
  const radiusStyle = radius
    ? {
        borderRadius: "10px",
        boxShadow: "0px 0px 10px -5px",
      }
    : {};
  return (
    <div
      className="thum-img"
      style={{
        ...radiusStyle,
        backgroundImage: `url(${image})`,
        height: inHeight,
      }}
    />
  );
};
