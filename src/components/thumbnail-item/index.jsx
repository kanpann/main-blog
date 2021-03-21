import React from "react";
import { Link } from "gatsby";
import { TARGET_CLASS } from "../../utils/visible";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import "./index.scss";

const useStyles = makeStyles((theme) => ({
  root: {
    maxHeight: 420,
    display: "block",
    margin: "12px",
    padding: "4px",
    paddingBottom: "12px",
  },
  media: {
    height: 140,
  },
}));

export const ThumbnailItem = ({ node }) => {
  const oriTtitle = node.frontmatter.title;
  const printTitleLength = 25;
  const prtTitle =
    oriTtitle.length <= printTitleLength
      ? oriTtitle
      : oriTtitle.substr(0, printTitleLength) + "...";

  const classes = useStyles();
  return (
    <Grid xs={12} md={6} lg={4}>
      <Link
        className={`thumbnail ${TARGET_CLASS}`}
        to={node.fields.slug.substr(17)}
      >
        <div className="thum-frame">
          <div
            className="thum-img"
            style={{ backgroundImage: `url(${node.frontmatter.image})` }}
          />
          <h2>{prtTitle || node.fields.slug}</h2>
          <p dangerouslySetInnerHTML={{ __html: node.excerpt }}></p>
        </div>
      </Link>
    </Grid>
  );
};
