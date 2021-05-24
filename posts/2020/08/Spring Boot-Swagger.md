---
date: "2020-08-06"
title: 스프링 부트 스웨거(Swagger)를 이용하여 REST API문서 자동화하기
category: Spring
tag: [Spring Boot]
image: https://user-images.githubusercontent.com/45007556/91055366-86702700-e65f-11ea-828c-795ba0452b3e.png
---

API서버를 개발하다 보면, API에 대한 문서를 만드는 것도 일이고, API가 수정될 때마다 문서를 업데이트하는 것도 일인데, 이를 위해서 스웨거(Swagger)를 사용한다. 그래서 스웨거 설정 방법에 대해서 정리해보려고 한다.

# Swagger란?

![image](https://user-images.githubusercontent.com/45007556/91055366-86702700-e65f-11ea-828c-795ba0452b3e.png)

API 스펙을 명세, 관리할 수 있게 해주는 프로젝트이다.

매번 API가 수정될 때마다 문서를 수정하거나, 개발이 완료된 프로젝트를 스펙을 정리하고, 명세화하는 경우가 많다. 이런 어려움을 해결해주는 녀석이다.

# 의존성 추가

## gradle

```java
implementation group: 'io.springfox', name: 'springfox-swagger-ui', version: '2.9.2'
implementation group: 'io.springfox', name: 'springfox-swagger2', version: '2.9.2'
```

## maven

```xml
<dependency>
    <groupId>io.springfox</groupId>
    <artifactId>springfox-swagger-ui</artifactId>
    <version>2.9.2</version>
</dependency>
<dependency>
    <groupId>io.springfox</groupId>
    <artifactId>springfox-swagger2</artifactId>
    <version>2.9.2</version>
</dependency>
```

# 설정 클래스 작성

```java
package com.gun.app.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

/**
 * 스웨거 설정을 위한 클래스
 * @author gunkim
 */
@Configuration
@EnableSwagger2
public class SwaggerConfig {
    /**
     * 스웨거 API 문서 생성
     * @author gunkim
     * @return Docket
     */
    @Bean
    public Docket api() {
        return new Docket(DocumentationType.SWAGGER_2)
                .apiInfo(this.swaggerInfo()) //api 정보 등록
                .select()
                .apis(RequestHandlerSelectors.any())
                .build()
                .useDefaultResponseMessages(true);
    }

    /**
     * 스웨거 정보
     * @author gunkim
     * @return ApiInfo
     */
    private ApiInfo swaggerInfo(){
        return new ApiInfoBuilder()
                .title("할 일 리스트 API 문서") //문서 제목
                .description("할 일 리스트 프로젝트입니다.") //문서 설명
                .version("1.0.0") //버전
                .build();
    }
}
```

이런 식으로 API문서 설명을 적을 수도 있고, 컨트롤러마다 그룹을 지정하여 컨트롤러마다 설명을 기술해줄 수도 있다.

# 확인

[http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)

해당 경로에 들어가서 확인하면 이렇게 멋진 API 문서가 만들어져 있다. _설정에 따라 포트가 8080이 아닌 경우가 있음. 그런 경우는 알아서_

![image](https://user-images.githubusercontent.com/45007556/91055540-c0d9c400-e65f-11ea-8717-889157a001c3.png)

# 추가 작성하기

```java
package com.gun.app.web;

import com.gun.app.dto.TodoRequestDTO;
import com.gun.app.dto.TodoResponseDTO;
import com.gun.app.service.TodoService;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 할 일 API 컨트롤러
 * @author gunkim
 */
@Slf4j
@RequestMapping("/api/todo")
@RestController
@RequiredArgsConstructor
public class TodoController {
	//... 생략

    /**
     * 할 일 등록
     * @author gunkim
     * @param dto
     * @return resultMsg
     */
    @ApiOperation("할 일 등록")
    @ApiImplicitParams({
            @ApiImplicitParam(name="text", value="내용", dataType = "string"),
            @ApiImplicitParam(name="isCheck", value="체크여부", dataType = "boolean")
    })
    @PostMapping("")
    public ResponseEntity<String> createTodo(@RequestBody TodoRequestDTO dto){
        try{
            todoService.createTodo(dto);
        }catch(IllegalArgumentException e){
            return new ResponseEntity<>("FAILURE", HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
    }
}
```

주요 어노테이션

- @ApiImplicitParam - 파라미터 정보를 기술할 수 있다.
- @ApiImplicitParams - 파라미터가 여러개일 경우 감싸주면 된다.
- @ApiOperation - 해당 API 설명을 기술해주면 된다.
- @ApiModelProperty - 필드 변수에 대한 설명을 기술할 경우 사용한다.
- @ApiResponse - 응답 코드에 대한 설명을 기술할 경우 사용한다.
- @ApiModelProperty - Model 프로퍼티 설명을 기술할 경우 사용한다.

## 추가 작성 내용 확인

![image](https://user-images.githubusercontent.com/45007556/91055574-cdf6b300-e65f-11ea-80ea-6ceca6e0bd05.png)

# 스웨거를 이용한 API 테스트

![image](https://user-images.githubusercontent.com/45007556/91055593-d6e78480-e65f-11ea-82e4-10c259161360.png)
![image](https://user-images.githubusercontent.com/45007556/91055600-d9e27500-e65f-11ea-9bbd-4bf1fa8def1d.png)
![image](https://user-images.githubusercontent.com/45007556/91055603-dc44cf00-e65f-11ea-9cfc-fd8acfb0b48c.png)

Try it out 버튼을 클릭 후 나타나는 Execute버튼을 클릭하여 테스트 실행 후 결과 확인
