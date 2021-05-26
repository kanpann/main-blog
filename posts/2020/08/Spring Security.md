---
date: '2020-08-06'
title: 스프링 시큐리티 정리
category: Spring
tag: [Spring Boot, Spring Security]
image: https://user-images.githubusercontent.com/45007556/91024296-b6550580-e632-11ea-874f-8618094b21e5.png
---

그 동안 스프링 시큐리티를 잘 알지 못하고 사용했었는데, 스프링 시큐리티에 대한 이해도를 높일 겸 정리해보려고 한다.

# 스프링 시큐리티(Spring Security)란?

![image](https://user-images.githubusercontent.com/45007556/91024296-b6550580-e632-11ea-874f-8618094b21e5.png)
스프링 기반의 어플리케이션의 보안(인증과 권한, 인가 등)을 담당하는 스프링 하위 프레임워크이다.

# 용어 정리

- **접근 주체(Principal)**: 보호된 리소스에 접근하는 대상
- **인증(Authentication)**: 보호된 리소스에 접근한 대상에 대해 이 유저가 누구인지, 애플리케이션의 작업을 수행해도 되는 주체인지 확인하는 과정
- **인가(Authorize)**: 해당 리소스에 대해 접근 가능한 권한을 가지고 있는지 확인하는 과정
- **권한**: 인가 과정에서 해당 리소스에 대한 제한된 최소한의 권한을 가졌는지 확인한다.

# 주요 특징

스프링 시큐리티 [레퍼런스 문서](https://docs.spring.io/spring-security/site/docs/5.4.0-RC1/reference/html5/#features)에 나와 있는 특징 중 중요해보이는 것만 정리해보았음.

## 입증

Spring Security는 인증에 대한 포괄적인 지원을 제공한다.
사용자를 인증하는 일반적인 방법은 사용자에게 사용자 이름과 비밀번호를 입력하는 Credential방식을 사용한다.

## 비밀번호 저장

PasswordEncoder 인터페이스를 통해 패스워드 암호화를 지원함.
PasswordEncoder 인터페이스는 안전하게 저장하기 위해 패스워드의 단방향 변환 방식을 사용함.
추후에 로그인 시 비밀번호를 비교해야 할 때 암호화했던 비밀번호를 복호화 후 비교하는 것이 아닌 일치하는 지 여부만 알려주는 방식을 사용.

## CSRF 공격 보호 지원

### CSRF 공격이란?

만약 이런 간단한 form에 보낼 금액, 받는 사람 계좌번호, 아이디를 입력하면 입금할 수 있는 은행 프로그램이 있을 때 요청 시 정상적으로 처리가 될 것이다.

```html
<form method="post" action="/transfer">
  <input type="text" name="amount" />
  <input type="text" name="routingNumber" />
  <input type="text" name="account" />
  <input type="submit" value="Transfer" />
</form>
```

```
POST /transfer HTTP/1.1
Host: bank.example.com
Cookie: JSESSIONID=randomid
Content-Type: application/x-www-form-urlencoded

amount=100.00&routingNumber=1234&account=9876
```

그런데 만약 아래와 같이 해커가 다른 사이트에 똑같은 형식으로 요청하는 스크립트를 작성해서 다른 사람이 버튼 클릭 시 자기 계좌에 입금하도록 한다면? 게다가 이게 자동화가 되어 버튼을 누를 필요도 없다면? 큰 문제가 생길 것이다.

일단 서버에서는 해당 요청에 문제가 없고, 올바른 요청인지 아닌지 알 수 없기 때문에 정상적으로 처리가 될 것이다.

```html
<form method="post" action="https://bank.example.com/transfer">
  <input type="hidden" name="amount" value="100.00" />
  <input type="hidden" name="routingNumber" value="evilsRoutingNumber" />
  <input type="hidden" name="account" value="evilsAccountNumber" />
  <input type="submit" value="Win Money!" />
</form>
```

### 스프링 시큐리티에서는 어떻게 해결했는지?

same-origin, 동기화 토큰 패턴 등 여러 방법이 있지만 스프링 시큐리티에서는 동기화 토큰 패턴을 사용한다. 아래처럼 서버에서 발급한 csrf토큰을 form에 삽입하여 요청 시 매개변수에 포함되도록 한다. 그래서 서버에서는 발급한 csrf토큰과 이 토큰값을 비교하여 다를 경우 요청이 실패되도록 한다.

```html
<form method="post" action="/transfer">
  <input type="hidden" name="_csrf" value="4bfd1575-3ad1-4d21-96c7-4ef2d9f86721" />
  <input type="text" name="amount" />
  <input type="text" name="routingNumber" />
  <input type="hidden" name="account" />
  <input type="submit" value="Transfer" />
</form>
```

```
POST /transfer HTTP/1.1
Host: bank.example.com
Cookie: JSESSIONID=randomid
Content-Type: application/x-www-form-urlencoded

amount=100.00&routingNumber=1234&account=9876&\_csrf=4bfd1575-3ad1-4d21-96c7-4ef2d9f86721
```

# 주요 객체

- **Authentication** - 요청 시 입력 받은 사용자 ID, 패스워드와 같은 인증 요청 정보를 가지고 있다.
- **AuthenticationFilter** - 시큐리티 관련 전처리를 위한 필터
- **AuthenticaitonManager** - 사용자 비밀번호를 인증하는 역할을 담당한다.
- **AuthenticationProvider** - AuthenticationManager에게 비밀번호 인증 기능을 제공한다.
- **UserDetailsService** - UserDetails를 반환함
- **UserDetails** - DB에서 가져온 사용자 정보(이름, 이메일, 전화번호)를 저장하기 위함.
- **SecurityContext** - Authentication를 보관함

# 시큐리티 인증 흐름

![image](https://user-images.githubusercontent.com/45007556/91036976-37b49400-e643-11ea-809d-841e6d4befd3.png)

1. **UsernamePasswordAuthenticationFilter(AuthenticationFilter)** 는 **HttpServletRequest**에서 사용자가 전송한 아이디와 패스워드를 가로챈다.
2. **AuthenticationFilter**는 인증용 객체 **Authentication**을 생성한다.
3. **AuthenticationFilter**는 인증을 위해 **AuthenticationManager**에게 **Authentication**을 전달한다.
4. **AuthenticationManager**는 실제 인증 기능이 수행을 위해 **AuthenticationProvider**에게 다시 **Authentication**을 전달한다.
5. **AuthenticationProvider**는 **UserDetailsService**에게 조회할 username을 전달하여 인증을 위한 **UserDetails**(DB 사용자 정보) 객체를 요청한다.
6. **UserDetailsService**는 **AuthenticationProvider**에게 전달 받은 username을 통해 **UserDetails**(DB 사용자 정보)를 찾는다.
7. **UserDetailsService**는 username을 통해 찾은 **UserDetails**(DB 사용자 정보)를 반환한다.
8. **AuthenticationProvider**는 **Authentication**과 **UserDetails**를 가지고 인증을 수행하여 인증에 성공 시 **Authentication**을 반환한다. (반환할 **Authentication**에는 부여된 권한, 인증 여부가 포함됨)
9. **AuthenticationManager**는 **AuthenticationProvider**을 통해 인증에 성공할 경우 전달 **AuthenticationProvider**을 통해 전달받은 **Authentication**을 반환한다.
10. 인증이 최종적으로 완료되면 **Authentication**객체를 **SecurityContextHolder**에 담은 후 성공 시 **AuthenticationSuccessHandler**, 실패 시 **AuthenticationFailureHandler**를 실행한다.

# 스프링 시큐리티 필터 체인

![image](https://user-images.githubusercontent.com/45007556/91037118-70ed0400-e643-11ea-8280-acf4aaa34245.png)
위에서 시큐리티 인증 흐름을 설명할 때 2번에서 form 기반 인증 흐름을 설명하기 위해 **UsernamePasswordAuthenticationFilter(AuthenticationFilter)** 에 대해서 설명했었다. 그런데 시큐리티에서 지원하는 필터는 이것 하나만이 아니라 아래와 같은 순서로 여러 필터가 실행이 되는데 그 중 하나인 것이다. 전부 외워둘 필요는 없지만 훑어놨다가 나중에 커스텀할 일이 생겼을 때 다시 찾아보면 될 듯 하다.

1. **WebAsyncManagerIntegrationFilter** - ThreadLocal기반으로 같은 쓰레드 내에서만 SecurityContext가 공유됨. SpringSecurityContextHolder를 비동기(Async)와 관련된 기능을 쓸 때에도 SecurityContext를 사용할 수 있도록 만들어줌.
2. **SecurityContextPersistenceFilter** - SecurityContext가 없으면 생성하고, 있을 경우 불러오는 기능을 함.
3. **HeaderWriterFilter** - 응답(Response)에 Security와 관련된 헤더 값을 설정함.
4. **CsrfFilter** - CSRF 공격을 방어함.
5. **LogoutFilter** - 로그아웃 URL로 들어오는 요청을 감시하여 해당 사용자를 로그아웃 시킴.
6. **UsernamePasswordAuthenticationFilter** - 사용자 ID, 패스워드를 쓰는 form기반 인증을 처리함.
7. **RequestCacheAwareFilter** - 인증 후, 원래 Request 정보로 재구성함.
8. **SecurityContextHolderAwareRequestFilter** - HttpServletRequestWrapper를 상속한 SecurityContextHolderAwareRequestWapper 객체로 HttpServletRequest 정보를 감싼다. 해당 Wrapper객체는 필터 체인상의 다음 필터들에게 부가정보를 제공함.
9. **AnonymousAuthenticationFilter** - 이 필터에 올 때까지 앞에서 사용자 정보가 인증되지 않았다면, 해당 요청은 익명의 사용자가 보낸 것으로 판단하고 처리하고. **AnonymousAuthenticationToken**(**Authentication**)객체를 새로 생성함.
10. **SessionManagementFilter** - 인증된 사용자와 관련된 모든 세션을 추적함.(세션 변조 공격 방지, 유효하지 않은 세션으로 접근 시 URL 핸들링, 하나의 세션 아이디로 접속하는 세션 최대 수 설정, 세션 생성 전략 설정 등)
11. **ExceptionTranslationFilter** - 이전 필터들에서 인증 예외(AuthenticationException) 또는 인가 예외(AccessDeniedException)가 발생한 경우, 해당 예외를 캐치하여 처리함.
12. **FilterSecurityInterceptor** - 인가(Authorization)를 결정하는 AccessDecisionManager에게 접근 권한이 있는지 확인하고 처리함.

# Authentication와 UserDetails

**Authentication**은 사용자 요청 정보, 입력한 아이디, 비밀번호가 될 것이고,
**UserDetails**는 사용자 DB 정보, DB에 저장된 아이디, 비밀번호가 될 것이다.
그래서 모든 접근 주체는 **Authentication**을 생성하게 되고, 인증을 위해서는 **UserDetails**를 불러오게 된다.
여기서는 중요하다고 생각한 이 두 객체의 주요 메서드에 대해서 정리해놓는다.

## **Authentication**의 메소드

|               리턴 타입                |                 메소드명                  |                                               설명                                               |
| :------------------------------------: | :---------------------------------------: | :----------------------------------------------------------------------------------------------: |
| Collection<? extends GrantedAuthority> |             getAuthorities()              |                          저장소에 의해 인증된 사용자의 권한 목록을 반환                          |
|                 Object                 |             getCredentials()              |                       주체의 비밀번호(꼭 비밀번호가 아닐 수도 있음)을 반환                       |
|                boolean                 |             isAuthenticated()             | 인증 여부, AuthebnticationManager에 토큰을 제공할 지를 판단. 성공할 경우 불변의 인증 토큰을 반환 |
|                  void                  | setAuthenticated(boolean isAuthenticated) |                                         인증 여부를 설정                                         |

## **UserDetails**의 메소드

| 리턴 타입                              | 메소드명                  | 설명                                        |
| -------------------------------------- | ------------------------- | ------------------------------------------- |
| String                                 | getUsername()             | 계정 아이디를 반환                          |
| String                                 | getPassword()             | 계정 비밀번호를 반환                        |
| boolean                                | isAccountNonExpired()     | 계정 만료되지 않았는지를 반환               |
| boolean                                | isAccountNonLocked()      | 계정이 잠금 되어있지 않은 지를 반환         |
| boolean                                | isCredentialsNonExpired() | 계정의 패스워드가 만료되지 않았는 지를 반환 |
| boolean                                | isEnabled()               | 사용 가능 계정인지를 반환                   |
| Collection<? extends GrantedAuthority> | getAuthorities()          | 계정이 갖고 있는 권한 목록을 반환           |

두 객체의 메소드를 살펴보면 뭔가 매칭이 되는 메소드가 보인다. 알고 쓰는 것도 좋을 것 같다.

# AuthenticationManager

![image](https://user-images.githubusercontent.com/45007556/91037952-e3aaaf00-e644-11ea-8bdf-57e159a5ea3d.png)

인증 흐름에서 설명했듯이 이 그림과 함께 주요 흐름을 보강 설명하겠다.

1.  필터가 **Authentication**을 **AuthenticationManager**에 전달하여 인증 요청을 한다.
2.  **AuthenticationManager**는 **AuthenticationProvider**에게 **Authentication**를 전달하여 다시 인증 요청을 한다.
3.  **AuthenticationProvider**는 인증이 성공할 경우 **Authentication**의 멤버 변수 isAuthenticated를 true로 설정한다.

# 비밀번호 암호화 시 사용되는 PasswordEncoder

## [스프링 공식 홈페이지](https://docs.spring.io/spring-security/site/docs/5.1.1.RELEASE/reference/htmlsingle/#pe-dpe)에서 설명하고 있는 **PasswordEncoder**를 사용했을 때의 장점

- 현재 비밀번호 저장 권장 사항을 사용하여 비밀번호가 인코딩되도록 보장
- 최신 및 레거시 형식의 비밀번호 유효성 검사 허용
- 향후 인코딩 업그레이드 허용

## 주요 메소드

| 리턴 타입 | 메소드명                                                  | 설명                                                 |
| --------- | --------------------------------------------------------- | ---------------------------------------------------- |
| String    | encode(CharSequence rawPassword)                          | 비밀번호를 받아 암호화된 비밀번호를 반환             |
| boolean   | matches(CharSequence rawPassword, String encodedPassword) | 비밀번호와 암호화된 비밀번호를 받아 일치 여부를 반환 |

## 암호화 알고리즘

**PasswordEncoder**는 bcrypt, noop, pbkdf2, scrypt, sha256 등 여러가지 암호화 알고리즘을 지원하여 개발할 때 사용하고 싶은 암호화 방식을 선택하여 해당하는 구현체를 쓸 수 있다.
![image](https://user-images.githubusercontent.com/45007556/91037979-ed341700-e644-11ea-9248-e09471bc4b7b.png)

## 암호화 결과물

encode 메소드를 통해 비밀번호를 암호화를 해서 반환 받은 문자열을 살펴보면 아래와 같이 앞에 접두사로 {암호화 방식}이 붙는다. bcrypt로 암호화를 했기 때문에 {bcrypt}가 붙었다.

> {bcrypt}$2a$10\$g1PWM7YhvhhA3PUtnSh.mOZVQFQe7fTO0C2na2Xpbrit.bwYlQdPe

# 참고

[https://jeong-pro.tistory.com/205](https://jeong-pro.tistory.com/205)  
[https://springsource.tistory.com/80](https://springsource.tistory.com/80)  
[https://coding-start.tistory.com/153](https://coding-start.tistory.com/153)
