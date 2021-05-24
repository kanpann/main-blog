---
date: "2020-05-08"
title: 스프링 부트 머스테치 - 시큐리티 form 전송 시 403 에러 해결법
category: Spring
tag: [Spring Boot, Mustache]
image: https://user-images.githubusercontent.com/45007556/103328259-76e46d00-4a9b-11eb-91a0-6790f4be29ab.png
---

스프링 시큐리티는 form 전송 시 csrf 토큰을 함께 전송해주어야 하는데, 타임리프나 다른 템플릿 엔진 같은 경우는 지원해주는 데 비해 로직 less인 머스테치의 경우는 지원해주지 않아 찾아본 방법

# 방법1. 컨트롤러에서 CsrfToken을 발급하여 model로 전달 

```java
@GetMapping("/signIn")
public String signIn(CsrfToken csrfToken, Model model) {
    model.addAttribute("_csrf", csrfToken);
    //...
}
```

---

# 다른 방법. 인터셉터를 통한 방법

위에 컨트롤러를 통해 하는 방법은 매번 저렇게 해줘야 하는 번거롭기 때문에 인터셉터를 통해서도 처리가 가능하다.

# 인터셉터 작성

```java
public class CsrfTokenInterceptor implements HandlerInterceptor {
    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response,
                           Object handler, ModelAndView modelAndView) throws Exception {
        if (modelAndView != null) {
            CsrfToken csrfToken = (CsrfToken) request.getAttribute("_csrf");
            modelAndView.addObject("_csrf", csrfToken);
        }
    }
}
```

컨트롤러 호출 후에 해당 메소드가 실행되어서 model에 등록해준다.

# 빈 등록

```java
@Configuration
public class Config {
    @Bean
    public CsrfTokenInterceptor csrfTokenInterceptor() {
        return new CsrfTokenInterceptor();
    }
}
```

# 인터셉터 등록

```java
@Configuration
public class WebMvcConfig implements WebMvcConfigurer {
    @Autowired
    CsrfTokenInterceptor csrfTokenInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(csrfTokenInterceptor);
    }
}
```

---

# 화면에서의 처리

```html
<input name="_csrf" type="hidden" value="{{_csrf.token}}" />
```

화면단에서는 위와 같이 태그를 삽입해주면 된다.

# 참고

[StackOverFlow](https://stackoverflow.com/questions/26397168/how-to-use-spring-security-with-mustache)
