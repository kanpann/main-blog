---
date: "2020-11-12"
title: Java Byte<->String 변환 방법 및 바이트로 자르기
category: Java
tags: [Java]
image: https://user-images.githubusercontent.com/45007556/103327958-30424300-4a9a-11eb-810d-70513ba86130.png
---

보통 문자열을 자릿수로 자를 때는 String클래스에서 지원해주는 substring() 메소드를 사용해서 자르는데, 이번에는 특별하게 문자열을 바이트로 잘라야 하는 경우가 발생해서 해당 방법을 정리해보려고 한다.

# String -> Byte

```java
String name = "gunkim";
byte[] nameBytes = name.getBytes();
```

# Byte -> String

```java
byte[] nameBytes = "gunkim".getBytes();

String name = new String(nameBytes);
```

# 바이트 자르기

```java
String name = "gunkim";
byte[] nameBytes = name.getBytes();

String cutName = new String(nameBytes, 0, 3); //result - gun
```

위의 예제에서는 0바이트 부터 3바이트까지 잘랐다. 바이트를 문자열로 변환할 때와 똑같은데, 뒤에 인자를 두개 더 주면 된다.

## 알고있어야 할 점

```java
String name = "한국";
byte[] nameBytes = name.getBytes();

String cutName = new String(nameBytes, 0, 4); //result - 한�
```

영어나 숫자는 1바이트라서 그냥 잘라도 예상하던 결과가 나오겠지만, 한글의 경우 한 글자당 3바이트라서 3바이트를 온전히 자르지 않을 경우 문자열로 변환했을 때 한글이 깨질 수 있다.
