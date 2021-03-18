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
  const classes = useStyles();
  return (
    <Grid xs={12} md={6} lg={4}>
      <Link
        className={`thumbnail ${TARGET_CLASS}`}
        to={node.fields.slug.substr(17)}
      >
        <Card className={classes.root}>
          <CardActionArea>
            <CardMedia
              className={classes.media}
              image={node.frontmatter.image}
              title={node.frontmatter.title || node.fields.slug}
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                {node.frontmatter.title || node.fields.slug}
              </Typography>
              <Typography
                variant="body2"
                color="textSecondary"
                component="div"
                dangerouslySetInnerHTML={{ __html: node.excerpt }}
              ></Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Link>
    </Grid>
  );
};
