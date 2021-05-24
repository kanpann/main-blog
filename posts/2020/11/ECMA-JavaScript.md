---
date: "2020-11-21"
title: ECMAScript? ES? 그게 뭘까?
category: JavaScript
tags: [JavaScript]
image: https://user-images.githubusercontent.com/45007556/99826279-7c48c080-2b9b-11eb-8cce-3c92f971c803.png
---

자바스크립트를 사용하면서 es5, es6 문법들을 사용하면서 대충 자바스크립트 버전 아니야? 라고 생각하고 사용했었는데, 어떻게 보면 맞다고 할 수도 있는데 어떻게 보면 아니라고 할 수 있다. 문득 궁금해져서 간략하게 나마 정리하려고 한다.

# ES(ECMAScript)가 뭐야?

**ES? 자바스크립트 버전 아니었어? 뜬금없이 ECMAScript가 뭐야?** 생각이 들 수도 있다.
![image](https://user-images.githubusercontent.com/45007556/99825837-e7de5e00-2b9a-11eb-86cd-3fb684123ec0.png)

ECMAScript는 쉽게 말하면 ECMA라는 비영리 단체가 자기네들이 만든 ECMA-262라는 기술 규격에 따라서 정의한 표준화된 스크립트 언어다. ES5, ES6 등은 ECMAScript의 버전5, 버전6 같은 개념으로 받아들이면 된다.

# 그럼 JS(JavaScript)랑은 뭐가 달라?

![image](https://user-images.githubusercontent.com/45007556/99826279-7c48c080-2b9b-11eb-8cce-3c92f971c803.png)
ECMAScript와 JavaScript는 완전 다른 것은 아니고, JavaScript의 표준화를 위해 만들어진 게 ECMAScript이고, JavaScript는 ECMAScript의 사양을 표준으로 따르는 언어다.

# ES버전별로 뭐가 달라?

가장 대표적인 ES5, ES6 위주로 대략적인 것만 정리해 보려고 한다.

- **ES3**
  - 흔히 말하는 자바스크립트
- **ES5**
  - 배열에 **forEach, map, filter, reduce, some**과 같은 메소드 지원
  - Object에 **getter, setter** 지원
  - JSON 지원
- **ES6(ES 2015)**
  - **let, const** 키워드 추가 - 변수를 선언할 때 함수 스코프를 가진 var키워드를 대체하기 위해 여타 언어와 똑같이 **블럭 스코프**를 가진 **let, const** 키워드 추가
  - arrow 문법 지원 - 편하고 간결하고 this 바인딩을 하지 않는 화살표 문법 추가
  - **iterator, generator** 추가
  - module **import, export** 키워드 추가 - 모듈을 임포트 받거나, 모듈을 내보낼 수 있도록 **import, export** 키워드 추가
  - **Promise** 추가-그 동안 콜백지옥에서 고통받던 개발자들을 위해 **비동기 처리하는 객체** 추가
- **ES8(ECMA 2017)**
  - **async - await** 도입 - Promise와 같이 비동기 처리를 위한 키워드로, **Promise보다 간결하고 직관적**이다.
- **ES7(ES2016)**
- **ES8(ES2017)**
- **ES9(ES2018)**
- **ES10(2019)**

# 브라우저마다 지원하는 ECMAScript가 다르다?

![image](https://user-images.githubusercontent.com/45007556/99863269-b6888100-2be0-11eb-94d4-1613cf98b5eb.png)

처음에는 ES를 단순 버전 정도로 생각해서 ES가 없데이트 되면 자동으로 모든 브라우저에서 새로 추가된 ES문법들을 지원할거라고 생각했다.
그런데 이는 브라우저마다 다른데, 왜냐하면 브라우저 회사마다 각각의 자바스크립트 엔진이 있어서 그렇다.
그래서 만약 ES6 문법으로 개발하면 익스플로러 같은 경우 es6를 지원하지 않아서 익스플로러에서는 제대로 작동하지 않을 수 있다.
~~이래서 자바에서는 JVM을 만들었나 보다~~

## 자바스크립트 엔진들

- **Rhino** - 모질라
- **SpiderMonkey** - 파이어폭스
- **V8** - 구글, 오페라
- **JavascriptCore** - 사파리
- **Chakra** - 익스플로러, 마이크로소프트 엣지

# 호환성 문제의 해결

es6를 지원하지 않으면 es6 이하 버전 문법들만을 사용해서 개발하는 방법도 방법이다. 하지만 그러기에는 너무 생산성이 좋지 않다.

## 바벨(Babel)을 이용한 방법

![1_DGJT51DxMSbsRNuF6J_c6Q](https://user-images.githubusercontent.com/45007556/99864982-e5572500-2be9-11eb-8d57-06e5cccaae37.jpeg)

그래서 이를 해결하기 위해 나온 방법이 컴파일러 및 트랜스파일러의 역할을 하는 바벨(Babel)을 이용해서 es6로 작성된 코드를 es5로 변환해서 배포하는 방법이다.
