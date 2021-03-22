import React from "react";
import { Link } from "gatsby";

import "./index.scss";

export const PostNavigator = ({ pageContext }) => {
  const { previous, next } = pageContext;

  return (
    <ul className="navigator">
      <li>
        {previous && (
          <Link to={"/" + previous.fields.slug.substr(17)} rel="prev">
            ← {previous.frontmatter.title}
          </Link>
        )}
      </li>
      <li>
        {next && (
          <Link to={"/" + next.fields.slug.substr(17)} rel="next">
            {next.frontmatter.title} →
          </Link>
        )}
      </li>
    </ul>
  );
};
