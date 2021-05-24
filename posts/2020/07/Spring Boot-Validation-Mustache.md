---
date: "2020-07-01"
title: 스프링 부트 Mustache에서 유효성 검사하기(Validation)
category: Spring
tag: [Spring Boot]
image: https://user-images.githubusercontent.com/45007556/91050124-2bd3cc80-e659-11ea-84bd-798ff4fcd272.png
---

{% raw %}
이 콧수염 아저씨를 쓸때마다 느끼는거지만 Logic-Less라지만 너무 아무것도 없어서 불편할 때가 많다.(물론 사용 방법을 잘 몰라서 그럴 수도 있음) 검색 능력이 부족한건지 아무리 찾아봐도 머스테치에서 Validation를 사용하는 방법에 대해서는 나오지 않아서 개인적으로 연구해본 방법.

다른 좋은 방법이 있다면 리플 바람.

# DTO

```java
package application.web.dto;

import application.jpa.enums.Gender;
import application.jpa.domain.Member;
import application.jpa.enums.Role;
import lombok.*;

import javax.validation.constraints.*;

/**
 * 회원 요청을 위한 DTO
 */
@Getter
@Setter
@ToString
@NoArgsConstructor
public class MemberRequestDTO {
    @Email
    @NotBlank
    private String email;
    @NotBlank
    @Pattern(regexp="([a-zA-Z0-9].*[!,@,#,$,%,^,&,*,?,_,~])|([!,@,#,$,%,^,&,*,?,_,~].*[a-zA-Z0-9]){8,12}" ,message="숫자 영문자 특수 문자를 포함한 8 ~ 12 자를 입력하세요. ")
    private String password;
    @NotBlank
    @Pattern(regexp="([a-zA-Z0-9].*[!,@,#,$,%,^,&,*,?,_,~])|([!,@,#,$,%,^,&,*,?,_,~].*[a-zA-Z0-9]){8,12}" ,message="숫자 영문자 특수 문자를 포함한 8 ~ 12 자를 입력하세요. ")
    private String passwordChk;
    @Size(min=2, max=10)
    @NotBlank
    private String nickname;
    @NotBlank
    private String gender;

    @Builder
    public MemberRequestDTO(String email, String password, String passwordChk, String nickname, String gender){
        this.email = email;
        this.password = password;
        this.passwordChk = passwordChk;
        this.nickname = nickname;
        this.gender = gender;
    }
    //비밀번호와 확인 비밀번호가 일치하는지 확인
    public boolean isPwEqualToCheckPw(){
        return password.equals(passwordChk);
    }

    public Member toEntity(){
        return Member.builder()
                .email(this.email)
                .password(this.password)
                .nickname(this.nickname)
                .gender(Gender.valueOf(gender))
                .role(Role.USER)
                .build();
    }
}
```

# 컨트롤러

```java
package application.web;

import application.service.MemberService;
import application.web.dto.MemberRequestDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.HashMap;
import java.util.Map;

/**
 * 회원 Controller
 */
@Slf4j
@RequiredArgsConstructor
@Controller
public class MemberController {
    private final MemberService memberService;

    /**
     * 회원가입 페이지 이동
     */
    @GetMapping("/member/signUp")
    public void signUp(){}

    /**
     * 회원가입 처리
     * @param dto
     * @return
     */
    @PostMapping("/member/signUp")
    public String signUp(@Validated MemberRequestDTO dto, BindingResult errors, Model model, RedirectAttributes rttr) {
        if(errors.hasErrors() || !dto.isPwEqualToCheckPw()){
            Map<String, String> errorMap = new HashMap<String, String>();
            errors.getFieldErrors().stream().forEach(fieldError -> {
                String fieldName = fieldError.getField();
                String errorMsg = fieldError.getDefaultMessage();

                errorMap.put(fieldName, errorMsg);
            });
            if(!dto.isPwEqualToCheckPw()){
                errorMap.put("passwordChk", "비밀번호가 일치하지 않습니다.");
            }
            boolean isFemale = dto.getGender().equals("F");
            model.addAttribute("member", dto);
            model.addAttribute("isFemale", isFemale);
            model.addAttribute("error", errorMap);
            return "/member/signUp";
        }

        rttr.addFlashAttribute("msg", "회원가입에 성공했습니다!");
        memberService.signUp(dto);
        return "redirect:/";
    }
}
```

- Validation 사용을 위해 MemberRequestDTO 앞에 @Validated 어노테이션을 붙여주었음.
- 그냥 타임리프로 사용할 때는 그냥 errors를 그냥 넘겨서 뷰단에서 처리가 가능했는데, 나의 무지 때문인지 머스테치로는 그 방법을 알지 못해서 약간 꼼수로 error를 Map으로 바꿔서 필드 이름을 키, 에러 메세지를 값으로 만들어서 그 Map을 "error"이라는 애트리뷰트 이름으로 넘겨줌.
- "비밀번호"와 "비밀번호 확인" 일치 여부를 확인하기 위해서 Validated를 사용해서 해결하고 싶었는데, 그런 방법이 떠오르지 않아 정말 안타깝지만 if문으로 비교해주었음. <- 이 부분은 해결했음. [포스트 보러가기](https://gunkim0318.github.io/spring/2020/07/18/Spring-Boot-Validations/)

# signUp.mustache

```html
{{>layout/header}}
<!--</body>-->
<link rel="stylesheet" href="/css/member/signUp.css" />
<div
  class="col-xs-12 col-sm-12 col-md-4 col-lg-4 text-center"
  style="float:none; margin: 0 auto;"
>
  <h1>회원가입</h1>
  <form action="/member/signUp" method="post">
    <input name="_csrf" type="hidden" value="{{_csrf.token}}" />
    <span class="valid-msg"
      >{{#error.email}}{{error.email}}{{/error.email}}</span
    >
    <div class="input-group input-group-lg">
      <span class="input-group-addon" id="sizing-addon1"
        ><span class="glyphicon glyphicon-envelope"></span
      ></span>
      <input
        name="email"
        type="text"
        class="form-control"
        value="{{#member}}{{member.email}}{{/member}}"
        placeholder="메일을 입력해주세요"
      />
    </div>
    <span class="valid-msg"
      >{{#error.password}}{{error.password}}{{/error.password}}</span
    >
    <div class="input-group input-group-lg">
      <span class="input-group-addon" id="sizing-addon1"
        ><span class="glyphicon glyphicon-eye-close"></span
      ></span>
      <input
        name="password"
        type="password"
        class="form-control"
        value="{{#member}}{{member.password}}{{/member}}"
        placeholder="비밀번호를 입력해주세요"
      />
    </div>
    <span class="valid-msg"
      >{{#error.passwordChk}}{{error.passwordChk}}{{/error.passwordChk}}</span
    >
    <div class="input-group input-group-lg">
      <span class="input-group-addon" id="sizing-addon1"
        ><span class="glyphicon glyphicon-eye-close"></span
      ></span>
      <input
        name="passwordChk"
        type="password"
        class="form-control"
        value="{{#member}}{{member.passwordChk}}{{/member}}"
        placeholder="비밀번호 확인을 입력해주세요"
      />
    </div>
    <span class="valid-msg"
      >{{#error.nickname}}{{error.nickname}}{{/error.nickname}}</span
    >
    <div class="input-group input-group-lg">
      <span class="input-group-addon" id="sizing-addon1"
        ><span class="glyphicon glyphicon-user"></span
      ></span>
      <input
        name="nickname"
        type="text"
        class="form-control"
        value="{{#member}}{{member.nickname}}{{/member}}"
        placeholder="닉네임을 입력해주세요"
      />
    </div>
    <span class="valid-msg"
      >{{#error.gender}}{{error.gender}}{{/error.gender}}</span
    >
    <div>
      <label><input name="gender" type="radio" value="M" checked /> 남성</label>
      <label
        ><input name="gender" type="radio" value="F"
        {{#isFemale}}checked{{/isFemale}}> 여성</label
      >
    </div>
    <div>
      <button type="submit" id="signUpBtn" class="btn btn-primary col-lg-12">
        입력
      </button>
      <hr />
      <button id="backBtn" class="btn btn-default col-lg-12">취소</button>
    </div>
  </form>
</div>
{{>layout/footer}}
<!--</body>-->
<script src="/js/member/signUp.js"></script>
```

error에 해당 메세지가 존재할 경우 출력해주고, 값 유지를 위해서도 동일하게 처리해주었음.

# 추가

## MemberController.java

```java
package application.web;

import application.service.MemberService;
import application.web.dto.MemberRequestDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.HashMap;
import java.util.Map;

/**
 * 회원 Controller
 */
@Slf4j
@RequiredArgsConstructor
@Controller
public class MemberController {
    private final MemberService memberService;

    /**
     * 회원가입 페이지 이동
     */
    @GetMapping("/member/signUp")
    public void signUp(){}

    /**
     * 회원가입 처리
     * @param dto
     * @return
     */
    @PostMapping("/member/signUp")
    public String signUp(@Validated MemberRequestDTO dto, BindingResult errors, Model model, RedirectAttributes rttr) {
        if(errors.hasErrors() || !dto.isPwEqualToCheckPw()){
            Map<String, String> errorMap = new HashMap<String, String>();
            errors.getFieldErrors().stream().forEach(fieldError -> {
                String fieldName = fieldError.getField();
                String errorMsg = fieldError.getDefaultMessage();

                errorMap.put(fieldName, errorMsg);
            });
            if(!dto.isPwEqualToCheckPw()){
                errorMap.put("passwordChk", "비밀번호가 일치하지 않습니다.");
            }
            boolean isFemale = dto.getGender().equals("F");
            model.addAttribute("member", dto);
            model.addAttribute("isFemale", isFemale);
            model.addAttribute("error", errorMap);
            return "/member/signUp";
        }

        rttr.addFlashAttribute("msg", "회원가입에 성공했습니다!");
        memberService.signUp(dto);
        return "redirect:/";
    }
}
```

작성하다 보니 Errors 객체를 Map으로 변환하는 경우가 꽤 있어서 이 부분을 유틸로 바꾸어 보았음.

## ErrorsTransUtil.java

```java
package application.util;

import org.springframework.validation.Errors;

import java.util.HashMap;
import java.util.Map;

/**
 * Errors객체를 Map으로 변환함
 */
public class ErrorsTransUtil {
    private final Map<String, String> errorMap;

    /**
     * TODO Errors객체를 받아서 변환하는 작업
     * @param errors
     */
    public ErrorsTransUtil(Errors errors){
        Map<String, String> errorMap = new HashMap<String, String>();
        errors.getFieldErrors().stream().forEach(fieldError -> {
            String fieldName = fieldError.getField();
            String errorMsg = fieldError.getDefaultMessage();

            errorMap.put(fieldName, errorMsg);
        });
        this.errorMap = errorMap;
    }

    /**
     * 커스텀 에러 메시지 추가
     * @param fieldName
     * @param errorMsg
     */
    public void addCustomErrorMsg(String fieldName, String errorMsg){
        this.errorMap.put(fieldName, errorMsg);
    }
    /**
     * 생성자를 통해 변환된 Map을 반환함.
     * @return
     */
    public Map<String, String> getMap(){
        return this.errorMap;
    }
}
```

생성자를 통해 받아서 변환하고, getter를 통해 해당 Map을 반환하는 형태로 작성하였음.

변환하는 부분에 대해서 좀 더 깔끔한 방법이 있었던 것 같은데 일단 스탠타드하게 작성해보았다.

## MemberController.java

```java
package application.web;

import application.service.MemberService;
import application.util.ErrorsTransUtil;
import application.web.dto.MemberRequestDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

/**
 * 회원 Controller
 */
@Slf4j
@RequiredArgsConstructor
@Controller
public class MemberController {
    private final MemberService memberService;
    /**
     * 회원가입 페이지 이동
     */
    @GetMapping("/member/signUp")
    public void signUp(){}

    /**
     * 회원가입 처리
     * @param dto
     * @return
     */
    @PostMapping("/member/signUp")
    public String signUp(@Validated MemberRequestDTO dto, BindingResult errors, Model model, RedirectAttributes rttr) {
        if(errors.hasErrors() || !dto.isPwEqualToCheckPw()){
            ErrorsTransUtil errorUtil = new ErrorsTransUtil(errors);
            if(!dto.isPwEqualToCheckPw()){
                errorUtil.addCustomErrorMsg("passwordChk", "비밀번호가 일치하지 않습니다.");
            }
            boolean isFemale = dto.getGender().equals("F");
            model.addAttribute("member", dto);
            model.addAttribute("isFemale", isFemale);
            model.addAttribute("errors", errorUtil.getMap());
            return "/member/signUp";
        }
        rttr.addFlashAttribute("msg", "회원가입에 성공했습니다!");
        memberService.signUp(dto);
        return "redirect:/";
    }
    /**
     * 로그인 페이지 이동
     */
    @GetMapping("/member/signIn")
    public void signIn(){}
}
```

Map으로 변환하는 소스가 줄어들면서 그나마 보기 좋아졌다. 이제 Validation는 문제 없을 것 같다.
{% endraw %}
