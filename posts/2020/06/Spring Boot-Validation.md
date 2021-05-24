---
date: "2020-06-16"
title: 스프링 부트 유효성(Validation) 검증하기
category: Spring
tag: [Spring Boot]
image: https://user-images.githubusercontent.com/45007556/91046786-01cbdb80-e654-11ea-9f51-52887974386e.png
---

스프링에서는 유효성 검증을 위한 Validation기능을 제공해주고 있다. 그래서 Validation기능 사용하는 방법에 대해서 포스팅해보려고 한다.

# Bean Validation(Hibernate)

Bean Validation이라는 이름으로 Java에서 유효성(Validation) 데이터 검증을 위한 메타데이터로 사용하는 방법을 제시하고 있다.(Bean Validation 2.0 JSR-380까지 나와있음)

이 글에서 이것에 대한 구현체인 Hibernate Validator를 사용한 유효성 검증해보는 방법을 정리해보려고 한다. [예제 프로젝트](https://github.com/gunkim0318/springboot-validated)

# 유효성 검증 어노테이션 정리

| 어노테이션                      | 설명                                                                         |
| ------------------------------- | ---------------------------------------------------------------------------- |
| @Null                           | null인지 확인                                                                |
| @NotNull                        | null이 아닌지 확인                                                           |
| @NotEmpty                       | null, 공백이 아닌지 확인                                                     |
| @NotBlank                       | null, 공백, trim된 문자열 길이가 0이 아닌지 확인                             |
| @Email                          | 이메일 형식인지 확인                                                         |
| @AssertTrue                     | 참인지 검사                                                                  |
| @AssertFalse                    | 거짓인지 검사                                                                |
| @Size(min=, max=)               | 크기가 min, max 사이에 있는지 확인                                           |
| @Future                         | 미래 날짜인지 확인                                                           |
| @Past                           | 과거날짜인지 확인                                                            |
| @FutureOrPresent                | 현재 또는 미래 날짜인지 확인                                                 |
| @PastOrPresent                  | 과거 또는 현재인지 확인                                                      |
| @Positive                       | 양수인지 확인                                                                |
| @Negative                       | 음수인지 확인                                                                |
| @PositiveOrZero                 | 양수이거나 0인지 확인                                                        |
| @NegativeOrZero                 | 음수이거나 0인지 확인                                                        |
| @Max(value=)                    | 지정된 최대값 이하인지 확인                                                  |
| @Min(value=)                    | 지정된 최소값 이상인지 확인                                                  |
| @Pattern(regex=, flags=)        | 주어진 플래그 매치를 고려하여 값이 정규식 regex와 일치하는지 검사            |
| @Digits(integer=, fraction=)    | 값이 integer와 fraction에 의해 지정된 자리수의 숫자인지 확인                 |
| @DecimalMax(value=, inclusive=) | inclusive가 true이면 value 이하인지 확인, false이면 value보다 미만인지 확인  |
| @DecimalMin(value=, inclusive=) | inclusive가 true이면 value 초과인지 확인, false일 때 value보다 이상인지 확인 |
| @URL                            | URL형식인지 확인                                                             |

# 한번 직접 사용해보기

## build.gradle

```java
buildscript {
    ext {
        springBootVersion = '2.2.4.RELEASE'
    }
    repositories {
        mavenCentral()
        jcenter()
    }
    dependencies {
        classpath("org.springframework.boot:spring-boot-gradle-plugin:${springBootVersion}")
    }
}
apply plugin: 'java'
apply plugin: 'eclipse'
apply plugin: 'idea'
apply plugin: 'org.springframework.boot'
apply plugin: 'io.spring.dependency-management'

group = 'com.gun'
version = '0.0.1-SNAPSHOT'
sourceCompatibility = '1.8'

repositories {
    mavenCentral()
    jcenter()
}

dependencies {
    implementation group: 'org.springframework.boot', name: 'spring-boot-starter-thymeleaf'
    implementation group:'org.springframework.boot', name: 'spring-boot-starter-validation'
    implementation group:'org.springframework.boot', name: 'spring-boot-starter-web'
    compileOnly group:'org.projectlombok', name: 'lombok'
    annotationProcessor group:'org.projectlombok', name: 'lombok'
    testImplementation group:'org.springframework.boot', name: 'spring-boot-starter-test'
}

test {
    useJUnitPlatform()
}

```

validation 어노테이션을 사용하기 위해 spring-boot-starter-validation 의존성을 주입해주었음.

만약, JPA를 사용할 경우 JPA 의존성에 포함이 되어 있기 때문에 해당 의존성을 주입하지 않아도 됨.

### Member.java

```java
package com.gun.app.domain;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.validator.constraints.URL;

import javax.validation.constraints.*;

@Getter
@Setter
@ToString
public class Member {
    @NotBlank
    private String userId;
    private String password;
    @NotBlank
    @Size(max=3)
    private String userName;
    @Email
    @NotEmpty
    private String email;
    private String gender;
}
```

### MemberController.java

```java
package com.gun.app.web;

import com.gun.app.domain.Member;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

@Controller
public class MemberController {
    @GetMapping("/registerForm")
    public void registerForm(Model model){
        model.addAttribute("member", new Member());
    }
    @PostMapping("/register")
    public String register(@Validated Member member, BindingResult result, Model model){
        if(result.hasErrors()){
            return "registerForm";
        }
        return "success";
    }
}
```

@Validated는 유효성 검증을 하기 위해 사용했음.

BindingResult는 Errors를 상속하는 객체로 유효성 검증 결과를 담고 있음.

### registerForm.html

```html
<!DOCTYPE html>
<html lang="ko" xmlns:th="http://www.thymeleaf.org">
  <head>
    <meta charset="UTF-8" />
    <title>회원가입</title>
  </head>
  <body>
    <h1>회원가입</h1>
    <form th:action="@{/register}" th:object="${member}" method="POST">
      <table>
        <tr>
          <td>ID</td>
          <td>
            <input type="text" th:field="*{userId}" />
            <font color="red">
              <span
                th:if="${#fields.hasErrors('userId')}"
                th:errors="*{userId}"
              ></span>
            </font>
          </td>
        </tr>
        <tr>
          <td>비밀번호</td>
          <td>
            <input type="password" th:field="*{password}" />
            <font color="red">
              <span
                th:if="${#fields.hasErrors('password')}"
                th:errors="*{password}"
              ></span>
            </font>
          </td>
        </tr>
        <tr>
          <td>이름</td>
          <td>
            <input type="text" name="userName" th:field="*{userName}" />
            <font color="red">
              <span
                th:if="${#fields.hasErrors('userName')}"
                th:errors="*{userName}"
              ></span>
            </font>
          </td>
        </tr>
        <tr>
          <td>email</td>
          <td>
            <input type="text" name="email" th:field="*{email}" />
            <font color="red">
              <span
                th:if="${#fields.hasErrors('email')}"
                th:errors="*{email}"
              ></span>
            </font>
          </td>
        </tr>
        <tr>
          <td>성별</td>
          <td>
            <input type="radio" id="Male" th:field="*{gender}" value="M" />
            <label for="Male">남자</label>
            <br />
            <input type="radio" id="Female" th:field="*{gender}" value="F" />
            <label for="Female">여자</label>
          </td>
        </tr>
      </table>

      <button type="submit">등록</button>
    </form>
  </body>
</html>
```

## success.html

```html
<!DOCTYPE html>
<html lang="ko" xmlns:th="http://www.thymeleaf.org">
  <head>
    <meta charset="UTF-8" />
    <title>성공</title>
  </head>
  <body>
    <h1>회원 정보 입력 성공!</h1>
  </body>
</html>
```

## 결과

![image](https://user-images.githubusercontent.com/45007556/91046950-435c8680-e654-11ea-8669-f74bb7091e3b.png)
![image](https://user-images.githubusercontent.com/45007556/91046978-4eafb200-e654-11ea-8e38-87ee967e9654.png)

# 메시지 커스텀하기

## member.java

```
package com.gun.app.domain;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.validator.constraints.URL;

import javax.validation.constraints.*;

@Getter
@Setter
@ToString
public class Member {
    @NotBlank(message = "아이디를 입력해주시기 바랍니다.")
    private String userId;
    private String password;
    @NotBlank(message = "이름을 입력해주시기 바랍니다.")
    @Size(max=3, message = "이름은 세글자까지 허용됩니다.")
    private String userName;
    @Email(message = "이메일 주소를 입력해 주셔야 합니다.")
    @NotEmpty(message = "이메일을 입력해주시기 바랍니다.")
    private String email;
    private String gender;
}
```

## 확인

![image](https://user-images.githubusercontent.com/45007556/91046865-21630400-e654-11ea-93c7-d767a8de959d.png)
![image](https://user-images.githubusercontent.com/45007556/91046886-2b850280-e654-11ea-90a0-d8791b80e12b.png)
