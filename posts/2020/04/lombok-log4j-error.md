---
date: "2020-04-16"
title: 스프링 메이븐에서 @Log4j 사용 시 오류
category: 문제 해결
tag: [Spring]
image: https://user-images.githubusercontent.com/45007556/91044098-b31c4280-e64f-11ea-9d85-4c4c7366a3a9.png
---

# 문제

프로젝트 생성 과정에서 원인을 알 수 없는 에러. 아래는 에러 내용.

```
Multiple markers at this line
org.apache.log4j cannot be resolved to a type
org.apache.log4j.Logger cannot be resolved to a type
```

![image](https://user-images.githubusercontent.com/45007556/91044098-b31c4280-e64f-11ea-9d85-4c4c7366a3a9.png)

# 해결 방법

pom.xml 내에 log4j에 대한 해당 의존성을 변경해주게 되면 해결된다.

## **_변경 전_**

```xml
<dependency>
	<groupId>log4j</groupId>
	<artifactId>log4j</artifactId>
	<version>1.2.16</version>
	<exclusions>
		<exclusion>
			<groupId>javax.mail</groupId>
			<artifactId>mail</artifactId>
		</exclusion>
		<exclusion>
			<groupId>javax.jms</groupId>
			<artifactId>jms</artifactId>
		</exclusion>
		<exclusion>
			<groupId>com.sun.jdmk</groupId>
			<artifactId>jmxtools</artifactId>
		</exclusion>
		<exclusion>
			<groupId>com.sun.jmx</groupId>
			<artifactId>jmxri</artifactId>
		</exclusion>
	</exclusions>
	<scope>runtime</scope>
</dependency>
```

## _**변경 후**_

```xml
<dependency>
    <groupId>log4j</groupId>
    <artifactId>log4j</artifactId>
    <version>1.2.17</version>
</dependency>
```
