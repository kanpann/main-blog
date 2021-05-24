---
date: "2020-11-03"
title: JPA 영속성 전이와 고아 객체(orphan)
category: Spring
tags: [Jpa]
image: https://user-images.githubusercontent.com/45007556/103327917-04bf5880-4a9a-11eb-8610-c88a74f619bc.png
---

영속성 전이와 관련되어서 크게 삽질한 내용이 있어서 정리할 겸 같이 작성해보려고 한다.

# 영속성 전이란?

영속 상태의 엔티티 객체에 수행되는 작업이 연관된 자식 엔티티까지 전파되는 것이다.

## 전파되면 뭐가 좋은데?

아래 예제 코드를 보면서 영속성 전이가 어떤건지 살펴보도록 하겠다.

_User.java_

```java
@Entity
public class User{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    @Column(nullable = false)
    String name;
    String email;
    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    List<Posts> postsList = ArrayList<Posts>();
}
```

_Posts.java_

```java
@Entity
class Posts{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    @Column(nullable = false)
    String contents;
    @ManyToOne
    @JoinColumn(name="user_id")
    User user;
}
```

```java
User user = new User();
user.name = "gunkim";
user.email = "gunkim0318@gmail.com";

userRepository.save(user); //persist

Posts posts = new Posts();
posts.contents = "게시글 내용";
posts.user = user;

postsRepository.save(posts); //persist
```

해당 예제코드는 Posts엔티티를 저장(persist)하기 위한 소스이다. Posts 엔티티를 입력하기 위해서 User 엔티티를 입력하고, Posts엔티티를 입력한다.
이를 위해서 번거롭게 저장(persist)하는 코드를 두번 작성해야 하는 번거로움이 있다.

_User.java_

```java
@Entity
public class User{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    @Column(nullable = false)
    String name;
    String email;
    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY, cascade = CascadeType.PERSIST)
    List<Posts> postsList = ArrayList<Posts>();
}
```

```java
User user = new User();
user.name = "gunkim";
user.email = "gunkim0318@gmail.com";

Posts posts = new Posts();
posts.contents = "게시글 내용";
posts.user = user;

user.postsList.add(posts);
userRepository.save(user); //user, posts persist
```

영속성 전이를 이용한다면 이렇게 부모 엔티티인 User 엔티티를 저장(persist)하면서 같이 자식인 Posts 엔티티도 같이 저장(persist)되게끔 할 수 있다.  
영속성 전이를 잘 활용하면 자식의 생명주기도 관리할 수 있게 되어 편리하지만, 잘못 사용하면 예상치 못한 결과가 발생할 수 있으니 주의가 필요하다.

# 영속성 전이 옵션

위의 예제에서 이용한 CascadeType.PERSIST 옵션 말고도 JPA에서는 여러 옵션들을 추가로 지원해주는데 아래와 같다.

- **CascadeType.ALL** - 모든 Cascade 옵션 적용
- **CascadeType.PERSIST** - 부모 엔티티를 영속화할 때 자식 엔티티도 영속(persist)화 시킨다.
- **CascadeType.MERGE** - 부모 엔티티를 병합할 때 자식 엔티티도 병합(merge)한다.
- **CascadeType.REFRESH** - 부모 엔티티를 읽어들일 때 자식 엔티티도 다시 읽어들인다(refresh).
- **CascadeType.REMOVE** - 부모 엔티티를 삭제할 때 자식 엔티티도 삭제(remove)한다.
- **CascadeType.DETACH** - 부모 엔티티를 준영속(detach)화 할 때 자식 엔티티도 준영속(detach)화 한다.

# 고아(orphan) 객체

부모 엔티티와 관계가 끊어진 자식 엔티티를 **고아 객체**라고 한다.

## **orphanRemoval=true**옵션

```java
@Entity
public class User{
    //...
    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY, orphanRemoval=true)
    List<Posts> postsList = ArrayList<Posts>();
}
```

만약 부모 엔티티와의 관계가 끊어진 고아 객체가 자동으로 삭제되게 하고 싶을 때 사용하는 옵션인데 **orphanRemoval=true**만 추가해주면 자동으로 고아 객체를 삭제해준다.

## CascadeType.REMOVE vs orphanRemoval=true

영속성 전이 REMOVE 옵션은 부모 엔티티가 삭제되었을 때 자식 엔티티를 삭제하는데, 대충 설명을 읽어보면 고아객체 삭제 옵션이랑 유사하다.

### 공통점

**부모 엔티티를 삭제한다 -> 자식 엔티티를 삭제한다.**

### 차이점

#### CascadeType.REMOVE

부모 엔티티가 삭제될 경우 **자식 엔티티**를 삭제해라

#### orphanRemoval=true

부모 엔티티가 삭제될 경우를 관계가 끊어진 **고아 객체**를 삭제해라

### 결론

결국 어떻게 보면 영속성 전이 REMOVE 옵션은 고아 객체 삭제 옵션의 부분집합이라고도 볼 수 있을 것 같다.

## 고아 객체를 만드는 방법

```java
User user = userRepository.findAll().get(0);
user.postsList.clear();
```

User(부모)엔티티에서 Posts(자식) 엔티티와의 관계를 끊어 주었다. 이렇게 자연히 Posts(자식) 엔티티는 고아 객체가 되어 자동으로 삭제(delete)된다. 추가로 User(부모) 엔티티가 삭제될 경우에도 관계가 끊어진다.

## +**orphanRemoval=true**를 사용하려면 CascadeType.REMOVE를 같이 사용해야 한다?

원래는 **orphanRemoval=true**옵션만 추가하게 되면 작동이 되어야 하는 게 맞을텐데, 작동이 안되어서 구글링해본 결과 **CascadeType.REMOVE**와 같이 사용해야 작동한다는 답변을 발견했다. 아마 원인은 하이버네이트 쪽 문제가 아닌가 하는 의견이 있어서 첨부한다.[참고](https://github.com/mjung1798/Jyami-Java-Lab/issues/1)
