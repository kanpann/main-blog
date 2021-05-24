---
date: "2020-10-15"
title: GoDaddy를 통한 도메인 구매 및 깃허브 페이지 연동하기
category: 생각 정리
tags: [Dns]
image: https://user-images.githubusercontent.com/45007556/96098192-cd1a2900-0f0c-11eb-943f-df3646c9a897.png
---

원래 그 동안 기본 도메인인 gunkim0318.github.io를 이용해오다가 아이디를 생일이랑 이름으로 만들어놔서 별로 안 이쁘기도 하고, 마침 개발자답게 dev 도메인이 탐나기도 해서 알아보던 중 GoDaddy를 통해 구입하고 연동한 방법 등에 대해서 정리하려고 한다.

# 도메인을 구매하자

우선 깃허브 페이지에 도메인을 연동하기 위해서는 당연하게도 도메인이 일단 필요하다. 여러 도메인 호스팅 업체가 있지만 나는 여러 업체를 비교해본 결과 GoDaddy가 믿을만하다고 생각해서 여기로 결정했다.  
[GoDaddy KR](https://kr.godaddy.com/offers/domains/godaddy-b)에 들어가서 검색창에 원하는 도메인을 입력 후 구매하면 된다(예: gunlog.dev). 우선 준비물은 해외결제가 가능한 카드가 필요하다. ~~이것 때문에 부랴부랴 은행가서 비자카드 발급함~~
![image](https://user-images.githubusercontent.com/45007556/96098192-cd1a2900-0f0c-11eb-943f-df3646c9a897.png)

# 도메인 DNS 등록

GoDaddy에서 제공하는 DNS 관리자 페이지에서 해당 정보들을 등록해주면 된다.
깃허브 페이지 IP가 4개가 있는데 하나만 등록해도 된다고 하지만 안전하게 4개 전부 등록해주도록 하자.

- _TTL_ : 서버가 DNS 레코드에 대한 정보를 캐시하는 시간
- _CNAME_ : Canonical Name의 줄임말, 하나의 도메인에 다른 이름을 부여하는 방식
- _A RECORD_ : 도메인(domain) name에 IP Address를 매핑하는 방식

![image](https://user-images.githubusercontent.com/45007556/96098157-c390c100-0f0c-11eb-8c57-41d98fb4cdbe.png)

# 깃허브 페이지 커스텀 도메인 등록

이제 도메인 DNS를 등록하고 깃허브 페이지 설정 페이지를 가게 되면 Custom domain을 입력하는 곳이랑 Enforce HTTPS 체크하는 곳이 있는데 구매한 도메인 주소를 입력 후 체크해주게 되면 도메인 연동이 끝나게 된다. 만약 Enforce HTTPS가 비활성화되어 있다면 도메인 DNS가 적용되는데 시간이 조금 걸리니 기다려 보자. 기다려도 활성화가 안되면 DNS 등록이 제대로 되었는 지 확인해보는 것을 추천한다.
![image](https://user-images.githubusercontent.com/45007556/96119248-ad442e80-0f27-11eb-90c7-ab586bf4535a.png)
![image](https://user-images.githubusercontent.com/45007556/96119375-d95faf80-0f27-11eb-982a-6eb803f353e7.png)
