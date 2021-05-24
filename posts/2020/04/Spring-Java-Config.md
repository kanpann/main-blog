---
date: "2020-04-16"
title: 스프링을 자바로 설정하기
category: Spring
tag: [Spring]
image: https://user-images.githubusercontent.com/45007556/103328175-0e958b80-4a9b-11eb-9db7-66230e0f057c.png
---

스프링을 그 동안 xml위주로 설정하다가 스프링 부트처럼 java기반으로 설정하는 방법에 대해서 포스팅해보려고 한다.

# 설정을 자바로 하게 되면 좋은 점

클래스 기반이기 때문에 알아보기 편해서 가독성이 좋고, 자동완성이 되고, 디버깅하기 좋다는 장점이 있다.

# 설정 방법

## 필요없는 설정 파일을 삭제한다.

web.xml, servlet-context.xml, root-context.xml 설정을 자바로 대체할 것이기 때문에 이 세가지 파일을 삭제한다.

## pom.xml 수정

### 서블릿 api 의존성을 3.0 이상으로 변경한다.

```xml
<dependency>
  <groupId>javax.servlet</groupId>
  <artifactId>javax.servlet-api</artifactId>
  <version>3.0.1</version>
  <scope>provided</scope>
</dependency>
```

### 플러그인을 추가한다(xml을 사용하지 않겠다 설정)

```xml
<plugin>
  <groupId>org.apache.maven.plugins</groupId>
  <artifactId>maven-war-plugin</artifactId>
  <version>2.3</version>
  <configuration>
    <failOnMissingWebXml>false</failOnMissingWebXml>
  </configuration>
</plugin>
```

## 클래스 생성

```java
package com.gun.config;

import org.springframework.web.servlet.support.AbstractAnnotationConfigDispatcherServletInitializer;

public class WebConfig extends AbstractAnnotationConfigDispatcherServletInitializer{
	@Override
	protected Class<?>[] getRootConfigClasses() {
		// TODO Auto-generated method stub
		return new Class[] {RootConfig.class};
	}

	@Override
	protected Class<?>[] getServletConfigClasses() {
		// TODO Auto-generated method stub
		return new Class[] {ServletConfig.class};
	}

	@Override
	protected String[] getServletMappings() {
		// TODO Auto-generated method stub
		return new String[] { "/" };
	}
}
```

```java
package com.gun.config;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewResolverRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.view.InternalResourceViewResolver;
import org.springframework.web.servlet.view.JstlView;

@EnableWebMvc
public class ServletConfig implements WebMvcConfigurer{
	@Override
	public void configureViewResolvers(ViewResolverRegistry registry) {
		InternalResourceViewResolver bean = new InternalResourceViewResolver();
		bean.setViewClass(JstlView.class);
		bean.setPrefix("/WEB-INF/views/");
		bean.setSuffix(".jsp");
		registry.viewResolver(bean);
	}

	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
		registry.addResourceHandler("/resources/**").addResourceLocations("/resources/");
	}
}
```

```java
package com.gun.config;

import org.springframework.context.annotation.Configuration;

@Configuration
public class RootConfig {

}
```
