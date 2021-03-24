import React from "react";
import { Link } from "gatsby";
import { TARGET_CLASS } from "../../utils/visible";
import Grid from "@material-ui/core/Grid";
import "./index.scss";
import { ThumbnailImage } from "./thumbnail-image";

function substrToByte(targetStr, maxByte) {
  let buffer = 0;
  let idx = 0;
  while (true) {
    const unicode = targetStr.charCodeAt(idx);
    buffer += unicode > 127 ? 2 : 1;

    if (buffer > maxByte) break;
    idx++;
  }
  let result = targetStr.substring(0, idx);
  if (idx < targetStr.length) {
    result += "...";
  }
  return result;
}

export const ThumbnailItem = ({ node }) => {
  const title = substrToByte(node.frontmatter.title, 40);

  return (
    <Grid xs={12} md={6} lg={4}>
      <Link
        className={`thumbnail ${TARGET_CLASS}`}
        to={node.fields.slug.substr(17)}
      >
        <div className="thum-frame">
          <ThumbnailImage image={node.frontmatter.image} />
          <h2>{title || node.fields.slug}</h2>
          <p dangerouslySetInnerHTML={{ __html: node.excerpt }}></p>
        </div>
      </Link>
    </Grid>
  );
};
