---
date: '2021-07-28'
title: 'JPA Auditing 적용하기(공통 요소 자동화하기)'
category: Java
image: https://user-images.githubusercontent.com/45007556/103327917-04bf5880-4a9a-11eb-8610-c88a74f619bc.png
tags: [Java, Jpa]
---
이번엔 JPA를 사용하면서 가장 편하다고 생각하는 Auditing라는 기능의 사용 방법에 대해서 정리해보려고 한다.

# 주요 어노테이션
자동화할 수 있는 요소는 생성시간, 수정시간, 생성한 사람, 수정한 사람에 대한 정보인데 관련 어노테이션을 먼저 알아보면.
- @MappedSuperclass - JPA Entity 클래스들이 해당 추상 클래스를 상속할 경우 추상 클래스 필드를 컬럼으로 인식하도록 함.
- @EntityListeners(AuditingEntityListener.class - 해당 클래스에 Auditing 기능을 포함
- @CreatedDate - Entity가 생성되어 저장될 때 시간이 자동 저장
- @LastModifiedDate - 조회한 Entity의 값을 변경할 때 시간이 자동 저장
- @EnableJpaAuditing - Auditing 활성화

# Auditing란?
도메인을 디자인하다 보면 꼭 공통되는 요소들이 있는데 바로 누가 언제 했는지 등에 대한 기록을 남기는 컬럼들이 있다. 이러한 컬럼들은 도메인마다 어쩔 수 없이 중복이 될 수밖에 없는데, Auditing 기능을 사용하게 되면 이 컬럼들을 자동화시킬 수 있게 된다.

# Auditing가 값을 채워주는 시점
```java
@Configurable
public class AuditingEntityListener {
	private @Nullable ObjectFactory<AuditingHandler> handler;

	public void setAuditingHandler(ObjectFactory<AuditingHandler> auditingHandler) {

		Assert.notNull(auditingHandler, "AuditingHandler must not be null!");
		this.handler = auditingHandler;
	}
	@PrePersist
	public void touchForCreate(Object target) {

		Assert.notNull(target, "Entity must not be null!");

		if (handler != null) {

			AuditingHandler object = handler.getObject();
			if (object != null) {
				object.markCreated(target);
			}
		}
	}
	@PreUpdate
	public void touchForUpdate(Object target) {

		Assert.notNull(target, "Entity must not be null!");

		if (handler != null) {

			AuditingHandler object = handler.getObject();
			if (object != null) {
				object.markModified(target);
			}
		}
	}
}
```
Auditing는 값을 언제 채워주는 걸까? 라는 궁금증에 찾아보았는데 AuditingEntityListener라는 녀석을 살펴보면 알 수 있다.
AuditingEntityListener는 Spring Data Jpa가 구현한 EntityListener로 `@PrePersist` `@PreUpdate` 어노테이션을 통해 저장, 수정 등을 엔티티가 영속화되기 전에 값을 채워준다.


# build.gradle 의존성 추가
```gradle
dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-data-jpa'
    implementation 'org.springframework.boot:spring-boot-starter-web'
    compileOnly 'org.projectlombok:lombok'
    runtimeOnly 'com.h2database:h2'
}
```

# 생성시간, 수정시간 자동화
## BaseEntity.java
```java
@Getter
@ToString
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public class BaseEntity {
    @CreatedDate
    private LocalDateTime createdDate;
    @LastModifiedDate
    private LocalDateTime modifiedDate;
}
```
해당 필드들이 컬럼으로 인식될 수 있도록 `@MappedSuperclass`와 Auditing 적용을 위한 `@EntityListeners`을 작성해 주었고, 각각 생성시간, 수정시간 필드에 `@CreatedDate`, `@LastModifiedDate` 어노테이션을 붙여주었다.
## Posts.java
```java
@Getter
@ToString(callSuper = true)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
public class Posts extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    private String title;

    @NotNull
    private String contents;

    @Builder
    public Posts(Long id, @NotNull String title, @NotNull String contents) {
        this.id = id;
        this.title = title;
        this.contents = contents;
    }
}
```
Auditing 테스트를 위한 엔티티를 작성해 주었다. 만들었던 BaseEntity를 상속만 받아주면 Posts 엔티티에서는 Auditing를 사용할 준비는 끝이다.
## Application.java
```java
@EnableJpaAuditing
@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```
마지막으로 Application에 `@EnableJpaAuditing` 어노테이션을 붙여주어 Auditing를 활성화해주게 되면 간단하게 설정이 끝난다.
## 테스트 코드 작성
```java
@Slf4j
@ExtendWith(SpringExtension.class)
@SpringBootTest
public class PostsRepositoryTests {
    @Autowired
    private PostsRepository postsRepository;
    @Autowired
    private MemberRepository memberRepository;

    private static final String USERNAME = "gunkim";

    @Test
    @DisplayName("게시글 입력 테스트")
    public void saveTest() {
        postsRepository.save(Posts.builder()
                .title("첫 게시글입니다.")
                .contents("게시글 내용입니다.")
                .build());

        Posts posts = postsRepository.findAll().get(0);
        log.info("POSTS : "+posts);
        
        assertThat(posts.getTitle()).isEqualTo("첫 게시글입니다.");
        assertThat(posts.getContents()).isEqualTo("게시글 내용입니다.");
    }
}
```
## 확인
![image](https://user-images.githubusercontent.com/45007556/127148456-00a754a7-2a06-4115-8ef1-478ef42a1f8f.png)
테스트 코드를 실행하면 테스트가 성공하는 것과 생성일자, 수정일자가 자동으로 채워진 것을 확인할 수 있다.

# 생성자, 수정자 자동화
보통 생성자, 수정자는 DB에 insert나 update를 하는 사람의 아이디를 넣는 경우가 많은데, 스프링의 경우 시큐리티를 통해 아이디를 가져오는 식으로 구현한다. 그래서 이 부분도 자동화가 가능한데 그 방법에 대해 알아보려고 한다.

## build.gradle
```gradle
dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-security'
    testImplementation 'org.springframework.security:spring-security-test'
}
```
스프링 시큐리티 환경에서 테스트를 위한 시큐리티 의존성을 추가해 준다.

## Member.java
```java
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
@ToString
public class Member {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotNull
    private String username;
    @NotNull
    private String password;
    @NotNull
    private Integer age;

    @Builder
    public Member(Long id, @NotNull String username, @NotNull String password, @NotNull Integer age) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.age = age;
    }
}
```
이번엔 테스트를 위해 유저 엔티티가 필요하기 때문에 정의해 주었다.

## BaseEntity.java
```java
@Getter
@ToString
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public class BaseEntity {
    @CreatedDate
    private LocalDateTime createdDate;
    @LastModifiedDate
    private LocalDateTime modifiedDate;
    @CreatedBy
    @ManyToOne
    private Member createdMember;
    @LastModifiedBy
    @ManyToOne
    private Member modifiedMember;
}
```
아까 만들었던 BaseEntity에서 다대일의 연관관계를 맺는 createdMember, modifiedMember 엔티티를 추가해 주었다. `@CreatedBy`,  `@LastModifiedBy` 어노테이션에 의해 값이 들어가게 될 것이다.

## UserAwareAudit.java
```java
@Component
@RequiredArgsConstructor
public class UserAwareAudit implements AuditorAware<Member> {
    private final MemberRepository memberRepository;

    @NotNull
    @Override
    public Optional<Member> getCurrentAuditor() {
        Authentication authentication = Optional.ofNullable(SecurityContextHolder.getContext().getAuthentication())
                .orElseThrow(() -> new BadCredentialsException("로그인되지 않았습니다."));
        if (!authentication.isAuthenticated()) {
            return Optional.empty();
        }

        User user = (User) authentication.getPrincipal();
        return memberRepository.findByUsername(user.getUsername());
    }
}
```
시간의 경우 아무런 커스텀 없이 자동으로 해주었지만, 이번에는 값 매핑을 위한 클래스를 작성해 주어야 한다. UserAwareAudit는 스프링 시큐리티에서 인증 정보를 꺼내어 멤버 엔티티를 조회 후 리턴해주게 되는데 이 값이 createdMember, modifiedMember에 들어가게 된다.
이 부분은 자유롭게 커스텀이 가능하기 때문에 커스텀 해서 사용해도 된다.

## 테스트 코드 작성
```java
@Slf4j
@ExtendWith(SpringExtension.class)
@SpringBootTest
public class PostsRepositoryTests {
    @Autowired
    private PostsRepository postsRepository;
    @Autowired
    private MemberRepository memberRepository;

    private static final String USERNAME = "gunkim";

    @BeforeEach
    public void createUser() {
        memberRepository.save(Member.builder()
                .username(USERNAME)
                .password("gunkim")
                .age(22)
                .build());
    }

    @Test
    @DisplayName("게시글 입력 테스트")
    @WithMockUser(username = USERNAME)
    public void saveTest() {
        postsRepository.save(Posts.builder()
                .title("첫 게시글입니다.")
                .contents("게시글 내용입니다.")
                .build());

        Posts posts = postsRepository.findAll().get(0);
        log.info("POSTS : "+posts);

        assertThat(posts.getTitle()).isEqualTo("첫 게시글입니다.");
        assertThat(posts.getContents()).isEqualTo("게시글 내용입니다.");
        assertThat(posts.getCreatedMember().getUsername()).isEqualTo(USERNAME);
        assertThat(posts.getModifiedMember().getUsername()).isEqualTo(USERNAME);
    }
}
```
아까 작성했던 테스트 코드에 Member 엔티티 입력과 시큐리티 테스트를 위한 `@WithMockUser` 어노테이션, 그리고 마지막으로 검증을 하는 코드를 추가해 주었다. `@WithMockUser` 어노테이션은 시큐리티 로그인한 것과 같은 상태에서 테스트를 하게 해준다.

## 확인
![image](https://user-images.githubusercontent.com/45007556/127164870-21e6c42e-0984-4bf6-9b4d-b394d6b56520.png)
정상적으로 생성한 회원, 수정한 회원의 정보가 자동으로 들어가는 것을 확인할 수 있다.