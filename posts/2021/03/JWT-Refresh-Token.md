---
date: '2021-03-25'
title: JWT Refresh Token을 정말 사용해야 할까?
category: '생각 정리'
image: https://user-images.githubusercontent.com/45007556/112591329-8deeed00-8e47-11eb-86e7-6db7ee66de0a.png
tags: [Think]
---

세션 로그인 같은 경우 매번 요청이 있을 때마다 세션 시간이 자동 갱신이 되기 때문에 필요가 없지만, JWT 같은 경우 토큰의 유효기간이 이미 발급과 동시에 정해지게 된다. 그래서 만약 JWT 토큰을 연장하기 위한 방법은 다시 재발급을 하는 방법밖에 없는데, 그렇게 되면 기존에 방식대로면 사용자가 직접 로그인을 한 번 더 해주어야 한다. 사이트를 이용하다 30분마다 로그인을 다시 해야 한다니 조금 번거롭지 않은가?

# Access Token, Refresh Token

JWT 진영에서 이 문제를 해결하기 위한 방법이 토큰 2개를 발급한다. 하나는 유효기간이 짧은 `Access Token(보통 30분)`, 다른 하나는 유효기간이 긴 `Refresh Token(보통 2주)`을 발급하는 것이다. 그래서 인증을 할 때 클라이언트는 서버에 요청을 할 때마다 `Access Token`을 서버로 보내면서 사용하다가 어느새 `Access Token`이 만료가 되어 서버로부터 `401 Unauthorized`에러를 받게 되면 `Refresh Token`을 서버로 보내 다시 `Access Token`을 발급받는다. 이 과정은 아래에 이미지를 보면 이해가 빠르다. [이미지 출처](http://blog.logicwind.com/jwt-refresh-token-implementation-in-node-js/)
![image](https://user-images.githubusercontent.com/45007556/112577366-8889a680-8e37-11eb-873c-14545bb84cfa.png)

# 왜?

궁금증이 많은 나는 "`Refresh Token`을 탈취해서 똑같이 `Access Token`을 발급해서 악용할 수 있는데 결국 `Access Token` 유효기간을 길게 잡는 것과 뭐가 달라?"라는 생각이 들었다.

# Refresh Token을 적용할 경우에 이점

내 궁금증을 해결해 줄 수 있는 답을 찾기 위해 [참고1](https://stackoverflow.com/questions/3487991/why-does-oauth-v2-have-both-access-and-refresh-tokens), [참고2](https://stackoverflow.com/questions/10703532/whats-the-point-of-refresh-token), [참고3](https://stackoverflow.com/questions/53324540/why-use-jwt-refresh-token) 스택오버플로에서 나와 비슷한 고민을 한 사람들이 남긴 질문에 달린 답변들을 살펴보았다. 여러 질문들을 살펴본 결과 가장 납득이 가는 답변을 정리해보겠다.

# 서버의 방어수단

서버 입장에서 한번 살펴보자면 JWT는 Session을 사용하지 않는 Session-less 방식이다. 그렇다면 `Access Token`의 유효기간을 길게 설정한다면 이 토큰이 해커에게 탈취되어 부정하게 사용되어도 서버 입장에서는 이 사용자를 차단할 방법이 없다. 서버 쪽에서는 결국 정상적으로 발급된 토큰이기 때문에 `Access Token`이 만료될 때까지 그저 손가락 빨고 기다리는 수밖에 없다.

그에 비해 `Refresh Token`을 사용하게 되면 `Access Token`이 탈취되더라도 유효기간이 30분이라고 하면 30분 동안의 해킹 시도는 유효기간을 길게 설정한 경우에 비해 적을 것이다. 게다가 `Refresh Token`까지 탈취된다고 해도 `Refresh Token`을 무효화시켜서 `Access Token`을 발급하지 못하게 할 수 있다.
결국 `Refresh Token`을 사용하는 이유는 서버 입장에서 하나의 방어수단이라고 할 수 있다.

# 정리

정리하자면 로그인 유지를 위해서 `Access Token`의 유효기간을 길게 설정하자니 탈취될 경우 서버 입장에선 무력화 수단이 없기 때문에 `Refresh Token`을 두는 수고를 들이더라도 사용해야 하는 메리트는 있다.라고 볼 수 있을 것 같다. 참고로 비슷한 인증 방식인 OAuth2 제공자 중에서 github, foursquare는 `Refresh Token`을 사용하지 않는다고 한다. 아무래도 필수는 아니니 선택의 문제인 것 같다.
