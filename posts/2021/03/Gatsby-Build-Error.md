---
date: '2021-03-22'
title: Gatsby.js - SSR 오류 해결
tags: [JavaScript, React, Gatsby]
category: React
image: https://user-images.githubusercontent.com/45007556/111966825-b7073900-8b3a-11eb-96dc-cf48486c6aef.png
---

이번에 Gatsby.js 블로그 소스가 어느 정도 정리가 되고, Gitalk로 댓글을 적용하려고 코드를 작성하고 `Gatsby build`를 했더니 아래와 같은 에러가 발생했다.

```bash
 ERROR #95312
cn
"window" is not available during server side rendering.

See our docs page for more info on this error: https://gatsby.dev/debug-html


  10015 |
  10016 |     _this.options = (0, _assign2.default)({}, {
> 10017 |       id: window.location.href,
        | ^
  10018 |       number: -1,
  10019 |       labels: ['Gitalk'],
  10020 |       title: window.document.title,


  WebpackError: ReferenceError: window is not defined

  - gitalk-component.js:10017
    node_modules/gitalk/dist/gitalk-component.js:10017:1
```

오류의 내용을 통해 추측해보면, window 객체를 SSR 시에 사용할 수 없다고 한다. window 객체는 그냥 사용이 가능한 것이 아니었나? 하고 해당 내용들을 검색해보았다.

# 원인

Gatsby.js로 개발할 때는 사용 가능한 브라우저를 통해 컴파일을 하지만, 빌드 중에는 서버에서 Webpack을 사용해서 컴파일이 되기 때문에 window 객체에 접근하지 못한다는 것이었다. 그래서 실제로 `Gatsby develop`은 정상적으로 실행이 되는 것을 확인할 수 있었다.

# 방법 탐색

그래서 찾아본 결과 [Gatsby.js 공식 홈페이지](https://www.gatsbyjs.com/docs/debugging-html-builds/#how-to-check-if-code-classlanguage-textwindowcode-is-defined)에서 크게 3가지 방법을 찾을 수 있었다.

1. typeof를 통해 window 객체를 감추기
2. useEffect를 통해 해당 구문 감싸기
3. `@loadable/component` 라이브러리를 사용하기

우선 첫 번째 방법은 typeof를 통해 window 객체를 검사해서 window 객체가 없을 경우 undefined를 뱉게 하는 방법이고,
두 번째 방법은 useEffect 함수는 렌더링이 완료된 이후에 실행이 되니 문제가 되는 부분을 useEffect 함수 안으로 옮겨서 해결하는 방법이다.

그런데 위에 두 가지 방법은 문제가 있었는데, 내가 작성한 코드일 경우에는 적용이 가능하지만, 문제는 외부 라이브러리 Gitalk 소스코드에 있었기 때문에 직접 수정하는 방법은 사용할 수 없었다. 그래서 찾은 방법인 3번째 `@loadable/component` 라이브러리를 사용한 방법을 소개해보려고 한다. 앞에 2가지 방법은 위에 주소에서 확인할 수 있다.

# @loadable/component 라이브러리를 사용하기

## 라이브러리 다운로드

```bash
npm i --save @loadable/component
```

## 적용 전

```js
import GitalkComponent from 'gitalk/dist/gitalk-component'
```

## 적용 후

아래와 같이 적용하게 되면 문제가 되는 라이브러리가 렌더링 후에 불러와지기 때문에 문제가 발생하지 않을 것이다. 때문에 렌더링 시 외부 라이브러리를 사용할 때 발생하는 여러 문제들을 해결할 수 있다.

```js
import loadable from '@loadable/component'
const GitalkComponent = loadable(() => import('gitalk/dist/gitalk-component'))
```
