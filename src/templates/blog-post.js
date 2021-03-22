import React, { useEffect } from "react";
import { graphql } from "gatsby";

import * as Elements from "../components/elements";
import { Layout } from "../layout";
import {
  Head,
  PostTitle,
  PostDate,
  PostContainer,
  SocialShare,
  Bio,
  PostNavigator,
  Disqus,
  Utterances,
  Gitalk,
} from "../components";
import * as ScrollManager from "../utils/scroll";
import { makeStyles } from "@material-ui/core/styles";

import "../styles/code.scss";
import "katex/dist/katex.min.css";

const useStyles = makeStyles({
  pt: {
    paddingTop: "80px",
  },
});

export default ({ data, pageContext, location }) => {
  // const isDarkTheme = Dom.hasClassOfBody(THEME.DARK);

  // console.log(isDarkTheme);
  const classes = useStyles();
  useEffect(() => {
    ScrollManager.init();
    return () => ScrollManager.destroy();
  }, []);

  const post = data.markdownRemark;
  const metaData = data.site.siteMetadata;
  const { title, comment, siteUrl, author } = metaData;
  const { disqusShortName, utterances } = comment;
  const { title: postTitle, date } = post.frontmatter;

  return (
    <div className={classes.pt}>
      <Layout location={location} title={title}>
        <Head title={postTitle} description={post.excerpt} />
        <PostTitle title={postTitle} />
        <PostDate date={date} />
        <PostContainer html={post.html} />
        <SocialShare title={postTitle} author={author} />
        <Elements.Hr />
        <Bio />
        <PostNavigator pageContext={pageContext} />
        <Gitalk />
        {/* {!!disqusShortName && (
          <Disqus
            post={post}
            shortName={disqusShortName}
            siteUrl={siteUrl}
            slug={pageContext.slug}
          />
        )}
        {!!utterances && <Utterances repo={utterances} />} */}
      </Layout>
    </div>
  );
};

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        author
        siteUrl
        comment {
          disqusShortName
          utterances
        }
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 280)
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
      }
    }
  }
`;
