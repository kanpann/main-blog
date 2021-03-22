import React from "react";
import loadable from "@loadable/component";
// import GitalkComponent from "gitalk/dist/gitalk-component";
const GitalkComponent = loadable(() => import("gitalk/dist/gitalk-component"));

export const Gitalk = () => {
  return (
    <GitalkComponent
      options={{
        clientID: "950a9f1473b04652cbc0",
        clientSecret: "6b42fe4d369ba3a4918c0b629b35115111fb33ac",
        repo: "blog-gitalk",
        owner: "kanpann",
        admin: ["kanpann"],
      }}
    />
  );
};
