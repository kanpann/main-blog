---
date: "2020-06-11"
title: 스프링 부트 실행 시 특정 코드 실행하기(테스트 데이터 넣기)
category: Spring
tag: [Spring Boot]
image: https://user-images.githubusercontent.com/45007556/103328259-76e46d00-4a9b-11eb-91a0-6790f4be29ab.png
---

개발이나 테스트할 때 앱 실행 시 초기 데이터가 필요하거나 실행해야 하는 코드가 있는 경우가 있다.
그럴 때 CommandLineRunner로 가능하다. CommandLineRunner를 사용하는 방법 중 Bean을 이용한 방법으로 작성해보려 한다.

# Bean을 이용한 방법

```java
package application;

import application.jpa.domain.Member;
import application.jpa.domain.Posts;
import application.jpa.enums.Gender;
import application.jpa.enums.Role;
import application.jpa.repository.MemberRepository;
import application.jpa.repository.PostsRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

import java.sql.SQLException;
import java.util.stream.IntStream;

@EnableJpaAuditing
@SpringBootApplication
public class Application {
    public static void main(String[] args){
        SpringApplication.run(Application.class, args);
    }
    @Bean
    public CommandLineRunner runner(MemberRepository memberRepository, PostsRepository postsRepository) throws SQLException {
        return (args) -> {
            Member userMember = memberRepository.save(Member.builder()
                    .email("gunkim@gmail.com")
                    .password("test")
                    .nickname("gun")
                    .gender(Gender.F)
                    .role(Role.USER)
                    .build());

            IntStream.rangeClosed(1, 200).forEach(i -> {
                  postsRepository.save(Posts.builder()
                  .title(i+"번째 게시글입니다")
                  .content("게시글 내용입니다."+i)
                  .member(userMember)
                  .hit(0l)
                  .build());
            });
        };
    }
}

```

위의 코드처럼 CommandLineRunner를 리턴하는 빈을 등록해주면 되고, 빈으로 등록되어 있는 객체들을 파라미터로 받을 수 있다. 또한 CommandLineRunner는 여러개를 구현할 수 있다.
