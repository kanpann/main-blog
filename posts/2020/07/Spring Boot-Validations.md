---
date: "2020-07-18"
title: 스프링 부트 유효성 검증(Validation)을 커스텀하여 여러가지 항목에 대해 상호 검증하기
category: Spring
tag: [Spring Boot]
image: https://user-images.githubusercontent.com/45007556/91055051-16fa3780-e65f-11ea-95a2-9e8f6c8180c6.png
---

간혹 이렇게 비밀번호 입력 후 다시 한번 맞게 입력한건지 확인 비밀번호를 입력하는 경우가 있다. 이런 경우 기본적으로 지원하는 Validation 어노테이션으로는 단일 필드에 대한 유효성 검증만 처리가 가능하기 때문에 Validator을 커스텀해주어야 한다. 그 방법에 대해서 작성해보려고 한다.

# DTO클래스

```java
package application.web.dto;

import application.jpa.enums.Gender;
import application.jpa.domain.Member;
import application.jpa.enums.Role;
import lombok.*;

import javax.validation.constraints.*;

/**
 * 회원 Service 요청을 위한 DTO
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
    //최소 8글자, 최대 12글자, 특수문자 포함하도록
    @Pattern(regexp="([a-zA-Z0-9].*[!,@,#,$,%,^,&,*,?,_,~])|([!,@,#,$,%,^,&,*,?,_,~].*[a-zA-Z0-9]){8,12}" ,message="숫자 영문자 특수 문자를 포함한 8 ~ 12 자를 입력하세요. ")
    private String password;
    @NotBlank
    //최소 8글자, 최대 12글자, 특수문자 포함하도록
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

    /**
     * 비밀번호와 확인 비밀번호 일치하지 않는지 확인.
     * @return
     */
    public boolean isPwNotEquals(){
        return !password.equals(passwordChk);
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

그냥 평범한 DTO클래스이다. 비밀번호와 확인 비밀번호가 맞는 지 확인하기 위한 메소드를 추가해주었음.

# Validator을 구현한 AbstractValidator 클래스 작성

```java
package application.validator;

import lombok.extern.slf4j.Slf4j;
import org.springframework.validation.Errors;
import org.springframework.validation.Validator;

/**
 * 커스텀 유효성 검증을 위해 Validator을 구현한 클래스
 * @param <T>
 */
@Slf4j
public abstract class AbstractValidator<T> implements Validator {
    @Override
    public boolean supports(Class<?> clazz) {
        return true;
    }
    @SuppressWarnings("unchecked")
    @Override
    public void validate(Object target, Errors errors) {
        try{
            doValidate((T) target, errors);
        }catch(RuntimeException e){
            log.error("유효성 검증 에러", e);
            throw e;
        }
    }

    /**
     * 유효성 검증 로직이 들어감
     * @param form
     * @param errors
     */
    protected abstract void doValidate(final T form, final Errors errors);
}
```

validate를 구현해주었고, 검증로직이 들어갈 부분을 doValidate로 따로 빼주었음.

- @SuppressWarnings("unchecked") - 컴파일러에서 경고하지 않도록 하기 위해 사용

# PasswordCheckValidator 클래스 작성

```java
package application.validator;

import application.web.dto.MemberRequestDTO;
import org.springframework.stereotype.Component;
import org.springframework.validation.Errors;

/**
 * 비밀번호 확인 유효성 검증을 위한 커스텀 Validator클래스
 */
@Component
public class PasswordCheckValidator extends AbstractValidator<MemberRequestDTO> {
    @Override
    protected void doValidate(MemberRequestDTO form, Errors errors) {
        if(form.isPwNotEquals()){
            errors.rejectValue("passwordChk", "확인 비밀번호 불일치 오류", "비밀번호와 확인 비밀번호가 일치하지 않습니다.");
        }
    }
}
```

doValidate를 구현하여 검증로직을 작성하였고, bean으로 등록될 수 있도록 @Component 어노테이션을 붙여주었음.

# Controller에 메소드 추가

```java
package application.web;

import application.service.MemberService;
import application.util.ErrorsTransUtil;
import application.validator.PasswordCheckValidator;
import application.web.dto.MemberRequestDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.InitBinder;
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
    private final PasswordCheckValidator passwordCheckValidator;

    /**
     * 커스텀 유효성 검증을 위해 추가
     * @param binder
     */
    @InitBinder
    public void validatorBinder(WebDataBinder binder){
        binder.addValidators(passwordCheckValidator);
    }

    /**
     * 회원가입 페이지 이동
     */
    @GetMapping("/member/signUp")
    public void signUp(){}

    /**
     * 회원가입 처리
     * @param dto
     * @param errors
     * @param model
     * @param rttr
     * @return
     */
    @PostMapping("/member/signUp")
    public String signUp(@Validated MemberRequestDTO dto, BindingResult errors, Model model, RedirectAttributes rttr) {
        if(errors.hasErrors()){
            ErrorsTransUtil errorUtil = new ErrorsTransUtil(errors);
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

validatorBinder메소드를 작성하여 추가 검증할 Validator을 추가하여 주었음.

메소드명은 자유롭게 작성해도 상관없다.

- @InitBinder - 특정 컨트롤러에서 바인딩 또는 검증 설정을 변경하고 싶을 때 사용

- WebData Binder - HTTP 요청 정보를 컨트롤러 메소드의 파라미터나 모델에 바인딩할 때 사용되는 바인딩 객체

## 정리

Validation을 커스텀하기 위해서는 Validator을 구현해주어 검증 로직을 작성해주면 되고,

해당 Validator 사용을 위해서는 Controller에 @InitBinder이 붙은 WebDataBinder을 인자로 받는 메소드를 작성하여 추가해주어야 한다.
