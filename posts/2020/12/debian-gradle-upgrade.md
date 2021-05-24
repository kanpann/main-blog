---
date: "2020-12-30"
title: Debian Linux Gradle 최신 버전 설치하기
category: Linux
tags: ["Linux", "Gradle"]
image: https://user-images.githubusercontent.com/45007556/103326060-071db480-4a92-11eb-8f14-b63d669bfb96.png
---

apt-get을 통해 설치한 Gradle 버전이 4.4.1 버전이라 5버전 이상의 최신버전이 필요했기에 Gradle 최신 버전으로 설치하는 방법을 적어보려 한다.

# Jdk SE 8 이상 버전을 설치해주자

Gradle을 사용하려면 Jdk SE 8 이상 버전이 필요하기 때문에 jdk를 설치한다.

## Jdk 설치

```bash
sudo apt update
sudo apt install default-jdk
```

## 버전 확인

```bash
pi@raspberrypi:~ $ java -version
openjdk version "11.0.9.1" 2020-11-04
OpenJDK Runtime Environment (build 11.0.9.1+1-post-Raspbian-1deb10u2)
OpenJDK Server VM (build 11.0.9.1+1-post-Raspbian-1deb10u2, mixed mode)
```

# Gradle 다운로드

## 다운로드 받기

/tmp 디렉토리에 gradle 압축파일을 다운로드 받는다.

```bash
wget https://services.gradle.org/distributions/gradle-6.7.1-all.zip -P /tmp
```

## 압축해제

다운로드 받은 압축파일을 압축해제한다.

```bash
sudo unzip -d /opt/gradle /tmp/gradle-*.zip
```

# 환경변수 설정

이제 다운로드 받았으니 gradle 사용이 가능하다. 하지만 어디에서나 사용하기 위해서는 환경변수를 설정해야 한다.

## gradle.sh 생성

/etc/profile.d 디렉토리 내에 gradle.sh 새 파일을 만들고 내용을 채워주면 된다.

```bash
sudo nano /etc/profile.d/gradle.sh
```

```sh
export GRADLE_HOME=/opt/gradle/gradle-6.7.1
export PATH=${GRADLE_HOME}/bin:${PATH}
```

## 스크립트 실행 가능하도록 설정

chmod 명령어는 Change Mode의 약자로 파일의 사용권한을 변경하는 명령어이다. 여기서 +x 옵션으로 모든 사용자가 실행할 수 있도록 사용 권한을 변경해주었다.

```bash
sudo chmod +x /etc/profile.d/gradle.sh
```

## 환경변수 로드

작성한 쉘 스크립트를 환경변수에 로드해준다

```bash
source /etc/profile.d/gradle.sh
```

# 최종 확인

그래들 버전을 확인했을 때 설치한 6.7.1 버전이 맞다면 성공이다.

```bash
pi@raspberrypi:~ $ gradle -v

------------------------------------------------------------
Gradle 6.7.1
------------------------------------------------------------

Build time:   2020-11-16 17:09:24 UTC
Revision:     2972ff02f3210d2ceed2f1ea880f026acfbab5c0

Kotlin:       1.3.72
Groovy:       2.5.12
Ant:          Apache Ant(TM) version 1.10.8 compiled on May 10 2020
JVM:          11.0.9.1 (Raspbian 11.0.9.1+1-post-Raspbian-1deb10u2)
OS:           Linux 5.4.79-v7+ arm
```

# 참고

[https://linuxize.com/post/how-to-install-gradle-on-debian-10](https://linuxize.com/post/how-to-install-gradle-on-debian-10)
