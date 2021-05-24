---
date: "2020-05-29"
title: 스프링 부트 에러 페이지 적용하기
category: Spring
tag: [Spring Boot]
image: https://user-images.githubusercontent.com/45007556/91046271-122f8680-e653-11ea-8474-59cfaed336aa.png
---

![image](https://user-images.githubusercontent.com/45007556/91046271-122f8680-e653-11ea-8474-59cfaed336aa.png)
스프링 부트에서는 에러가 발생 시 톰캣 에러 페이지가 아니라 해당 화면과 같이 **화이트라벨**이라고 불리는 화면을 통해 에러 화면이 나온다. 그래서 이 화면을 커스텀하는 방법에 대해서 정리해보려고 한다.

# 화이트라벨 페이지 비활성화(꼭 안해도 됨)

## application.yml에 추가

```
server:
  error:
    whitelabel:
      enabled: false
```

## 확인

![image](https://user-images.githubusercontent.com/45007556/91046288-1b205800-e653-11ea-9093-159f2549b87d.png)

설정을 완료하게 되면 이렇게 톰캣 에러 페이지가 나온다.

# 공통 에러 페이지 커스텀

```java
package application.web;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.RequestDispatcher;
import javax.servlet.http.HttpServletRequest;
import java.util.Date;

/**
 * 공통 에러 페이지 표출을 위한 Controller
 */
@Controller
@Slf4j
public class CustomErrorController implements ErrorController {
    private static final String ERROR_PATH = "/error";

    @RequestMapping("/error")
    public String handleError(HttpServletRequest request, Model model) {
        Object status = request.getAttribute(RequestDispatcher.ERROR_STATUS_CODE);
        HttpStatus httpStatus = HttpStatus.valueOf(Integer.valueOf(status.toString()));

        model.addAttribute("code", status.toString());
        model.addAttribute("msg", httpStatus.getReasonPhrase());
        model.addAttribute("timestamp", new Date());
        return ERROR_PATH+"/error";
    }

    @Override
    public String getErrorPath() {
        return ERROR_PATH;
    }
}
```

> **getErrorPath **에서 리턴하는 문자열에 매핑된 URL이 error 페이지가 된다.

이렇게 ErrorController를 상속하여 구현해주면 된다.

# 공통 에러 페이지 준비

{% raw %}

```html
{{>layout/header}}
<!--<body>-->
<div style="width: 80%;" class="uk-margin-auto">
  <h1>에러 페이지</h1>
  에러코드 : <span>{{code}}</span><br />
  에러메시지 : <span>{{msg}}</span><br />
  시간 : <span>{{timestamp}}</span>
</div>
{{>layout/footer}}
```

{% endraw %}

나는 머스테치를 사용하기 때문에 이렇게 구성했다.

# 결과

![image](https://user-images.githubusercontent.com/45007556/91046409-53279b00-e653-11ea-9918-a1ee4e4d7f6f.png)

# 에러 코드별 페이지 다르게 하기

```java
package application.web;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.RequestDispatcher;
import javax.servlet.http.HttpServletRequest;
import java.util.Date;

/**
 * 공통 에러 페이지 표출을 위한 Controller
 */
@Controller
@Slf4j
public class CustomErrorController implements ErrorController {
    private static final String ERROR_PATH = "/error";

    @RequestMapping("/error")
    public String handleError(HttpServletRequest request, Model model) {
        Object status = request.getAttribute(RequestDispatcher.ERROR_STATUS_CODE);

        if (status != null) {
            Integer statusCode = Integer.valueOf(status.toString());

            if (statusCode == HttpStatus.NOT_FOUND.value()) {
                return ERROR_PATH+"/error-404";
            } else if (statusCode == HttpStatus.INTERNAL_SERVER_ERROR.value()) {
                return ERROR_PATH+"/error-500";
            }
        }
        return ERROR_PATH+"/error";
    }

    @Override
    public String getErrorPath() {
        return ERROR_PATH;
    }
}
```

# 참고

[StackOverFlow](https://www.baeldung.com/spring-boot-custom-error-page)
