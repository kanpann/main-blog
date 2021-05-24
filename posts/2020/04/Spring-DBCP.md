---
date: "2020-04-16"
title: 스프링 HikariCP를 이용한 커넥션 풀 사용하기
category: Spring
tag: [Spring]
image: https://user-images.githubusercontent.com/45007556/103328175-0e958b80-4a9b-11eb-9db7-66230e0f057c.png
---

커넥션풀은 커넥션을 미리 만들어놨다가, 가져다 쓰기 위해 사용하는 녀석이다. 커넥션 풀 사용하는 방법에 대해서 포스팅하려고 한다.

# 커넥션 풀이란?

커넥션을 미리 만들어놨다가 필요할 때 저장해놨던 pool에서 꺼내서 쓰고, 다시 반납하는 기법을 말한다. 미리 만들어놨다가 사용하기 때문에 매번 사용자가 요청할 때마다 커넥션을 만들지 않아도 돼서 DB의 부하를 줄일 수 있다.

# 그럼 HikariCP란?

커넥션 풀 중에서 가장 유명하고 널리 쓰이며 가볍고, 빠르고, 신뢰성이 높다고 한다. 자세한 내용은 [여기](https://github.com/brettwooldridge/HikariCP)

# 설정 방법

## 의존성 주입

### maven

```xml
<dependency>
  <groupId>com.zaxxer</groupId>
  <artifactId>HikariCP</artifactId>
  <version>3.4.1</version>
</dependency>
```

### gradle

```java
compile group: 'com.zaxxer', name: 'HikariCP', version: '3.4.1'
```

maven과 gradle은 해당 의존성을 추가해주면 된다. 최신 버전은 [여기](https://mvnrepository.com/artifact/com.zaxxer/HikariCP)서 확인.

## 설정

### xml 설정 시

```xml
<bean id="hikariConfig" class="com.zaxxer.hikari.HikariConfig">
  <property name="driverClassName" value="jdbc설정"/>
  <property name="jdbcUrl" value="db주소"/>
  <property name="username" valu="아이디"/>
  <property name="password" value="비밀번호"/>
</bean>
<bean id="dataSource" class="com.zaxxer.hikari.HikariDataSource" destroy-method="close">
    <constructor-arg ref="hikariConfig"/>
</bean>
```

### java 설정 시

```java
@Bean
public DataSource dataSource(){
  HikariConfig config = new HikariConfig();
  config.setDriverClassName("jdbc설정");
  config.setJdbcUrl("db주소");
  config.setUsername("아이디");
  config.setPassword("비밀번호");

  HikariDataSource dataSource = new HikariDataSource(config);

  return dataSource;
}
```
