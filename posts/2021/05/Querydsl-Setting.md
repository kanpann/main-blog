---
date: '2021-05-14'
title: 스프링 부트 Jpa Querydsl 설정 방법 정리
category: Spring
image: https://user-images.githubusercontent.com/45007556/117846103-17556400-b2bc-11eb-956f-238aab69a167.png
tags: [Spring, Spring Boot, Jpa, Querydsl]
---

그동안 간간히 Querydsl을 설정할 일이 있을 때마다 인터넷을 찾아보곤 했는데 매번 찾아보기 번거로워서 이번 기회에 Spring Boot+Jpa+Gradle 프로젝트에서 Querydsl 설정하는 방법을 정리해보려고 한다.

해당 게시글의 설정 방법은 Gradle 5.0 이상, IntelliJ 2020.x 이상을 기준으로 한다. 이 포스팅에서 사용되는 소스는 [여기](https://github.com/gunkims/spring-example/tree/master/jpa-querydsl-setting)에서 볼 수 있다.

# 환경

- Spring Boot 2.4.5
- Gradle 6.8.3
- IntelliJ 2021.1.1

# build.gradle 작성

## 빌드 스크립트 의존성 추가

최상단에 buildscript를 아래와 같이 작성해 준다.

- buildscript란? gradle로 task를 수행할 때에 사용되는 소스의 컴파일과 무관한 설정이다. Gradle 빌드 스크립트 자체를 위한 의존성이나 변수, Task, Plugin 등을 지정하기 위해 사용한다.

```java
buildscript {
    ext {
        springBootVersion = '2.4.5'
        querydslPluginVersion = '1.0.10'
    }
    repositories {
        mavenCentral()
        maven { url "https://plugins.gradle.org/m2/" }
    }
    dependencies {
        classpath("org.springframework.boot:spring-boot-gradle-plugin:${springBootVersion}")
        classpath("gradle.plugin.com.ewerk.gradle.plugins:querydsl-plugin:${querydslPluginVersion}")
    }
}
```

## 플러그인 추가

기본적인 플러그인들을 추가해준다.

```java
plugins{
	id 'org.springframework.boot' version '2.4.5' apply true
	id 'io.spring.dependency-management' version '1.0.10.RELEASE'
  id 'java'
  id 'eclipse'
}
```

## 의존성 추가

아래의 의존성들을 추가해준 dependencies 안에 추가해준다.

```java
dependencies {
	implementation group: 'org.springframework.boot', name: 'spring-boot-starter-data-jpa'
	compile group: 'com.querydsl', name: 'querydsl-core'
	compile group: 'com.querydsl', name: 'querydsl-jpa'
	annotationProcessor group: 'com.querydsl', name: 'querydsl-apt', version: "${dependencyManagement.importedProperties['querydsl.version']}", classifier: 'jpa'
	annotationProcessor group: 'jakarta.persistence', name: 'jakarta.persistence-api'
	annotationProcessor group: 'jakarta.annotation', name: 'jakarta.annotation-api'
}
```

## Q클래스 생성 경로 설정

```java
def generated = "src/main/generated"

sourceSets {
    main.java.srcDirs += [ generated ]
}

tasks.withType(JavaCompile) {
    options.annotationProcessorGeneratedSourcesDirectory = file(generated)
}

clean.doLast {
    file(generated).deleteDir()
}
```

## Gradle 프로젝트 리로드

위에 설정이 모두 끝났으면 Gradle 프로젝트를 리로드 해주면 설정은 끝난다.

![Untitled](https://user-images.githubusercontent.com/45007556/118149202-4c90bc00-b44c-11eb-9cda-b0ddad6dbb28.png)

# Q클래스 생성

JPA 엔티티 클래스가 Querydsl에 대응하도록 QClass를 생성해 주어야 한다.

Gradle 탭>Tasks>other>compileJava 를 더블클릭해주게 되면 QClass가 build.gradle에 설정한 경로에 생성되게 된다.(기존에 JPA 엔티티를 생성되어 있어야 Q 클래스가 생성됨)

<img width="536" alt="이미지2" src="https://user-images.githubusercontent.com/45007556/117846103-17556400-b2bc-11eb-956f-238aab69a167.png">
<br/>
<img width="316" alt="이미지3" src="https://user-images.githubusercontent.com/45007556/117846111-19b7be00-b2bc-11eb-8224-77ce3ab9768f.png">

# Querydsl 설정

Querydsl 사용을 위한 설정 코드를 작성해준다.

```java
@Configuration
public class QuerydslConfig {
    @PersistenceContext
    private EntityManager entityManager;

    @Bean
    public JPAQueryFactory jpaQueryFactory() {
        return new JPAQueryFactory(entityManager);
    }
}
```

# 참고

[https://jojoldu.tistory.com/372](https://jojoldu.tistory.com/372)
