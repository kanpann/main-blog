---
date: "2020-12-27"
title: 스프링 부트에서 logback 설정하기
category: Spring
tags: ["Spring Boot"]
image: https://user-images.githubusercontent.com/45007556/103150641-815fe780-47b9-11eb-955d-9c2ba03264a8.png
---

스프링 부트에 마이바티스를 설정하면서 로그를 이쁘게 찍으려고 logback 설정했던 방법에 대해서 정리하려고 한다.

# 예제 프로젝트 다운로드

git bash가 깔려 있다면 아래 명령어를 사용해 logback 설정해볼 [예제 프로젝트](https://github.com/gunkim0318/SpringBoot-Mysql-MyBatis-Logback-Sample/tree/mysql-mybatis)를 받아주자. 만약 이미 프로젝트가 있다면 생략해도 된다.

```bash
git clone -b mysql-mybatis --single-branch https://github.com/gunkim0318/SpringBoot-Mysql-MyBatis-Logback-Sample.git
```

# 의존성 추가하기

logback 설정을 위한 의존성을 추가해주어야 한다. 예제 프로젝트를 받았다면 Gradle프로젝트이기 때문에 Gradle 의존성을 추가해주자.

## Maven

```xml
<dependency>
    <groupId>org.bgee.log4jdbc-log4j2</groupId>
    <artifactId>log4jdbc-log4j2-jdbc4.1</artifactId>
    <version>1.16</version>
</dependency>
```

## Gradle

```java
implementation group: 'org.bgee.log4jdbc-log4j2', name: 'log4jdbc-log4j2-jdbc4.1', version: '1.16'
```

# 파일 생성하기

**/src/main/resources/** 경로에 파일 두개를 생성해주자.

## _log4jdbc.log4j2.properties_

```properties
log4jdbc.spylogdelegator.name=net.sf.log4jdbc.log.slf4j.Slf4jSpyLogDelegator
log4jdbc.dump.sql.maxlinelength=0
```

## _logback-spring.xml_

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <!--로그 파일 저장 위치-->
    <property name="LOGS_PATH" value="./logs"/>

    <appender name="STDOUT" class="ch.qos.logback.core.ConsoleAppender">
        <layout class="ch.qos.logback.classic.PatternLayout">
            <Pattern>%d{HH:mm} %-5level %logger{36} - %msg%n</Pattern>
        </layout>
    </appender>
    <appender name="DAILY_ROLLING_FILE_APPENDER" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <file>${LOGS_PATH}/logback.log</file>
        <encoder>
            <pattern>[%d{yyyy-MM-dd HH:mm:ss}:%-3relative][%thread] %-5level %logger{35} - %msg%n</pattern>
        </encoder>
        <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
            <fileNamePattern>${LOGS_PATH}/logback.%d{yyyy-MM-dd}.%i.log.gz</fileNamePattern>
            <timeBasedFileNamingAndTriggeringPolicy class="ch.qos.logback.core.rolling.SizeAndTimeBasedFNATP">
                <!-- or whenever the file size reaches 100MB -->
                <maxFileSize>5MB</maxFileSize>
                <!-- kb, mb, gb -->
            </timeBasedFileNamingAndTriggeringPolicy>
            <maxHistory>30</maxHistory>
        </rollingPolicy>
    </appender>

    <logger name="com.nextday.gateway" level="INFO">
        <appender-ref ref="DAILY_ROLLING_FILE_APPENDER" />
    </logger>
    <root level="INFO">
        <appender-ref ref="STDOUT" />
    </root>

    <logger name="jdbc" level="OFF"/>
    <logger name="jdbc.sqlonly" level="OFF"/>
    <logger name="jdbc.sqltiming" level="DEBUG"/>
    <logger name="jdbc.audit" level="OFF"/>
    <logger name="jdbc.resultset" level="OFF"/>
    <logger name="jdbc.resultsettable" level="DEBUG"/>
    <logger name="jdbc.connection" level="OFF"/>
</configuration>
```

# logback 관련 설정하기

```yml
spring:
  datasource:
    url: jdbc:log4jdbc:mariadb://{주소}:{포트}/{디비명}
    driver-class-name: net.sf.log4jdbc.sql.jdbcapi.DriverSpy
    username: # 아이디
    password: # 비밀번호
```

url을 `jdbc:log4jdbc~`로 변경해주고, 드라이버 이름을 `net.sf.log4jdbc.sql.jdbcapi.DriverSpy`로 변경해주면 된다.

# 결과 확인하기

해당 테스트를 실행해보면 쿼리 결과가 보기 좋게 콘솔에 찍히는 것을 확인할 수 있다.
**_/src/test/com/sample/app/dao/TestDaoTest.java_**

```java
@Slf4j
@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest
public class TestDaoTest {
    @Autowired
    private TestDao dao;

    @Test
    public void dao_테스트(){
        log.info(dao.selectTest());
    }
}
```

![이미지](https://user-images.githubusercontent.com/45007556/103171389-32848180-488f-11eb-85c5-e0144ebf6a28.png)
