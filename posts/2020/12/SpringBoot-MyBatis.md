---
date: "2020-12-25"
title: 스프링 부트에서 Mysql 및 마이바티스를 설정하는 법
category: Spring
image: https://user-images.githubusercontent.com/45007556/103108226-2fb83f80-4689-11eb-8b48-e44e8c043605.png
tags: ["Spring Boot"]
---

한동안 JPA만 사용해오다가 오랜만에 MyBatis를 사용할 일이 생겨서 설정했던 설정 방법에 대해서 정리해보려고 한다. 그런데 스프링 부트는 워낙 설정이 간편해서 MyBatis 같은 경우는 설정이 정말 매우 간단하다. [예제 프로젝트](https://github.com/gunkim0318/SpringBoot-Mysql-MyBatis-Logback-Sample/tree/mysql-mybatis)

# 의존성을 추가하기

Maven을 사용할 경우 pom.xml에 Gradle을 사용할 경우 build.gradle에 의존성을 추가해주면 된다.

## Maven

```xml
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <version>8.0.22</version>
</dependency>
<dependency>
    <groupId>org.mybatis.spring.boot</groupId>
    <artifactId>mybatis-spring-boot-starter</artifactId>
    <version>2.1.4</version>
</dependency>
```

## Gradle

```java
implementation group: 'org.mybatis.spring.boot', name: 'mybatis-spring-boot-starter', version: '2.1.4'
implementation group: 'mysql', name: 'mysql-connector-java', version: '8.0.22'
```

# Mysql 설정 및 테스트

## 설정하기

프로젝트를 방금 생성했으면 application.yml이 없고, application.properties가 있을텐데 이 파일 확장자를 yml로 바꿔주자. 아니면 아래 내용을 properties형식으로 변환해서 작성해줘도 된다.
스키마명에는 본인의 스키마명을 적거나 없을 경우 빼도 상관 없다.  
**_main/resources/application.yml에 작성하기_**

```yml
spring:
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://127.0.0.1:3306/{스키마명}?serverTimezone=UTC&useUnicode=true&characterEncoding=utf8&useSSL=false
    username: # 계정명
    password: # 패스워드
```

## 테스트코드 작성하기

**_/src/test/com/sample/app/db/ConnectionTests.java_**

```java
@Slf4j
@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest
public class ConnectionTests {
    @Autowired
    private SqlSessionFactory sqlSessionFactory;

    @Test
    public void 커넥션_테스트(){
        try(Connection con = sqlSessionFactory.openSession().getConnection()){
            log.info("커넥션 성공!");
        }catch(Exception e){
            e.printStackTrace();
        }
    }
}
```

해당 테스트가 성공하면 mysql 설정에 이상이 없는 것이고, 오류가 날 경우 설정을 확인해주자.
_@Slf4j어노테이션은 Lombok 설정이 안돼있을 경우 제외해주자. log.info는 System.out.println()으로 바꾸어 주어야 함_

## 테스트 결과

![image](https://user-images.githubusercontent.com/45007556/103111732-80cd3100-4693-11eb-8020-271e64545afd.png)

# MyBatis 설정 및 테스트

## 설정하기

**_/src/main/com/sample/app/config/MyBatisConfig.java_**

```java
@RequiredArgsConstructor
@Configuration
public class MyBatisConfig {
    private final ApplicationContext appCtx;

    @Bean
    public SqlSessionFactory sqlSessionFactory(DataSource dataSource) throws Exception {
        SqlSessionFactoryBean sqlSessionFactoryBean = new SqlSessionFactoryBean();
        sqlSessionFactoryBean.setDataSource(dataSource);
        sqlSessionFactoryBean.setMapperLocations(appCtx.getResources("classpath:/mapper/*.xml"));
        return sqlSessionFactoryBean.getObject();
    }

    @Bean
    public SqlSessionTemplate sqlSessionTemplate(SqlSessionFactory sqlSessionFactory) {
        return new SqlSessionTemplate(sqlSessionFactory);
    }
}
```

## 테스트를 위한 XML을 생성하기

classpath 경로에 mapper 폴더 생성 후 test.xml 파일을 만들어 준다.
**_/src/main/resources/mapper/test.xml_**

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "mybatis-3-mapper.dtd">

<mapper namespace="test">
    <select id="selectTest" resultType="string">
        SELECT now()
        FROM dual
    </select>
</mapper>
```

## 테스트하기

**_/src/test/com/sample/app/db/ConnectionTests.java_**

```java
@Slf4j
@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest
public class ConnectionTests {
    @Autowired
    private SqlSessionFactory sqlSessionFactory;

    //...
    @Test
    public void 매퍼_테스트(){
        try(SqlSession sqlSession = sqlSessionFactory.openSession()){
            String sysdate = sqlSession.selectOne("test.selectTest");
            log.info(sysdate);
        }catch(Exception e){
            e.printStackTrace();
        }
    }
}
```

# 마지막으로 DAO를 만들어 보기

위에서 테스트를 모두 마쳤기 때문에 한번 마지막으로 DAO를 만들어 보자.  
**_/src/main/com/sample/app/dao/TestDao.java_**

```java
@RequiredArgsConstructor
@Repository
public class TestDao {
    private final static String NAMESPACE = "test";

    private final SqlSession sqlSession;

    public String selectTest(){
        return sqlSession.selectOne(NAMESPACE+".selectTest");
    }
}
```

## 테스트하기

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
