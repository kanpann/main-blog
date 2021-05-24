---
date: "2020-04-16"
title: 인텔리제이 Lombok 사용 시 Gradle Build 에러
category: 문제 해결
tag: [Spring, Spring Boot]
image: https://user-images.githubusercontent.com/45007556/91044839-e7443300-e650-11ea-8fab-4558843075ed.png
---

# 문제

```
error: cannot find symbol
        log.info("Test");
        ^
symbol:   variable log
location: class HomeController

```

# 해결 방법

## Annotation Processors > Enable annotation processing 체크

![image](https://user-images.githubusercontent.com/45007556/91044839-e7443300-e650-11ea-8fab-4558843075ed.png)

## 의존성 주입

```java
annotationProcessor("org.projectlombok:lombok")
compileOnly("org.projectlombok:lombok")
```

어노테이션의 전처리가 가능하도록 설정을 해주어야 한다고 한다.[참고](https://stackoverflow.com/questions/52547965/gradle-build-fails-from-terminal-for-lombok-annotation-in-spring-boot-applicatio)

그러기 위해 annotationProcessor를 선언하여 스캔 처리를 할 수 있도록 추가해주었다.
