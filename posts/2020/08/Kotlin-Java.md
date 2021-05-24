---
date: "2020-08-30"
title: 코틀린과 자바 비교해보면서 훑어보기
category: Kotlin
tags: [Java, Kotlin]
image: https://user-images.githubusercontent.com/45007556/91540311-946ec200-e955-11ea-8391-9b781654bc17.png
---

카카오의 서버사이드 코틀린을 보고나서 그 동안 코틀린은 그저 안드로이드만을 위한 언어인 줄 알았는데, 자바와 매우 호환이 잘 되고, 무려 스프링도 지원한다는 것을 알았다. 그리고 자바로 개발할 때보다 소스량이 훨씬 적어진다는 것이 매우 메리트가 있는 것 같아서, 나중에 코틀린으로 프로젝트를 해봐야 겠다 생각해서 미리 코틀린을 자바와 비교해서 정리해 놓으려고 한다.

# Hello World!

그 동안 자바에서 Hello World!를 찍으려고 하면 손가락 아프게 public class~ 부터 해서 System.out.println까지 작성해왔다. 겨우 Hello World! 하나 출력하는데 5줄이나 작성을 했다. 물론 라인 수가 적다고 해서 무조건 좋은 건 아니지만 손가락이 부담 되는 건 사실이다.

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello World!");
    }
}
```

그러나 코틀린에서는 함수형 프로그래밍을 지원하기 때문에 메소드만이 아니라 함수 선언도 가능하다. 이제 Hello World! 출력을 위해서 쓸데 없는 class를 작성하지 않아도 된다.
그리고 자바에서는 System.out.println까지 쳐야 하지만 코틀린에서는 함수 선언과 함께 println만 치면 된다!

```kotlin
fun main(args:Array<String>){
    println("Hello World!");
}
```

# 변수, 상수 선언

자바에서는 변수를 선언할 때는 int, String, long, boolean 등 타입을 지정해주어야 하고, 상수 선언 시 final을 붙여줘야 한다.

```java
int a = 3;
String str = "msg";
List<String> list = null;
final int b = 18;
```

코틀린에서는 타입 추론을 지원해주기 때문에 변수를 선언할 때 var로 선언해주면 되고, 상수 선언 시 val로 선언하면 된다.

```kotlin
var a = 3
val b = 18
```

만약 코틀린에서 타입을 지정해주고 싶으면 아래처럼 해주면 된다

```kotlin
var a: Int = 1
var a: String = "msg"
```

# 배열 선언

자바에서는 배열을 선언할 때 이런 식으로 선언하게 된다.

```java
int[] arr1 = {1,2,3};
int[] arr2 = new int[3];
```

코틀린에서는 아래와 같이 선언한다.

```kotlin
val arr1 = arrayOf(1, 2, 3) // [1,2,3]
val arr2 = arrayOfNulls<Int>(3) //[null, null, null]
val arr3 = Array(5, {i->i}) //[0, 1, 2, 3, 4]
```

# For문

자바에서는 보통 아래와 같이 for문을 사용한다.

```java
String[] students = {"gunkim", "human", "dog"};

for(int i = 0; i < 10; i++){
    System.out.println(i);
}
for(int i = 0; i < students.length; i++){
    System.out.println(students[i]);
}
for(String student : students){
    System.out.println(student);
}
```

코틀린에서는 이런 식으로 사용한다.

```kotlin
val students = arrayOf("gunkim", "human", "dog")

for(i in 1..10){
    println(i)
}
for(i in 0..students.size-1){
    println(students[i])
}
for(student in students){
    println(student)
}
```

```kotlin
//10부터 1까지
for(i in 10 downTo 1){
    println(i)
}
//10부터 1까지 2씩 하락
for(i in 10 downTo 1 step 2){
    println(i)
}
//1부터 9까지
for(i in 1 until 10){
    println(i)
}
//1부터 9까지 2씩 상승
for(i in 1 until 10 step 2){
    println(i)
}
```

# 메소드 선언

자바에서 메소드를 선언할 때면 접근제어자 리턴타입 메소드명 매개변수 순으로 선언한다.

```java
public String getName(){
    return "gunkim";
}
public void sayHello(){
    System.out.println("Hello");
}
public int sum(int a, int b){
    return a + b;
}
```

코틀린에서는 접근제어자 fun 메소드명 매개변수 리턴타입 순으로 작성한다. 리턴할 게 없는 경우 리턴 타입은 생략이 가능하다.

```kotlin
fun getName():String{
    return "gunkim"
}
fun sayHello(){
    println("Hello")
}
fun sum(a:Int, b:Int):Int{
    return a + b
}
```

# 문자열 처리

## 문자열 템플릿

보통 자바에서 문자열에 특정 값을 치환하기 위해서는 String.format()을 사용하거나, 문자열 붙이기를 통해서 처리를 했었다.

```java
int a = 1;
int b = 3;
System.out.println(String.format("%d + %d = %d", a, b, a+b));
System.out.println(a+" + "+b+" = "+(a+b));
```

하지만 코틀린에서는 문자열 템플릿을 지원해주기 때문에 아래와 같이 변수명 앞에 \$을 붙여서 문자열 안에 삽입을 해주게 되면 자동으로 값이 치환된다. 심지어 함수까지 호출이 가능하다.

```kotlin
var a = 1
var b = 3

var result = a + b;
println("$a + $b = $result")
```

```kotlin
fun main(args:Array<String>){
    var a = 1
    var b = 3

    var result = a + b;
    println("$a + $b = ${sum(a,b)}")
}
fun sum(a:Int, b:Int): Int {
    return a+b
}
```

## 여러 줄로 구성된 문자열 선언

자바에서 보통 문자열을 여러 줄의 문자열 처리를 할 때 단순하게 아래처럼 문자열을 붙이거나 StringBuilder나 StringBuffer를 통해 붙였다.

```java
String menu = "메뉴판==\n";
menu += "햄버거 : 5000\n";
menu += "밥 : 7000\n";
menu += "음료 : 3000\n";
menu += "세팅비 : 30000\n";
```

```java
StringBuffer sb = new StringBuffer();
sb.append("메뉴판==\n");
sb.append("햄버거 : 5000\n");
sb.append("밥 : 7000\n");
sb.append("음료 : 3000\n");
sb.append("세팅비 : 30000\n");
String menu = sb.toString();
```

코틀린에서는 아래와 같이 처리가 가능하다. 시작하는 부분에 """로 시작하고 """로 닫아주고 그 사이에 문자열을 넣으면 된다.

```kotlin
var a = """
    메뉴판==
    햄버거 : 5000
    밥 : 7000
    음료 : 3000
    세팅비 : 30000
"""
```

그런데 위와 같이 처리를 하게 되면 우리의 예상과 다르게 아래와 같이 공백 문자열이 앞에 들어가는 것을 확인할 수 있다. 이는 가독성을 위해 탭을 한 부분도 문자열로 인식이 되었기 때문이다.

![image](https://user-images.githubusercontent.com/45007556/91549698-47ddb380-e962-11ea-9889-75a68bf1c3f2.png)

아래와 같이 해당 문자열에 대해 trimMargin() 메소드를 호출해주고, 해당 라인의 문자열이 시작하는 부분에 구분자를 주게 되면 원하던 결과를 확인할 수 있다.

```kotlin
var a = """
    |메뉴판==
    |햄버거 : 5000
    |밥 : 7000
    |음료 : 3000
    |세팅비 : 30000
""".trimMargin()
```

![image](https://user-images.githubusercontent.com/45007556/91549899-a86cf080-e962-11ea-8c55-48d218805037.png)

# 접근제어자

자바의 접근제어자는 public, protected, default, private 이렇게 4종류가 있다.  
코틀린에서도 자바랑 비슷하지만 public, protected, private, internal 이렇게 4종류가 있다.

차이점은 자바에서 접근제어자를 선언하지 않으면 default 접근제어자를 가지지만 코틀린에서는 접근제어자를 선언하지 않을 경우 public 접근제어자를 가지게 된다.

## 코틀린의 internal

internal로 선언되면 같은 모듈 내에서만 접근이 가능하다.
코틀린에서는 default 접근제어자가 빠지고, internal 접근제어자가 새로 생겼다. 이는 외부에 있는 코드에 의해 모듈의 캡슐화가 깨지는 것을 방지하기 위함이다.

### internal 접근제어자에 접근 가능한 범위

- IntelliJ IDEA 모듈
- Maven / Gradle 프로젝트
- 하나의 Ant 태스크 내에서 함께 컴파일되는 파일들

# 코틀린의 생성자

보통 자바에서 클래스를 선언하고, 멤버변수를 작성하고, 생성자를 작성하는 일반적인 코드다.

```java
public Human{
    String name;
    int age;
    public Human(String name, int age){
        this.name = name;
        this.age = age;
    }
}
```

## 코틀린의 주 생성자

코틀린에서는 위의 코드를 이런 식으로 간편하게 선언과 함께 초기화를 할 수 있다. 이를 주 생성자라고 한다. 주 생성자에는 어떠한 초기화 로직도 포함할 수 없다. 클래스 옆에 constructor 키워드는 생략이 가능하다.

```kotlin
class Human constructor(val name: String, val age: Int)
```

```kotlin
class Human(val name: String, val age: Int)
```

## 코틀린의 부 생성자

부 생성자를 이용할 경우 주 생성자에서와 다르게 초기화 로직을 작성할 수 있는데, 이렇게 자바에서와 똑같이 코드를 작성할 수 있다. 주 생성자에서는 constructor 키워드를 생략할 수 있었지만, 부 생성자에서는 생략이 불가능하다. 부생성자가 있는 주된 이유는 자바와의 호환성때문이기도 하고, 주 생성자만으로는 처리가 어려운 상황이 있기 때문이다.

```kotlin
class Human{
    var name:String
    var age:Int
    constructor(name:String, age:Int){
        this.name = name
        this.age = age
    }
}
```

## 만약 주 생성자와 부 생성자를 같이 사용한다면?

주 생성자와 부 생성자가 같이 쓰일 경우 주 생성자에게 해당 변수에 대한 초기화를 위임해야 한다.

```kotlin
class Human(var name:String){
    var age:Int = 0
    constructor(name:String, age:Int):this(name){
        this.age = age
    }
}
```

## init 블럭

init 블럭은 한개를 작성할 수도 여러 개를 작성할 수도 있다. 아래 코드는 인스턴스가 생성될 때 인자로 받은 값을 콘솔에 출력하고, 안녕하세요를 출력하는 코드다. init 블럭이 여러 개일 경우 위에서 아래 순서로 실행된다.

```kotlin
class Human(var name:String, var age: Int){
    init {
        println("$name, $age")
    }
    init {
        println("안녕하세요")
    }
}
```

## 주 생성자, 부 생성자, init 블럭 실행 순서

**주 생성자 -> init 블록 -> 부 생성자**

## 빌더패턴처럼 사용할 수 있다

생성자 변수 주입 시 변수명을 지정해줄 수 있다. 이렇게 사용하면 빌더 패턴을 사용하는 것과 같은 효과를 볼 수 있다.

```java
class User(
    var name: String,
    var email: String?,
    var age: Int
)
```

```java
val user = User(
    name="gunkim",
    email="gunkim0318@gmail.com",
    age=10
)
```

# Getter, Setter 생성

자바에서는 Getter, Setter을 아래와 같이 생성한다.

```java
public static void main(String[] args) {
    Human human = new Human("gunkim", 21);

    System.out.println(human.getName()+", "+human.getAge()); //gunkim, 21
    human.setName("kimgun");
    human.setAge(18);
    System.out.println(human.getName()+", "+human.getAge()); //kimgun, 18
}
```

```java
public class Human {
    private String name;
    private int age;

    public Human(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public void setName(String name){
        this.name = name;
    }
    public String getName(){
        return this.name;
    }
    public void setAge(int age){
        this.age = age;
    }
    public int getAge(){
        return this.age;
    }
}
```

코틀린에서는 사실 자동으로 Setter와 Getter를 생성해준다. 아래와 같이 프로퍼티에 접근 하듯이 내부적으로 가져올 땐 getter를 호출하고, 값을 지정할 땐 setter를 호출하게 된다.

```kotlin
fun main(args:Array<String>){
    var human = Human("gunkim", 21)

    println("${human.name}, ${human.age}") //gunkim, 21
    human.name = "kimgun"
    human.age = 18
    println("${human.name}, ${human.age}") //kimgun, 18
}

class Human constructor(var name: String, var age: Int)
```

## Getter, Setter를 직접 작성하기

아래와 같이 getter,setter를 생성할 필드변수에 들여쓰기를 통해 선언해주면 된다.
field라는 변수를 사용하는 이는 setter, getter를 생성할 해당 변수 주소값이 바인딩된다. 즉 여기서 field는 this.name이라고 보면 된다.

```kotlin
class Exam {
    var name: String = ""
        get() = if (field.length > 0) field else "name"
        set (value) {
            if (value.length > 0) field = value else ""
        }
}
```

# 인스턴스 생성

자바에서는 인스턴스를 생성할 때는 아래와 같이 new를 통해 생성한다.

```java
List<String> list = new ArrayList<>();
```

코틀린에서는 아래와 같이 new 키워드 없이 인스턴스를 생성한다.

```kotlin
var list = ArrayList<String>()
```

# 상속

자바에서는 상속을 아래와 같이 구현한다.

```java
class Human{
    public void sayHello(){
        System.out.println("Hello!");
    }
}
class gun extends Human{
    @Override
    public void sayHello(){
        System.out.println("Hi!");
    }
}
```

자바에서는 extends 키워드를 통해 상속을 받지만, 코틀린에서는 콜론(:)으로 상속을 받는다. 그리고 부모가 되는 클래스는 상속이 가능하도록 open 키워드를 붙여 상속이 가능하도록 해주어야 하고, 재정의(Override)를 할 메소드에도 open 키워드를 붙여 주어야 한다. 붙이지 않으면 Override가 불가능하다.
그리고 재정의(Override)를 할 때 자바에서는 @Override 어노테이션을 붙이지만 코틀린에서는 간단하게 fun 앞에 override 키워드를 붙여주면 된다.

```kotlin
class gunkim : Human() {
    override fun sayHello() {
        println("Hi!")
    }
}
open class Human{
    open fun sayHello(){
        println("Hello!")
    }
}
```

## 그럼 interface를 implements 받을 땐 어떻게 해야하나?

동일하게 콜론(:)을 사용하여 받을 수 있다.
지금 해당 예제는 Human클래스를 상속받고, Animal이라는 인터페이스를 implements받고 있다.
extends와 implements를 구분하는 방법은 생성자 호출 여부로 알 수 있다.
Human은 클래스이기 때문에 부모 클래스의 생성자 호출을 위해 ()을 열어주었지만, Animal은 인터페이스이기 때문에 부모 생성자를 호출하지 않는다.
그리고 class가 상속이 가능하게 하고, 메소드가 재정의되게 하기 위해 open키워드를 붙여줬던 반면 interface는 open 키워드를 붙여주지 않아도 된다.

```kotlin
interface Animal{
    fun eat()
}
class gunkim : Human(), Animal {
    override fun sayHello() {
        println("Hi!")
    }
}
```

# 자바와 다른 점

## 코틀린에서는 세미콜론이 필요없다?

실제로 코틀린에서는 세미콜론을 사용하지 않는다. 그래도 세미콜론을 붙인다고 컴파일 에러가 나진 않는다.
대신 한 줄에 여러 문장을 적는 경우는 세미콜론을 사용해야 한다.

![image](https://user-images.githubusercontent.com/45007556/91540311-946ec200-e955-11ea-8391-9b781654bc17.png)

## 함수도 값이다

코틀린에서는 일반적인 함수형 프로그래밍 언어에서 처럼 함수도 일급 객체로 취급되어 변수에 할당해서 값처럼 사용할 수 있다. 자바스크립트를 생각하면 이해하기 쉽다.

```kotlin
fun main(args:Array<String>){
    getFunc()();
}
fun getFunc(): () -> Unit {
    return fun(){
        println("Hello World!")
    }
}
```

## Null 안정성 지원

자바에서는 변수에 Null을 못 넣게하려면 사용할 수 있는 어노테이션 등 몇개 있지만 문법적으로 지원해주는 것은 없다.

하지만 코틀린에서는 Nullable 타입과 Non-Nullable 타입을 지정할 수 있는데 방법은 어렵지 않다. 변수명과 타입을 지정해주고 뒤에 ?를 붙이면 Null이 허용되는 Nullable타입이고, 붙이지 않으면 Null이 허용되지 않는 Non-Nullable 타입이다.

```kotlin
var name1:String? = "Nullable"
var name2:String = "Non-Nullable"
```

```
name1 = null //Nullable타입이기 때문에 컴파일 에러가 발생하지 않음
name2 = null //Non-Nullable타입이기 때문에 컴파일 에러가 발생함
```

# 자바의 System.out.println과 코틀린의 println은 무슨 차이일까?

이것은 내가 개인적으로 궁금해서 찾아본 부분이다. System.out.println를 먼저 살펴보면
System 클래스 안에 out객체가 static으로 선언이 되어 있고, out이라는 이름의 PrintStream 클래스를 살펴보면 println이라는 이름의 메소드가 선언이 되어 있는 것을 확인할 수 있다. static으로 선언이 되어 있기 때문에 사용할 때 인스턴스 생성을 해주지 않아도 되었던 것이다.
![image](https://user-images.githubusercontent.com/45007556/91521103-dd148400-e931-11ea-87f6-f44ce6bea287.png)
![image](https://user-images.githubusercontent.com/45007556/91521578-f23de280-e932-11ea-8542-341f81f787a2.png)

그리고 코틀린의 println을 살펴보면 함수로 선언이 되어 있고, 내부적으로는 System.out.println을 사용하고 있는 것을 확인할 수 있다.
결국 코틀린의 println과 자바의 System.out.println은 결국 동일하다고 볼 수 있다. 그렇기 때문에 코틀린에서도 System.out.println을 사용이 가능하다. 하지만 굳이 사용할 이유는 없는 것 같다.
![image](https://user-images.githubusercontent.com/45007556/91521649-1699bf00-e933-11ea-8407-ebbd0e0c6d4d.png)

# 마지막으로

코틀린을 이번에 한번 쭉 훑어보면서 느낀 점은 정말 지금까지 자바를 사용하면서 느꼈던 답답함이 한번에 해소되는 느낌이 들었다. 아직 그리 깊게는 써보지 않았는데도 정말정말 재미 있었고, 코틀린이 왜 자바의 대체재라고 불리는 지 크게 깨닫게 되었다. 다음에 사이드 프로젝트를 할 때 코틀린으로 한번 진행을 해보려고 생각중이다.
