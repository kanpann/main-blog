---
date: "2020-09-26"
title: JPA 양방향 연관관계 나름 정리
category: Spring
tags: [Java, Jpa]
image: https://user-images.githubusercontent.com/45007556/94286367-de1bee00-ff8f-11ea-92a1-b1afe192b5bf.png
---

양방향 연관관계에 대해서 다룰 일이 있었는데, 양방향인데 저장할 때 어느쪽에다가 저장을 해야 하는지, 양쪽 다 해야 하는지 등이 헷갈려서 정리해보았다.
다대일을 기준으로 포스팅해보려고 한다.

# 양방향 연관관계

양방향 연관관계라고 표현은 했지만, 실질적으로는 단방향 연관관계가 양쪽에 하나씩, 총 2개라고 보면 된다.

아래 그림은 단방향 연관관계에 대한 그림이다.  
학교에서는 학생에 대한 참조가 없어서 학교에서는 속해있는 학생을 알 수 없지만,
학생은 학교에 대한 참조가 있어서 속해있는 학교에 대해서 알 수 있다.  
해당 연관관계는 단방향 1:N관계라고 볼 수 있다.
![image](https://user-images.githubusercontent.com/45007556/94286367-de1bee00-ff8f-11ea-92a1-b1afe192b5bf.png)

그래서 이제 학교에서 학교에 속해있는 학생을 알기 위해서 참조를 추가해주게 되면 학교에서도 학생을 알 수 있고,
학생도 학교에 대해서 알 수 있다.  
해당 연관관계를 양방향 1:N 연관관계라고 볼 수 있다.
_그림에서는 학교쪽에도 외래키가 있지만, 실제로 외래키는 학생쪽에서 관리함. 이유는 후술_

![image](https://user-images.githubusercontent.com/45007556/94286453-fb50bc80-ff8f-11ea-80e6-6cc4755934d8.png)

위의 관계를 코드로 작성해보면 아래와 같다.

```java
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
public class School {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false)
    private String name;

    @OneToMany(mappedBy = "school")
    @Column(nullable = true)
    private List<Student> students = new ArrayList<Student>();

    @Builder
    public School(long id, String name, List<Student> students){
        this.id = id;
        this.name = name;
        this.students = students;
    }
}
```

```java
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private int age;

    @ManyToOne
    @JoinColumn(name="school_id", nullable = false)
    private School school;

    @Builder
    public Student(long id, String name, int age, School school){
        this.id = id;
        this.name = name;
        this.age = age;
        this.school = school;
    }
}
```

# 연관관계의 주인

외래키를 관리하는 쪽을 연관관계 주인이라고 한다. 양방향 연관관계를 매핑해주기 위해서는 꼭 **연관관계의 주인**을 설정해주어야 하는데,
양방향은 단방향 연관관계가 2개라고 했다. 그런데 아래의 코드를 보면 School에도 Student가 있고, Student에도 School가 있다.
그럼 School엔티티에서 Student를 등록, 수정, 삭제 등을 해도 반영이 될까? 그 답은 아니다.  
양방향 연관관계에서는 연관관계에 대해서 **연관관계의 주인**만이 등록, 수정, 삭제가 가능하다.

## 설정 방법

주인인 쪽은 @JoinColumn을 사용하고, 주인이 아닌 쪽은 mappedBy를 사용해준다.
다대일 연관관계에서는 주로 @ManyToOne쪽을 주인으로 설정한다.

@ManyToOne에는 mappedBy속성이 없고, @OneToMany쪽을 주인으로 설정하는 방법도 있지만 다루진 않겠다.

# 저장 방법

## DB만을 고려한 연관관계 저장

그냥 간단히 아래와 같이 입력하면 된다.
그런데 여기서 내가 가장 헷갈렸던 부분인데, 해당 코드를 보면 Student엔티티에 School엔티티를 넣는 부분은 있는데, School엔티티에 Student를 넣어주는 부분은 없다.
하지만 연관관계의 주인이 외래키를 관리하기 때문에 주인이 아닌 쪽은 따로 넣어주지 않아도 DB를 조회해보면 값이 확인된다.

```java
School school = School.builder()
        .name("어느학교")
        .build();
schoolRepository.save(school);

Student student = Student.builder()
        .name("gunkim")
        .age(21)
        .school(school)
        .build();
studentRepository.save(student);
```

이제 그럼 School엔티티에 List<Student>의 size와 Student엔티티를 조회해보았다. 그런데 결과는 양방향 연관관계를 통해 예상했던 결과가 아니다.
DB에는 연관관계가 등록됐을 지 모르지만 객체 형태로 조회했을 때는 제대로 값이 확인되지 않는 것을 알 수 있다.

```java
System.out.println("학생 정보 :: "+studentRepository.findAll().get(0));
System.out.println("어느학교 학생 수 :: "+schoolRepository.findAll().get(0).getStudents().size());
```

![image](https://user-images.githubusercontent.com/45007556/94325848-74293600-ffdb-11ea-9262-01947fbbadf8.png)

## DB 및 객체까지 고려한 연관관계 저장

내가 의도한 바는 School엔티티에서도 가지고 있는 Student를 조회하고,
Student에서도 가지고 있는 School에 대해 조회하는 것이기 때문에 아래와 같이 처리해주면 된다.

```java
School school = School.builder()
        .name("어느학교")
        .build();
schoolRepository.save(school);

Student student = Student.builder()
        .name("gunkim")
        .age(21)
        .school(school)
        .build();
school.getStudents().add(student);
studentRepository.save(student);
```

## 개선해보기

그런데 우리는 이 양방향 연관관계를 어느쪽을 조회하든 조회가 가능하게 하고 싶다. 하지만 만약 까먹고 Student엔티티에는 넣고, School에는 안 넣게 되는 등의 문제를 방지하기 위해
이런 식으로 수정해보았다. 이제 Student엔티티에만 School엔티티를 넣게 되면 자동으로 매핑을 해줄 것이다.

```java
@ToString
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private int age;

    @ManyToOne
    @JoinColumn(name="school_id", nullable = false)
    private School school;

    @Builder
    public Student(long id, String name, int age, School school){
        school.getStudents().add(this);

        this.id = id;
        this.name = name;
        this.age = age;
        this.school = school;
    }
}
```

```java
School school = School.builder()
        .name("어느학교")
        .build();
schoolRepository.save(school);

Student student = Student.builder()
        .name("gunkim")
        .age(21)
        .school(school)
        .build();
studentRepository.save(student);

System.out.println("어느학교 학생 수 :: "+schoolRepository.findAll().get(0).getStudents().size());
```

![image](https://user-images.githubusercontent.com/45007556/94326298-09c5c500-ffde-11ea-9597-fe383c93a69b.png)

# 헷갈리지 말아야 할 점 **(중요)**

연관관계 주인만이 연관관계에 대한 입력, 수정, 삭제가 가능하다고 했다.
그래서 수정할 때 School에만 입력, 수정, 삭제해도 반영이 되지 않는다.
만약 반영되지 않는다면 다시 한번 확인해볼 필요가 있을 것 같다.
