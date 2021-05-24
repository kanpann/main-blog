---
date: '2021-05-23'
title: Ubuntu(20.04) Jenkins 설치하기
category: Linux
image: https://user-images.githubusercontent.com/45007556/119257967-a8a0d080-bc02-11eb-9619-fabce3191fcd.png
tags: [Linux, Ubuntu, Ci, Jenkins]
---

젠킨스는 소프트웨어 개발 시 지속적으로 통합 서비스를 제공하는 툴로 CI(Continuous Integration) 툴 이라고 한다. 오늘은 젠킨스가 필요하게 되어 설치 방법에 대해서 정리해보려고 한다.

# 환경

- ubuntu 20.04.2
- openjdk 11.0.11

# JDK 설치

```bash
apt install openjdk-11-jre-headless
```

# 저장소 키 설정

[Stack Overflow 답변](https://serverfault.com/questions/1034893/installing-jenkins-on-ubuntu-tells-me-package-jenkins-has-no-installation-can)을 보니 2020년 4월 부터 Jenkins 저장소 키가 변경되어 아래와 같이 해주면 된다고 한다.

```bash
wget -q -O - https://pkg.jenkins.io/debian/jenkins.io.key | sudo apt-key add -
```

# Jenkins 설치

```bash
sudo apt-get install jenkins
```

# Jenkins 설정

Jenkins 포트 같은 설정들은 아래에 파일에서 할 수 있다.

```bash
sudo vi /etc/default/jenkins
```

# Jenkins 서비스 재시작

```bash
sudo service jenkins restart
```

서비스 정상 실행 여부 확인

```bash
sudo systemctl status jenkins
```

# 초기 패스워드 확인

```bash
sudo cat /var/lib/jenkins/secrets/initialAdminPassword
```

# Jenkins 접속

포트 번호를 변경하지 않은 경우 [http://localhost:8080](http://localhost:8080)으로 접속하면 아래 화면이 표출되니 비밀번호는 앞에서 확인한 초기 패스워드를 입력해주면 된다.
![1](https://user-images.githubusercontent.com/45007556/119257892-5069ce80-bc02-11eb-8edc-2fbaa8194037.png)

## 플러그인 설치

Jenkins는 여러 플러그인을 지원해주는데, 플러그인 권장 설치 및 아니면 필요한 플러그인을 개별 선택해서 설치가 가능하다.
![스크린샷 2021-05-23 오후 6 14 19](https://user-images.githubusercontent.com/45007556/119257922-75f6d800-bc02-11eb-8a8e-d96e9763dfd6.png)
![스크린샷 2021-05-23 오후 6 14 51](https://user-images.githubusercontent.com/45007556/119257924-77280500-bc02-11eb-8e93-4c535f0489bf.png)

# 설치 완료

플러그인 설치가 끝나면 이제 Jenkins 사용이 가능해진다.
<img width="1215" alt="스크린샷 2021-05-23 오후 7 54 56" src="https://user-images.githubusercontent.com/45007556/119257941-8c049880-bc02-11eb-955a-58c3759827d5.png">
