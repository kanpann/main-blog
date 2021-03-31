---
date: "2021-03-31"
title: "Ubuntu 18.0.4 하둡(Hadoop) 설치하기"
category: Linux
image: https://user-images.githubusercontent.com/45007556/113100385-52349880-9236-11eb-9c6e-2ffda547aab1.png
draft: false
---

Hadoop은 여러 대의 컴퓨터 클러스터에서 대규모 데이터 세트를 분산 처리할 수 있게 해주는 프레임워크이다. 주로 분산 처리가 많이 필요한 빅데이터 개발에 많이 쓰인다고 한다. 나도 같은 이유로 하둡 개발 환경을 세팅해야 하는 상황이라 하둡 설치 방법에 대해서 정리해보려고 한다.

# 설치 환경

- Ubuntu 18.04
- Hadoop 3.1.4
- Openjdk 1.8

# apt 업데이트

```bash
sudo apt-get update
```

# jdk 설치 및 환경변수 설정

## 설치

```bash
sudo apt-get install openjdk-8-jdk
```

## 환경변수 설정

환경변수 설정창으로 진입

```bash
sudo nano ~/.bashrc
```

자바 환경변수 설정

```bash
export JAVA_HOME=/usr/lib/jvm/java-8-openjdk-amd64
```

환경변수 적용

```bash
source ~/.bashrc
```

## 확인

```bash
gun@gun:~$ java -version
openjdk version "11.0.10" 2021-01-19
OpenJDK Runtime Environment (build 11.0.10+9-Ubuntu-0ubuntu1.18.04)
OpenJDK 64-Bit Server VM (build 11.0.10+9-Ubuntu-0ubuntu1.18.04, mixed mode, sharing)
```

# apt 업그레이드

```bash
sudo apt-get upgrade
```

# 그룹 및 사용자 생성

하둡을 따로 관리하기 위한 사용자 및 그룹 생성

```bash
sudo addgroup hadoop
sudo adduser --ingroup hadoop hduser
```

```bash
gun@gun:~$ sudo addgroup hadoop
그룹 `hadoop' (GID 1003) 추가 ...
완료.`
hduser@csle1:~$ sudo adduser --ingroup hadoop hduser
'hduser' 사용자를 추가 중...
새 사용자 'hduser' (1003) 을(를) 그룹 'hadoop' (으)로 추가 ...
'/home/hduser' 홈 디렉터리를 생성하는 중...
'/etc/skel'에서 파일들을 복사하는 중...
새 UNIX 암호 입력:
새 UNIX 암호 재입력:
passwd: 암호를 성공적으로 업데이트했습니다
hduser의 사용자의 정보를 바꿉니다
새로운 값을 넣거나, 기본값을 원하시면 엔터를 치세요
	이름 []:
	방 번호 []:
	직장 전화번호 []:
	집 전화번호 []:
	기타 []:
정보가 올바릅니까? [Y/n] y
```

## hduser계정의 루트권한 사용을 위한 설정

```bash
sudo nano /etc/sudoers
```

맨 아랫줄에 해당 내용 추가

```bash
hduser ALL=(ALL) NOPASSWD: ALL
```

# Openssl Server 설치

```bash
sudo apt-get install openssh-server
```

# ssh 키 생성

## 1. hduser로 사용자 전환

```bash
sudo su hduser
```

## 2. home 디렉토리 이동

```bash
cd
```

## 3. ssh키 생성

```bash
ssh-keygen -t rsa -P ""
```

후 아무것도 입력하지 않고 엔터

## 4. ssh키 비밀번호 해제

```bash
cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys
```

## 5. sysctl.conf 수정

```bash
sudo nano /etc/sysctl.conf
```

```bash
l.disable_ipv6 = 1
net.ipv6.conf.default.disable_ipv6 = 1
net.ipv6.conf.lo.disable)ipv6 = 1
```

맨 아랫줄에 해당 내용 추가

5. 재시작

```bash
sudo reboot
```

# 하둡(Hadoop) 설치

## 사용자 전환

```bash
sudo su hduser
cd
```

## 다운로드

[하둡 다운로드](https://downloads.apache.org/hadoop/common/)에서 원하는 버전 선택 후 .tar.gz 파일의 링크 주소 복사

![Untitled](https://user-images.githubusercontent.com/45007556/113102332-dab43880-9238-11eb-9f5d-50a304e4c22c.png)

나는 3.1.4버전을 설치할 것이기 때문에 해당 주소를 다운 받았다.

```bash
wget https://downloads.apache.org/hadoop/common/hadoop-3.1.4/hadoop-3.1.4.tar.gz
```

## 압축풀기

```bash
tar -zxf hadoop-3.1.3.tar.gz
```

## 이동

압축 풀어서 나온 hadoop-3.1.4 폴더를 /usr/local 경로에 hadoop이라는 폴더명으로 변경해서 이동

```bash
sudo mv hadoop-3.1.4 /usr/local/hadoop
```

## 권한 수정

```bash
sudo chown hduser:hadoop -R /usr/local/hadoop
sudo mkdir -p /usr/local/hadoop_tmp/hdfs/namenode
sudo mkdir -p /usr/local/hadoop_tmp/hdfs/datanode
sudo chown hduser:hadoop -R /usr/local/hadoop_tmp/
```

## 환경변수 추가

```bash
sudo nano ~/.bashrc
```

```bash
export JAVA_HOME=/usr/lib/jvm/java-8-openjdk-amd64
export PDSH_RCMD_TYPE=ssh
export HADOOP_HOME=/usr/local/hadoop
export PATH=$PATH:$HADOOP_HOME/bin
export PATH=$PATH:$HADOOP_HOME/sbin
export PATH=$PATH:$JAVA_HOME/bin
export HADOOP_MAPRED_HOME=$HADOOP_HOME
export HADOOP_COMMON_HOME=$HADOOP_HOME
export HADOOP_HDFS_HOME=$HADOOP_HOME
export YARN_HOME=$HADOOP_HOME
export HADOOP_COMMON_LIB_NATIVE_DIR=$HADOOP_HOME/lib/native
export HADOOP_OPTS="-Djava.library.path=$HADOOP_HOME/lib"
export PATH=$PATH:/usr/local/hadoop/bin/
```

아까 자바 환경변수 설정한 곳 아래에 이어서 작성

## 하둡 관련 파일들 수정

```bash
cd /usr/local/hadoop/etc/hadoop
```

```bash
sudo nano hadoop-env.sh
```

```bash
export JAVA_HOME=/usr/lib/jvm/java-8-openjdk-amd64
   or
export JAVA_HOME=${JAVA_HOME}
```

기본값으로 주석되어 있는 것을 풀어주고, 자신의 jdk 경로 기입.

```bash
sudo nano core-site.xml
```

```bash
<configuration>
	<property>
		<name>fs.default.name</name>
		<value>hdfs://localhost:54310</value>
	</property>
</configuration>
```

```bash
sudo nano hdfs-site.xml
```

```bash
<configuration>
	<property>
		<name>dfs.replication</name>
		<value>1</value>
	</property>
	<property>
		<name>dfs.namenode.name.dir</name>
		<value>file:/usr/local/hadoop_tmp/hdfs/namenode</value>
	</property>
	<property>
		<name>dfs.datanode.data.dir</name>
		<value>file:/usr/local/hadoop_tmp/hdfs/datanode</value>
	</property>
</configuration>
```

```bash
sudo nano yarn-site.xml
```

```bash
<configuration>
	<property>
		<name>yarn.nodemanager.aux-services</name>
		<value>mapreduce_shuffle</value>
	</property>
	<property>
		<name>yarn.nodemanager.aux-services.mapreduce.shuffle.class</name>
		<value>org.apache.hadoop.mapred.shuffleHandler</value>
	</property>
</configuration>
```

## 적용

```bash
cd
source ~/.bashrc
```

# 하둡 실행

```bash
cd /usr/local/hadoop_tmp/hdfs
hadoop namenode -format
cd /usr/local/hadoop/sbin
./start-dfs.sh
./start-yarn.sh
```

- ./start-dfs.sh 시에 권한 오류가 날 경우 환경변수 PDSH_RCMD_TYPE가 제대로 되어 있는지 체크

# 최종 확인

```bash
hduser@gun:/usr/local/hadoop/etc/hadoop$ jps
32610 NodeManager
32229 ResourceManager
31401 NameNode
31625 DataNode
31913 SecondaryNameNode
6494 Jps
```
