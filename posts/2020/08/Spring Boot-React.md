---
date: "2020-08-19"
title: 스프링 부트(Spring Boot)+리액트(React) 함께 빌드하기
category: Spring
tag: [Spring Boot, React]
image: https://user-images.githubusercontent.com/45007556/91056894-7d805500-e661-11ea-994d-e8a0f3cb16b9.png
---

항상 스프링 부트+리액트 개발할 때 스프링 부트 서버(8080) 실행하고, 리액트 서버(3000)을 실행해서 프록시 설정을 통해 통신을 했었는데, 항상 두번씩 실행해야 해서 번거롭기도 해서 한번에 빌드하는 방법을 정리해보려고 한다. [예제 프로젝트](https://github.com/gunkim0318/springboot-react-example)

# 개발 환경

> Java 1.8  
> Spring Boot 2.2.4  
> NodeJs 14.2.0  
> React 16.13.1

# 사전 준비

해당 이미지와 같이 스프링 부트 프로젝트를 생성하고 root 디렉토리에 frontend폴더를 만들어서 my-app이라는 이름의 리액트 프로젝트를 생성해주자.

![image](https://user-images.githubusercontent.com/45007556/91056894-7d805500-e661-11ea-994d-e8a0f3cb16b9.png)

# 그래들(Gradle) build.gradle 수정해주기

## 전체 스크립트

```java
buildscript {
    ext {
        springBootVersion = '2.2.4.RELEASE'
        dependencyManagementVersion = '1.0.10.RELEASE'
        mooworkNodeVersion = "1.3.1"
    }
    repositories {
        mavenCentral()
    }
    dependencies {
        classpath("org.springframework.boot:spring-boot-gradle-plugin:${springBootVersion}")
    }
}
plugins {
    id "com.moowork.node" version "${mooworkNodeVersion}"
    id "java"
    id "org.springframework.boot" version "${springBootVersion}"
    id "io.spring.dependency-management" version "${dependencyManagementVersion}"
}
group = 'com.gun'
version = '0.0.1'
sourceCompatibility = '1.8'

repositories {
    mavenCentral()
}

dependencies {
    testImplementation group: 'org.springframework.boot', name: 'spring-boot-starter-test'
    implementation group: 'org.springframework.boot', name: 'spring-boot-starter-web'
}

test {
    useJUnitPlatform()
}
//리액트 프로젝트 경로
//$projectDir은 스프링 부트 root 경로
def webappDir = "$projectDir/frontend/my-app"

task appNpmInstall(type: NpmTask) {
    workingDir = file("${webappDir}")
    args = ["run", "build"]
}
task copyWebApp(type: Copy) {
    from 'frontend/my-app/build'
    into "build/resources/main/static"
}
copyWebApp.dependsOn(appNpmInstall)
compileJava.dependsOn(copyWebApp)
```

## 주요 스크립트

gradle에서 Node 빌드를 하기 위한 플러그인 "com.moowork.node"을 추가해주었다.

그리고 gradle 빌드 시 리액트 프로젝트 경로에서 "npm run bulid" 명령어가 실행되어 리액트 프로젝트가 빌드되도록 하고, 해당 빌드된 내용을 gradle빌드 된 스프링 부트 정적 콘텐츠 영역에 포함시켰다.

```java
plugins {
    id "com.moowork.node" version "${mooworkNodeVersion}"
}

//리액트 프로젝트 경로
//$projectDir은 스프링 부트 root 경로
def webappDir = "$projectDir/frontend/my-app"

task appNpmInstall(type: NpmTask) {
    workingDir = file("${webappDir}")
    args = ["run", "build"]
}
task copyWebApp(type: Copy) {
    from 'frontend/my-app/build'
    into "build/resources/main/static"
}
copyWebApp.dependsOn(appNpmInstall)
compileJava.dependsOn(copyWebApp)
```

# 그래들(Gradle) 빌드

스프링 부트 루트 경로에서 아래 명령어를 실행해주게 되면 그래들 빌드가 되게 된다.

> gradle clean build

빌드된 내용을 보면 appNpmInstall이 실행되면서 리액트 프로젝트가 빌드되는 것을 확인할 수 있다.

BUILD SUCCESSFUL 메시지가 확인되면 성공이다.

```
PS C:\Users\gunkim\workspace\java\springboot-react-example> gradle clean build

> Task :appNpmInstall

> my-app@0.1.0 build C:\Users\gunkim\workspace\java\springboot-react-example\frontend\my-app
> react-scripts build

Creating an optimized production build...
Compiled successfully.

File sizes after gzip:

  46.61 KB  build\static\js\2.298dc5ad.chunk.js
  772 B     build\static\js\runtime-main.83c3e0c4.js
  706 B     build\static\js\main.63a4bfce.chunk.js

The project was built assuming it is hosted at /.
You can control this with the homepage field in your package.json.

The build folder is ready to be deployed.
You may serve it with a static server:

  yarn global add serve
  serve -s build

Find out more about deployment here:

  bit.ly/CRA-deploy


> Task :test
2020-08-19 01:11:55.968  INFO 6600 --- [extShutdownHook] o.s.s.concurrent.ThreadPoolTaskExecutor  : Shutting down ExecutorService 'applicationTaskExecutor'

BUILD SUCCESSFUL in 10s
8 actionable tasks: 8 executed

```

# 빌드 파일 실행

빌드가 되면 스프링 부트 root디렉토리 build폴더와 함께 libs안에 빌드된 jar파일이 있는데 이것을 실행해주면 된다. 해당 경로로 이동해서 아래 명령어 실행

> java -jar springboot-react-example-0.0.1.jar

![image](https://user-images.githubusercontent.com/45007556/91056971-938e1580-e661-11ea-92fd-35fc69ad0607.png)

# 확인

아래 경로에 접속하게 되면 아래와 같이 제대로 연동된 것을 확인할 수 있다.

> localhost:8080

![image](https://user-images.githubusercontent.com/45007556/91056985-9ab52380-e661-11ea-8727-6ce068f6362a.png)

# 참고

[https://blog.indrek.io/articles/serving-react-apps-from-spring-boot/](https://blog.indrek.io/articles/serving-react-apps-from-spring-boot/)
