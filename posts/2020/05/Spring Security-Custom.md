---
date: "2020-05-08"
title: 스프링 부트 - 스프링 시큐리티 간단 커스텀
category: Spring
tag: [Spring Boot, Spring Security]
image: https://user-images.githubusercontent.com/45007556/91045190-76e9e180-e651-11ea-9bea-7a4aa69564c8.png
---

일반적으로 스프링 시큐리티를 사용할 때 간단하게 커스텀해서 사용하는 방법에 대해서 포스팅하려고 한다.

# 스프링 시큐리티 흐름

![image](https://user-images.githubusercontent.com/45007556/91045190-76e9e180-e651-11ea-9bea-7a4aa69564c8.png)

# 스프링 시큐리티 커스터마이징

보통 커스터마이징을 할 때 AuthenticationProvider나 UserDetailsService를 커스터마이징하게 된다.

- **UserDetails** - 유저 vo라고 보면 됨(만약 memberVO와 같이 별도로 사용하는 vo가 있을 경우 변환해주는 작업이 필요함)
- **UserDetailsService** - 유저 정보를 가져옴
- **AuthenticationProvider** - Service에서 가져온 유저 정보를 가지고 로그인한 비밀번호와 가져온 유저 정보의 비밀번호가 일치하는 지 확인.

해당 부분 중 내가 커스터마이징한 부분은 UserDetailsService. 이 포스트에서는 위에서 말한대로 원래 사용하던 Member 객체를 UserDetails 객체로 변환하는 내용을 UserDetailsService을 작성하여 시큐리티를 적용하는 방법에 대해 작성하려고 한다.

# 스프링 시큐리티를 의존성 주입하기

## gradle:

```java
implementation group: 'org.springframework.boot', name: 'spring-boot-starter-security'
```

## maven:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
    <version>2.2.6.RELEASE</version>
</dependency>
```

# 비밀번호 암호화를 위한 PasswordEncoder 빈 설정

```java
package application.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class WebMvcConfig {
    @Bean
    public PasswordEncoder passwordEncoder() {
        return PasswordEncoderFactories.createDelegatingPasswordEncoder();
    }
}
```

**PasswordEncoder** 인터페이스는 여러개의 구현체가 있는데, PasswordEncoderFactories.createDelegatingPasswordEncoder() 를 통해 생성한 구현체는 기본적으로 **BCryptPasswordEncoder**을 사용하게 된다.

앞에 "BCrypt"는 암호화 방식이며, 다른 암호화 방식을 사용하고 싶다면 자유롭게 바꿔줄 수 있다.

주요 메소드

- **PasswordEncoder.encode(CharSequence rawPassword) -** 해당 메소드에 암호화할 패스워드를 넘겨주게 되면 암호화된 비밀번호를 생성하여 준다.

- **PasswordEncoder.matches(CharSequence rawPassword, String encodedPassword\*\***)\*\* - 암호화되지 않은 비밀번호, 암호화된 비밀번호 를 넘겨주면 둘이 일치하는 지를 boolean으로 반환해줌.

> encode 메소드를 통해 비밀번호를 암호화를 하게 되면 아래와 같이 암호화가 되는데,  
> 앞에 {} 안에 어떤 암호화 방식을 통하여 암호화를 하였는 지를 담고있다.  
> {bcrypt}$2a$10\$g1PWM7YhvhhA3PUtnSh.mOZVQFQe7fTO0C2na2Xpbrit.bwYlQdPe

**PasswordEncoder**를 사용했을 때의 장점은 [스프링 공식 홈페이지](https://docs.spring.io/spring-security/site/docs/5.1.1.RELEASE/reference/htmlsingle/#pe-dpe)에서는 이렇게 설명하고 있다.

- 현재 비밀번호 저장 권장 사항을 사용하여 비밀번호가 인코딩되도록 보장
- 최신 및 레거시 형식의 비밀번호 유효성 검사 허용
- 향후 인코딩 업그레이드 허용

# 준비

```java
package application.domain;

import lombok.*;

import javax.persistence.*;

@NoArgsConstructor(access = AccessLevel.PROTECTED)
@ToString
@Getter
@Entity
public class Member {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 30, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false, length = 20)
    private String nickname;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Gender gender;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Role role;

    @Builder
    public Member(Long id, String email, String password, String nickname, Gender gender, Role role){
        this.id = id;
        this.email = email;
        this.password = password;
        this.nickname = nickname;
        this.gender = gender;
        this.role = role;
    }
}
```

```java
package application.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum Gender {
    M("남성"),
    F("여성");

    private String title;
}

```

```java
package application.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum Role {
    ADMIN("관리자", "ROLE_ADMIN"),
    USER("사용자", "ROLE_USER");

    private String title;
    private String value;
}
```

```java
package application.domain;

import org.springframework.data.jpa.repository.JpaRepository;

public interface MemberRepository extends JpaRepository<Member, Long> {
    Member findByEmail(String email);
}
```

```java
package application.dto;

import application.domain.Gender;
import application.domain.Member;
import application.domain.Role;
import lombok.*;

@Getter
@Setter
@ToString
@NoArgsConstructor
public class MemberRequestDTO {
    private String email;
    private String password;
    private String nickname;
    private String gender;

    @Builder
    public MemberRequestDTO(String email, String password, String nickname, String gender){
        this.email = email;
        this.password = password;
        this.nickname = nickname;
        this.gender = gender;
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

# UserDetailsService 커스터마이징

```java
package application.config;

import application.domain.Member;
import application.domain.MemberRepository;
import application.dto.MemberRequestDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import sun.security.util.Password;

import java.util.ArrayList;
import java.util.Collection;

@Service
@Slf4j
@RequiredArgsConstructor
public class CustomUserDetailService implements UserDetailsService {
    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Member member = memberRepository.findByEmail(email);

        if(member == null){
            throw new UsernameNotFoundException("해당 "+email+"(email)의 유저가 없습니다.");
        }

        Collection<SimpleGrantedAuthority> roles = new ArrayList<SimpleGrantedAuthority>();

        roles.add(new SimpleGrantedAuthority(member.getRole().getValue()));

        return new User(email, member.getPassword(), roles);
    }
    public void signUp(MemberRequestDTO dto){
        dto.setPassword(passwordEncoder.encode(dto.getPassword()));
        memberRepository.save(dto.toEntity());
    }
}
```

encode메소드는 같은 문자열이라도 실행할 때마다 암호화된 패스워드 값이 달라지므로 패스워드가 같은 지를 확인해야 할 경우 equals가 아닌 matches메소드를 사용하면 됨.

**UserDetailsService**는 유저 정보를 반환하는 역할을 하는데, 여기를 커스터마이징 해서 **Member**를 **User**로 변환할 수 있도록 해주었다.

# 스프링 시큐리티 설정해주기

```java
package application.config;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.header.writers.frameoptions.WhiteListedAllowFromStrategy;
import org.springframework.security.web.header.writers.frameoptions.XFrameOptionsHeaderWriter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

import java.util.Arrays;

@RequiredArgsConstructor
@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    private final CustomUserDetailService customUserDetailService;

    private final PasswordEncoder passwordEncoder;
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.authorizeRequests()
                // 페이지 권한 설정
                .antMatchers("/api/**").hasRole("USER")
                .antMatchers("/post/add").hasRole("USER")
                .antMatchers("/post/modify").hasRole("USER")
                .antMatchers("/").permitAll()
                .antMatchers("/member/signUp").permitAll()
                .and()//로그인 설정
                    .formLogin()
                    .loginPage("/member/signIn")
                    .loginProcessingUrl("/member/signIn")
                    .usernameParameter("email")
                    .defaultSuccessUrl("/")
                    .permitAll()
                .and()//로그아웃 설정
                    .logout()
                    .logoutRequestMatcher(new AntPathRequestMatcher("/member/logout"))
                    .logoutSuccessUrl("/")
                    .invalidateHttpSession(true);
    }
    @Override
    public void configure(WebSecurity web) throws Exception
    {
        // static 디렉터리의 하위 파일 목록은 인증 무시 ( = 항상통과 )
        web.ignoring().antMatchers("/css/**", "/js/**", "/img/**", "/lib/**");
    }
    @Override
    public void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(customUserDetailService).passwordEncoder(passwordEncoder);
    }
}
```

configure(HttpSecurity http) 간단 설명

- **antMatchers("/post/add").hasRole("USER")** - ROLE_USER만 /post/add 접근 가능
- **antMatchers("/").permitAll()** - 모두 / 에 접근 가능
- **loginPage("/member/signIn")** - 커스텀할 로그인 페이지, 설정 안하면 기본으로 제공하는 로그인 페이지가 나옴
- **usernameParameter("email")** - 기본적으로 form에 아이디를 의미하는 파라미터 이름은 username이 기본인데, email을 아이디로 사용하고 싶어서 email을 username으로 인식할 수 있도록 설정
- **loginProcessingUrl("/member/signIn")** - 로그인 처리할 URL
- **defaultSuccessUrl("/")** - 로그인이 성공할 경우 이동할 페이지
- **logoutRequestMatcher(new AntPathRequestMatcher("/member/logout"))** - 로그아웃을 실행할 주소. /member/logout 을 호출 시 로그아웃이 된다

주요하게 볼 내용은 configure(AuthenticationManagerBuilder auth) 메소드를 오버라이드해서  
기본적인 **UserDetailService**가 아닌 커스터마이징한 **UserDetailService**와 **passwordEncoder**를 사용할 수 있도록 주입해주었다.

# 설정 완료

해당 포스트에서는 로그인 URL을 "/member/signIn"으로 설정하였기 때문에 해당 URL에 로그인 페이지를 만들어서 email, password 파라미터를 loginProcessingUrl에서 설정한 "/member/signIn" 에 POST로 넘겨주게 되면 로그인 처리가 될 것이다.
