---
date: '2021-04-09'
title: 스프링 커스텀 어노테이션으로 소스를 간결하게 하자
category: Spring
image: https://user-images.githubusercontent.com/45007556/103328175-0e958b80-4a9b-11eb-9db7-66230e0f057c.png
tags: [Spring]
---

이번에 사내 소스를 살펴보던 중 매우 나쁜 냄새가 나는 소스가 있어서 개선 방법을 생각해 보았다.

# 문제의 소스

이런 식으로 사용자 아이디가 필요한 곳마다 같은 소스가 꼭 들어가 있는 것을 확인할 수 있었다.

```java
@RestController
public class HomeController {
    @GetMapping("/")
    public void home(Authentication auth){
        UserVO vo = (UserVO) auth.getPrincipal();
        String userId = vo.getUserId();
        //...
    }
    @GetMapping("/posts")
    public void posts(Authentication auth){
        UserVO vo = (UserVO) auth.getPrincipal();
        String userId = vo.getUserId();
        //...
    }
    @GetMapping("/notice")
    public void home(Authentication auth){
        UserVO vo = (UserVO) auth.getPrincipal();
        String userId = vo.getUserId();
        //...
    }
}
```

# 개선해보기

어떻게 고치면 좋을까 생각을 하던 중 예전에 이동욱 님이 소개하셨던 커스텀 어노테이션 작성하는 법이 생각나서 한번 어노테이션을 만드는 방법으로 시도해보았다.

## @LoginUser 어노테이션 선언

```java
package com.awa.ai.biz.common.annotations;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.PARAMETER)
@Retention(RetentionPolicy.RUNTIME)
public @interface LoginUser {
}
```

해당 어노테이션은 매개변수에 런타임 시에 적용할 수 있도록 선언해 주었다. 지금은 어노테이션만 선언해 준 것이고, 아직 원하는 기능은 하지 못한다.

### @Target - 적용 대상 명시

- ElementType.PACKAGE : 패키지
- ElementType.TYPE : 타입 선언
- ElementType.ANNOTATION_TYPE : 어노테이션
- ElementType.CONSTRUCTOR : 생성자
- ElementType.FIELD : 멤버 변수
- ElementType.LOCAL_VARIABLE : 지역 변수
- ElementType.METHOD : 메서드
- ElementType.PARAMETER : 매개변수
- ElementType.TYPE_PARAMETER : 매개변수 타입
- ElementType.TYPE_USE : 타입

### @Retention - 어노테이션 적용 범위

- RetentionPolicy.RUNTIME 컴파일 전까지 유효
- RetentionPolicy.CLASS 컴파일러가 클래스를 참조할 때까지 유효
- RetentionPolicy.SOURCE 컴파일 이후에도 JVM 에 의해서 계속 참조 가능

## LoginUserArgumentResolver 선언

```java
@Component
@Qualifier("LoginUserArgumentResolver")
public class LoginUserArgumentResolver implements HandlerMethodArgumentResolver {
    @Override
    public boolean supportsParameter(MethodParameter methodParameter) {
        // 해당 매개변수에 @LoginUser 어노테이션이 붙어있는지 확인
        boolean isLoginUserAnnotation = methodParameter.getParameterAnnotation(LoginUser.class) != null;
        //어노테이션이 붙은 변수 타입이 String 타입인지 확인
        boolean isUserClass = String.class.equals(methodParameter.getParameterType());

        //두가지 모두 만족할 경우 적용
        return isLoginUserAnnotation && isUserClass;
    }

    @Override
    public Object resolveArgument(MethodParameter methodParameter, ModelAndViewContainer modelAndViewContainer, NativeWebRequest nativeWebRequest, WebDataBinderFactory webDataBinderFactory) throws Exception {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserVO userVO = (UserVO) authentication.getPrincipal();
        return userVO.getUserId();
    }
}
```

이제 실질적인 기능을 작성해 주었다. supportsParameter 메소드는 적용 대상이 맞는지 검증, resolveArgument 메소드는 실제로 값을 바인딩 해준다.

## LoginUserArgumentResolver를 등록하기

```java
@RequiredArgsConstructor
@EnableWebMvc
@Configuration
public class WebMvcConfigurers implements WebMvcConfigurer {
	//....
    @Qualifier("LoginUserArgumentResolver")
	private final HandlerMethodArgumentResolver loginUserArgumentResolver;

    @Override
    public void addArgumentResolvers(List<HandlerMethodArgumentResolver> resolvers) {
        resolvers.add(loginUserArgumentResolver);
    }
}
```

# 개선한 코드

```java
@RestController
public class HomeController {
    @GetMapping("/")
    public void home(@LoginUser String userId){
        //...
    }
    @GetMapping("/posts")
    public void posts(@LoginUser String userId){
        //...
    }
    @GetMapping("/notice")
    public void home(@LoginUser String userId){
        //...
    }
}
```

소스가 매우 간결해지고, 코드의 가독성이 좋아진 것을 확인할 수 있다.

# 커스텀 어노테이션 적용의 주의할 점?

싱글벙글하면서 커스텀 어노테이션을 적용해놓고, 관련 글을 찾아보던 중
[시의적절한 커스텀 어노테이션](https://woowabros.github.io/experience/2020/06/26/custom-annotation.html)이라는 글을 보게 되었다. 어노테이션을 쓰면 코드가 간결해지지만, 어노테이션의 의도는 숨겨져 있기 때문에 남발할 경우 좋지 않을 수 있다는 것이다. 나도 이번에 적용해보고, 어? 전부 어노테이션으로 바꿔버리면 좋...지 않을...까?라고 잠깐 생각했었던 터라 매우 공감하면서 읽었다. 이 문제는 커스텀 어노테이션으로 해결했지만, 커스텀 어노테이션을 적용할 경우 한 번쯤은 깊게 고민해 보고 최대한 지양하는 것이 좋지 않을까 생각한다.
