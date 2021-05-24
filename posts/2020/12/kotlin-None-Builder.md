---
date: "2020-12-24"
title: 코틀린에서 빌더 패턴이 필요없는 이유
category: Kotlin
image: https://user-images.githubusercontent.com/45007556/103047952-61210480-45d0-11eb-81e6-c7c7ffc8540a.png
tags: ["Java", "Kotlin"]
---

코틀린으로 스프링 기반 백엔드 개발을 할 때 Lombok을 통한 빌더 패턴을 사용하지 못해서 이것만 해결되면 진짜 좋을텐데... 하면서 사용하다가 코틀린에서는 굳이 빌더 패턴을 사용하지 않더라도 비슷하게 개발이 가능하단 것을 알게 되어서 정리해보려고 한다.

# 자바에서

```java
@ToString
@Getter
@Setter
public class User{
    private String name;
    private String email;
    private Integer age;

    @Builder
    public User(String name, String email, Integer age){
        this.name = name;
        this.email = email;
        this.age = age;
    }
}
```

```java
User user1 = User.builder()
    .name("gunkim")
    .email("gunkim0318@gmail.com")
    .age(10)
    .build();
User user2 = User.builder()
    .name("gunkim")
    .age(10)
    .build();
```

그 동안 자바에서 객체를 생성할 때 Lombok을 통해 자동으로 생성해주는 Builder를 통해 객체를 생성해왔었다.

# 코틀린에서

```java
class User(
    var name: String,
    var email: String?,
    var age: Int
)
```

```java
val user = User(
    name="gunkim",
    email="gunkim0318@gmail.com",
    age=10
)
```

위의 자바 코드를 코틀린 코드로 바꿔보면 이렇게 된다. 그런데 빌더 패턴을 사용하는 이유는 크게 두가지 때문이다.

1. 인자가 많을 경우 해당 인자가 어떤 것을 의미하는 지 확인하기 힘듦
2. 특정 인자만으로 생성해야 할 때가 있음(불필요 인자는 null 할당)

그런데 위의 코드로는 1번은 만족하지만, 2번은 만족하지 않는데 그건 아래와 같이 해결이 가능하다.

```java
class User(
    var name: String,
    var email: String?=null,
    var age: Int
)
```

```java
val user = User(
    name="gunkim",
    age=10
)
```

해당 컬럼에 기본값을 주게 되면 그 인자는 값을 할당해주지 않더라도 기본값이 들어가므로 생성 할 수 있게 된다.

# 끝으로

코틀린은 자바의 단점들을 거의다 해결해주는 것 같다. 무엇보다 크게 느끼는 점은 자바에 비해 코드가 짧다는 것인데, 이미 많은 알만한 기업들은 코틀린으로 개발을 많이 한다고 하지만, 아직은 자바가 많이 쓰이는 추세이다. 하지만 근미래에는 코틀린으로 모두 옮겨지지 않을까 생각한다.
