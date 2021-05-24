---
date: "2020-12-22"
title: Hashtable과 HashMap는 무슨 차이일까?
category: 자료구조
image: https://user-images.githubusercontent.com/45007556/102892298-0342ce80-44a3-11eb-97cc-981365354e3a.png
tags: ["Java", "Data Structure"]
---

Hashtable과 HashMap이 무슨 차이야?라는 질문을 우연히 듣고 궁금해서 추적해본 내용을 포스팅해보려고 한다.

# Map이랑 똑같다?

어떤 차이점이 있는지 한번 사용해보았을 때, Hashtable 또한 Map처럼 key와 value를 통해 사용 가능하다는 것을 확인했다.

```java
import java.util.HashMap;
import java.util.Hashtable;
public class Main {
    public static void main(String[] args) {
        Hashtable<String, String> table = new Hashtable<>();
        table.put("name", "gun");

        HashMap<String, String> map = new HashMap<>();
        map.put("name", "gun");

        System.out.println(table.get("name"));
        System.out.println(map.get("name"));
    }
}
```

# Hashtable과 HashMap은 형제다

어째서 HashMap이랑 똑같을까? 의문을 풀기 위해서 찾아봤는데 이 둘은 동일하게 Map을 구현하고 있는 녀석이라는 것을 알아냈다. 그렇기 때문에 Map을 구현하고 있는 만큼 기능은 동일하다는 것을 유추할 수 있다.
![이미지](https://user-images.githubusercontent.com/45007556/102892298-0342ce80-44a3-11eb-97cc-981365354e3a.png)

# 그럼 뭐가 다를까?

_Hashtable.java_

```java
public synchronized V put(K key, V value) {
    if (value == null) {
        throw new NullPointerException();
    }
    //...
}
public synchronized V get(Object key) {
    //...
}
```

_HashMap.java_

```java
public V put(K key, V value) {
    //...
}
public V get(Object key) {
    //...
}
```

소스를 뒤져봤는데, 두가지 차이를 알 수 있었다.

1. Hashtable은 value의 null값을 허용하지 않음
2. Hashtable은 동기화 기능을 지원해줌

Hashtable이 동기화를 지원해주는 이유는 메소드에 붙은 synchronized 키워드 때문인데, 해당 키워드는 쓰레드 간 동기화 락을 통해 멀티 쓰레드 환경에서 데이터의 무결성을 보장해준다. 대신 Hashtable은 동기화 락 때문에 HashMap에 비해 속도가 느리다.

# HashMap과 Hashtable 어떨 때 사용할까?

동기화 처리가 필요할 경우 Hashtable, 동기화 처리가 필요 없을 경우 HashMap을 사용하면 될 것 같다.
