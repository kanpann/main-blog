---
date: "2020-09-01"
title: OAuth2 연동을 위한 카카오, 구글, 페이스북, 네이버, 깃허브 클라이언트 ID 및 암호키 발급 방법 정리
category: Spring
tags: [Spring Boot]
image: https://user-images.githubusercontent.com/45007556/91691565-cde83d00-eba2-11ea-9170-3f80328dcc36.png
---

우리나라에서 가장 대표적인 플랫폼인 카카오, 구글, 페이스북, 네이버 외 깃허브에 대한 클라이언트 ID, 암호키 발급 방법을 정리해보려고 한다.

# 카카오

[카카오 개발자 페이지](https://developers.kakao.com/)로 이동

## 1. 애플리케이션 추가

내 앱>애플리케이션 추가에 해당 화면에서 앱 이름, 회사 이름을 간단히 입력하여 저장
![image](https://user-images.githubusercontent.com/45007556/91691565-cde83d00-eba2-11ea-9170-3f80328dcc36.png)

## 2. 플랫폼 등록

플랫폼 카테고리>웹 플랫폼 등록에서 사이트 도메인 입력 후 저장
![image](https://user-images.githubusercontent.com/45007556/91691948-844c2200-eba3-11ea-9bfa-ecb2c59f3665.png)

## 3. 카카오 로그인 활성화

카카오 로그인 카테고리 이동 후 카카오 로그인 활성화 버튼 클릭
![image](https://user-images.githubusercontent.com/45007556/91691696-08ea7080-eba3-11ea-8ed3-1af0c854d91b.png)

## 4. 카카오 로그인 리다이렉션 설정

![image](https://user-images.githubusercontent.com/45007556/91799695-8de88f00-ec62-11ea-842f-944057eaa882.png)

## 5. OAuth 인증 정보 확인

앱 설정>요약 정보에서 REST API키가 클라이언트 ID이다.
![image](https://user-images.githubusercontent.com/45007556/91869283-aa131d00-ecb0-11ea-8092-967af0095ccf.png)

제품 설정>카카오 로그인>보안에서 암호키를 확인할 수 있다.
![image](https://user-images.githubusercontent.com/45007556/91869211-8fd93f00-ecb0-11ea-8e44-db923bf62bb0.png)

# 구글

[구글 API 페이지](https://console.developers.google.com/projectcreate?previousPage=%2Fprojectselector2%2Fapis%2Fdashboard%3ForganizationId%3D0%26supportedpurview%3Dproject&project=&folder=&organizationId=0&supportedpurview=project)로 이동

## 1. 새 프로젝트 생성

프로젝트 이름을 입력 후 만들기 클릭
![image](https://user-images.githubusercontent.com/45007556/91689928-063a4c00-eba0-11ea-9d5c-05e881758380.png)

## 2. 동의화면 만들기

![image](https://user-images.githubusercontent.com/45007556/91690260-9a0c1800-eba0-11ea-94e5-47b18a39c60f.png)

## 3. 동의화면 작성

애플리케이션 이름, 지원 이메일을 작성 후 최하단 작성 버튼 클릭
![image](https://user-images.githubusercontent.com/45007556/91688638-67145500-eb9d-11ea-9351-92820ffa95bc.png)

## 4. 클라이언트 ID 생성으로 이동

사용자 인증 정보 만들기>OAuth 클라이언트 ID 선택
![image](https://user-images.githubusercontent.com/45007556/91690365-c758c600-eba0-11ea-9290-ede988df72fe.png)

## 5. 클라이언트 ID 생성

유형을 웹 애플리케이션 선택 후 자유롭게 이름을 입력해주고, 승인된 자바스크립트 출처 입력.

![image](https://user-images.githubusercontent.com/45007556/91869032-5b658300-ecb0-11ea-8375-200107e22a08.png)

## 6. OAuth 인증 정보 확인

OAuth2 인증을 위한 클라이언트 ID, 보안 비밀번호 확인
![image](https://user-images.githubusercontent.com/45007556/91690967-ca07eb00-eba1-11ea-9adf-f7cb1ad46be9.png)

# 페이스북

[페이스북 개발자 페이지](https://developers.facebook.com/?no_redirect=1)로 이동

## 1. 앱 생성

내 앱 > 새 앱 추가에서 기타를 선택
![image](https://user-images.githubusercontent.com/45007556/91686286-d38c5580-eb97-11ea-8900-eaa6ecce9d1f.png)

앱 이름, 연락처 작성 후 앱 ID 만들기 버튼 클릭
![image](https://user-images.githubusercontent.com/45007556/91686344-fcace600-eb97-11ea-9d73-ff2c5e66b4c8.png)

## 2. Facebook 로그인 설정

사이드바 제품 카테고리에서 Facebook 로그인 설정을 선택.

페이스북에서는 개발 중 localhost에 대한 리디렉션을 기본으로 지원하니 유효한 OAuth 리디렉션 URI는 설정 안해주어도 됨
![image](https://user-images.githubusercontent.com/45007556/91687321-6a5a1180-eb9a-11ea-8879-9b7611ab19cd.png)

## 3. OAuth 인증 정보 확인

OAuth2 인증을 위한 앱 ID, 앱 시크릿 코드(보기 클릭)를 확인
![image](https://user-images.githubusercontent.com/45007556/91869378-c6af5500-ecb0-11ea-82d7-f4a03330e0f4.png)

# 네이버

[네이버 개발자 페이지](https://developers.naver.com/apps/#/list)로 이동

## 1. Application 등록

내 앱>Application 등록 이동 시 해당 화면으로 이동하여 앱 이름을 입력해주고, 사용 API는 네아로(네이버 아이디로 로그인) 선택 후
서비스 URL 및 Callback URL 작성 후 등록하기 버튼 클릭
![image](https://user-images.githubusercontent.com/45007556/91824267-7666d180-ec75-11ea-97b7-a991b80f9c27.png)

## 2. OAuth 인증 정보 확인

![image](https://user-images.githubusercontent.com/45007556/91693248-b3fc2980-eba5-11ea-91c0-a9d2ea0e72e5.png)

# 깃허브

[깃허브 설정 페이지](https://github.com/settings/developers)로 이동

## 1. 애플리케이션 생성

OAuth Apps>Register a new application을 클릭
![image](https://user-images.githubusercontent.com/45007556/91824849-63a0cc80-ec76-11ea-90e8-016eb786547e.png)

필요 정보를 입력 후 생성
![image](https://user-images.githubusercontent.com/45007556/91825106-c2664600-ec76-11ea-9354-517e8a6fde71.png)

## 2. OAuth 인증 정보 확인

![image](https://user-images.githubusercontent.com/45007556/91825349-1a9d4800-ec77-11ea-9a60-6ad638120210.png)

# 끝

이렇게 카카오, 구글, 페이스북, 네이버, 깃허브의 앱ID(클라이언트ID), 암호키(SECRETKEY)가 준비되었다.
이제 이 정보들을 가지고 코드를 구현해보려고 한다.
