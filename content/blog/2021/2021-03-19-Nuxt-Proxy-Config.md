---
date: "2021-03-19"
title: Nuxt.js Proxy 설정하기
tags: [JavaScript, Vue, Nuxt]
category: Vue
image: https://user-images.githubusercontent.com/45007556/111740934-f6c6ea00-88c8-11eb-8a49-c1f112655c81.png
draft: false
---

Vue 공부를 하기 위해서 Nuxt.js로 화면을 만들고, 평소와 같이 Spring으로 만든 API 서버와 프록시 설정을 하려고 하다가 삽질해서 해결한 내용에 대해서 작성하려고 한다.

# nuxt.config.js

```js
export default {
  //...
  axios: {
    proxy: true, //default - "false",
  },
  proxy: {
    "/api/": "http://localhost:8080",
  },
};
```

이제 이렇게 설정해주면 "/api/"로 시작하는 URL은 모두 프록시 연결이 된다.

## 하위 URL을 제외하고 싶은 경우

```js
proxy: {
  '/api/': { target: 'http://api.example.com', pathRewrite: {'^/api/': ''} }
}
```

# 참고

[https://axios.nuxtjs.org/options/](https://axios.nuxtjs.org/options/)
