import React, { useMemo } from "react";
import * as EventManager from "../utils/event-manager";
import { graphql } from "gatsby";
import * as Dom from "../utils/dom";
import _ from "lodash";
import { Layout } from "../layout";
import { Bio, Category, Contents, Head } from "../components";
import {
  useCategory,
  useIntersectionObserver,
  useRenderedCount,
  useScrollEvent,
} from "../hooks";
import { HOME_TITLE } from "../constants";

const BASE_LINE = 80;

function getDistance(currentPos) {
  return Dom.getDocumentHeight() - currentPos;
}

export default ({ data, location }) => {
  const { siteMetadata } = data.site;
  const { countOfInitialPost } = siteMetadata.configs;
  const posts = data.allMarkdownRemark.edges;
  const categories = useMemo(
    () => _.uniq(posts.map(({ node }) => node.frontmatter.category)),
    []
  );
  const [count, countRef, increaseCount] = useRenderedCount();
  const [category, selectCategory] = useCategory();

  useIntersectionObserver();
  useScrollEvent(() => {
    const currentPos = window.scrollY + window.innerHeight;
    const isTriggerPos = () => getDistance(currentPos) < BASE_LINE;
    const doesNeedMore = () =>
      posts.length > countRef.current * countOfInitialPost;

    return EventManager.toFit(increaseCount, {
      dismissCondition: () => !isTriggerPos(),
      triggerCondition: () => isTriggerPos() && doesNeedMore(),
    })();
  });

  return (
    <Layout location={location} title={siteMetadata.title}>
      <Head title={HOME_TITLE} keywords={siteMetadata.keywords} />
      <Bio />
      <Category
        categories={categories}
        category={category}
        selectCategory={selectCategory}
      />
      <Contents
        posts={posts}
        countOfInitialPost={countOfInitialPost}
        count={count}
        category={category}
      />
    </Layout>
  );
};

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
        configs {
          countOfInitialPost
        }
      }
    }
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { category: { ne: null }, draft: { eq: false } } }
    ) {
      edges {
        node {
          excerpt(pruneLength: 200, truncate: true)
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
            category
            draft
            image
          }
        }
      }
    }
  }
`;
