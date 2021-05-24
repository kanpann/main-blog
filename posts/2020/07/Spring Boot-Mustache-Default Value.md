---
date: "2020-07-02"
title: 스프링 부트 - Mustache 기본 값 지정하기
category: Spring
tag: [Spring Boot, Mustache]
image: https://user-images.githubusercontent.com/45007556/91050518-bd433e80-e659-11ea-883c-35c397a8a260.png
---

{% raw %}
Mustache를 더 잘쓰고 싶어서 Mustache 관련 사이트를 뒤지던 중 원하던 기능을 발견해서 정리해보려고 한다.

우선 Mustache에서 이렇게 사용할 때만약 값이 없을 경우 아래처럼 메소드 또는 필드가 없다는 에러가 발생한다.

```
{{member}}
```

```
com.samskivert.mustache.MustacheException$Context: No method or field with name 'member' on line 9 at com.samskivert.mustache.Template.checkForMissing(Template.java:344) ~\[jmustache-1.15.jar:na\] at com.samskivert.mustache.Template.getValue(Template.java:247) ~\[jmustache-1.15.jar:na\] at com.samskivert.mustache.Template.getCompoundValue(Template.java:260) ~\[jmustache-1.15.jar:na\] at com.samskivert.mustache.Template.getValue(Template.java:244) ~\[jmustache-1.15.jar:na\] at com.samskivert.mustache.Template.getValueOrDefault(Template.java:292) ~\[jmustache-1.15.jar:na\] at com.samskivert.mustache.Mustache$VariableSegment.execute(Mustache.java:872) ~\[jmustache-1.15.jar:na\] at com.samskivert.mustache.Template.executeSegs(Template.java:170) ~\[jmustache-1.15.jar:na\] at com.samskivert.mustache.Template.execute(Template.java:137) ~\[jmustache-1.15.jar:na\]
```

그래서 항상 Mustache를 사용할 때는 해당 상황에 대한 처리를 위해 아래처럼 없을 경우에 대비해주었다.

```java
{{#member}}{{member}}{{/member}}
```

- {{#변수}} - 해당 값이 존재할 경우 true로 안에 내용을 처리한다.

# 해결법

아래와 같이 값이 없을 경우에 대비한 기본 값을 지정해주면 된다.
값이 없을 경우 오류만 안 나게 해야겠다 싶어서 기본값을 ""로 주었다.

```java
@Configuration
public class MustacheConfig {
    @Bean
    public Mustache.Compiler mustacheCompiler(Mustache.TemplateLoader templateLoader, Environment environment) {
        String defaultValue = "";

        MustacheEnvironmentCollector collector = new MustacheEnvironmentCollector();
        collector.setEnvironment(environment);

        return Mustache.compiler()
                .defaultValue(defaultValue)
                .withLoader(templateLoader)
                .withCollector(collector);
    }
}
```

{% endraw %}

# 참고

[www.baeldung.com](https://www.baeldung.com/spring-boot-mustache)
