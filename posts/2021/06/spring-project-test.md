---
date: '2021-06-01'
title: JUnit5로 스프링 프로젝트 효과적으로 테스트하기
category: Spring
image: https://user-images.githubusercontent.com/45007556/120090298-4bde7200-c13c-11eb-90ea-9ac2a37b3dee.png
tags: [Spring, Spring Boot, JUnit]
---

오늘은 평소 운영하는 개발자 단톡방을 보고 있다가 JUnit으로 테스트하는 방법을 잘 모르는 사람이 생각보다 엄청 많은 것 같아서 JUnit5로 테스트하는 과정을 한번 포스팅해보려고 한다. [예제 프로젝트](https://github.com/gunkims/spring-example/tree/master/project-test)

# 전통적(?)인 테스트 방법

주변에 개발자들을 둘러보면 일상처럼 이런 방법으로 테스트를 하는데, 예를 들어 DAO를 작성하고 이를 테스트하기 위해 아래와 같은 방법으로 진행한다.

> DAO를 작성 > Service 인터페이스 작성 > Impl 클래스 생성 > 컨트롤러 생성 > 톰캣 서비스 구동 > 웹페이지에 url을 쳐보고 오류가 나는지 확인

어차피 개발자 입장에서는 결국에는 모두 작성해야 하는 코드들이지만, 이 방법은 DAO 하나를 테스트해보기 위해 쓸데없이 여러 클래스를 작성해야 하고, 매번 서비스를 올려서 직접 수동으로 테스트를 하기 때문에 시간이 오래 걸리는 데다 오류가 나더라도 그게 DAO 자체의 문제인지 아니면 컨트롤러, 서비스 클래스들을 생성하다가 실수를 한 것인지 확인해야 하기 때문에 DAO를 온전히 테스트를 하기 어렵다. 혹시나 자신은 이러한 방법으로 테스트를 하고 있진 않은지 생각해 보도록 하자.

# JUnit5로 테스트하기

지금부터는 사용자 테스트 방법이 아닌 개발자답게 JUnit5를 통한 단위 테스트하는 방법에 대해 알아보겠다.

아래와 같은 요구 사항이 있을 때는 나는 작은 단위부터 만들어서 큰 단위로 결합해나가는 식으로 개발을 한다. 보통 `DAO > Service > Controller` 정도로 이해하면 될 것 같다.

> 요구사항 : api 작성 : username을 받아 해당 유저 정보를 조회하는 API를 만들어라

## Repository(DAO) 테스트

```java
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByName(String name);
}
```

간단하게 이름을 받아 유저 엔티티를 조회하는 메소드를 작성해주었다. 이제 이를 테스트해보겠다.

```java
@ExtendWith(SpringExtension.class)
@SpringBootTest
public class UserRepositoryTests {
    @Autowired
    private UserRepository userRepository;

    @Test
    @DisplayName("이름으로 유저 정보 조회 테스트")
    public void findByNameTest() {
        //준비
        String name = "gunkim";
        int age = 22;
        userRepository.save(User.builder()
                .name(name)
                .age(age)
                .build());

        //실행
        User user = userRepository.findByName(name).get();

        //단언
        assertThat(user.getName(), is(equalTo(name)));
        assertThat(user.getAge(), is(equalTo(age)));
    }
}
```

JUnit으로 테스트를 준비(Arrange)-실행(Act)-단언(Assert) AAA 패턴이라고 불리는 형태로 작성을 한다. 이 방법은 테스트를 가시적이고 일관성 유지하기 용이하도록 해준다.
준비 단계에서는 테스트를 위한 값을 준비해 주었고, 실행 단계에서는 직접 테스트가 필요한 메소드를 실행해 주고, 단언 단계에서는 실제 실행되어 메소드로부터 반환된 값을 검증하게 된다. 만약 이 단계에서 반환값이 예상되는 값과 다를 경우 테스트가 실패하게 된다.

## Service 테스트

```java
@RequiredArgsConstructor
@Service
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;

    @Override
    public UserInfoResponseDto selectUserInfo(String name) throws IllegalArgumentException {
        User user = userRepository.findByName(name)
                .orElseThrow(() -> new IllegalArgumentException(name+": 유저를 찾지 못했습니다."));
        return new UserInfoResponseDto(user);
    }
}
```

JPA에서 엔티티는 테이블 그 자체라고 볼 수 있기 때문에 서비스 밖으로 가져갈 경우 어디서 변경이 될지 모르기 때문에 dto로 값만을 내보내 주도록 구현해 주었다.
Java 8 버전부터 지원해 주는 Optional을 잘 사용해 주면 깔끔한 코드와 Null 처리가 가능해진다.

```java
@ExtendWith(SpringExtension.class)
@SpringBootTest
public class UserServiceTests {
    @Autowired
    private UserService userService;
    @Autowired
    private UserRepository userRepository;

    @Test
    @DisplayName("이름으로 유저 정보 조회 테스트, entity -> dto 변환")
    public void selectUserInfo() {
        //준비
        String name = "gunkim";
        int age = 22;
        userRepository.save(User.builder()
                .name(name)
                .age(age)
                .build());

        //실행
        UserInfoResponseDto dto = userService.selectUserInfo(name);

        //단언
        assertThat(dto.getName(), is(equalTo(name)));
        assertThat(dto.getAge(), is(equalTo(age)));
    }
}
```

이전에 했던 Repository 테스트와 동일하게 테스트해주면 된다.

## Controller 테스트

```java
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/user")
public class UserController {
    private final UserService userService;

    @GetMapping
    public ResponseEntity<UserInfoResponseDto> getUserInfo(@RequestParam("username") String name) throws IllegalArgumentException {
        return ResponseEntity.ok(userService.selectUserInfo(name));
    }
}
```

이제 마지막으로 username을 파라미터로 받아서 해당 유저 정보를 반환하는 api를 작성해주었다.

```java
@ExtendWith(SpringExtension.class)
@SpringBootTest
@AutoConfigureMockMvc
public class UserControllerTests {
    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("/api/user 테스트")
    public void getUserInfoApiTest() throws Exception {
        //준비
        String name = "gunkim";
        int age = 22;
        userRepository.save(User.builder()
                .name(name)
                .age(age)
                .build());

        //실행
        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.get("/api/user")
                .param("username", name))
                .andExpect(status().isOk())
                .andDo(print())
                .andReturn();

        //단언
        UserInfoResponseDto dto = objectMapper.readValue(result.getResponse().getContentAsString(), UserInfoResponseDto.class);
        assertThat(dto.getName(), is(equalTo(name)));
        assertThat(dto.getAge(), is(equalTo(age)));
    }
}
```

mockMvc에서 지원해주는 andExpect메소드를 통해서 body값을 검증하는 방법도 있긴 하지만 일관성을 위해 Assert메소드를 통해 검증해주었다. 이렇게 해서 api 테스트까지 완료됐다.

# 끝으로

JUnit으로 여러가지 테스트 케이스를 작성해두게 되면 빌드 시에 미리 문제를 인지하고 수정할 수 있게 되어 오류 방지 측면에서 좋고, 개발 시에는 단위들을 테스트하여 그냥 개발하는 방법보다 더 빠르게 개발이 가능해지니 JUnit은 필수로 익혀두었으면 좋겠다.
