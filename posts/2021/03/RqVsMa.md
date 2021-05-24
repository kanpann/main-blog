---
date: "2021-03-24"
title: "@RequestBody vs @ModelAttribute 언제 사용해야 할까?"
tags: [Spring, Spring Boot]
category: Spring
image: https://user-images.githubusercontent.com/45007556/103328175-0e958b80-4a9b-11eb-9db7-66230e0f057c.png
---

지금까지 스프링으로 개발을 하면서 @Requestbody와 @Modelattribute의 차이점에 대해 잘 모르고 사용해왔다. @Requestbody로 써보고 안되면, @Modelattribute로 바꿔보는 식으로 했던 것을 반성해보면서 이번 기회에 한번 짚고 넘어가려고 한다. 더 자세한 내용은 참조를 확인하면 될 것 같다.

# @ModelAttribute

HTTP 클라이언트가 보내온 요청에서 Parameter 값들을 VO의 Setter를 통해 바인딩 해준다.

# @RequestBody

HTTP 클라이언트가 보내온 요청에서 Body 값들을 ObjectMapper를 통해 변환해서 VO에 값들을 매핑해준다.

# 어떻게 구분해서 사용할까?

값을 파라미터로 넘기냐, Body에 담아서 넘기냐에 따라서 선택하면 될 것 같다.

# 직접 테스트해보기

```java
@Setter
@Getter
@ToString
public class PersonRequestDto {
    private String name;
    private int age;
}
```

```java
    @PostMapping("")
    public void rb(@RequestBody PersonRequestDto dto){
        System.out.println("TEST :: "+dto.toString());
    }
    @GetMapping("")
    public void ma(@ModelAttribute PersonRequestDto dto){
        System.out.println("TEST :: "+dto.toString());
    }
```

## @RequestBody에 Parameter 테스트

```java
    @Test
    public void requestBodyParameterTest() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.post("/api/rb")
                .contentType(MediaType.APPLICATION_JSON)
                .characterEncoding("UTF-8")
                .param("name", "kan")
                .param("age", "13")
        ).andExpect(status().isOk()).andDo(print());
    }
```

![image](https://user-images.githubusercontent.com/45007556/112264757-b1356300-8cb4-11eb-86f6-4ee9bdab6b6f.png)

예상했던 대로 매핑이 되지 않는 것을 확인할 수 있었다. 해당 오류는 @ReuqestBody로 선언되어 있는데, Body에 값이 담겨있지 않기 때문에 오류가 난 것이다.

## @RequestBody에 Body 테스트

이번에는 Setter가 없어도 되어야 하기 때문에 Setter를 빼고 테스트를 해보았다.

```java
@Getter
@ToString
public class PersonRequestDto {
    private String name;
    private int age;
}
```

```java
    @Test
    public void requestBodyBodyTest() throws Exception {
        String json = "{ \"name\":\"kan\", \"age\":\"13\" }";
        mockMvc.perform(MockMvcRequestBuilders.post("/api/rb")
                .contentType(MediaType.APPLICATION_JSON)
                .characterEncoding("UTF-8")
                .content(json)
        ).andExpect(status().isOk()).andDo(print());
    }
```

![image](https://user-images.githubusercontent.com/45007556/112264877-dcb84d80-8cb4-11eb-8ea9-68feb367f0d2.png)

Body에 값을 담았더니 Setter가 없는데도 정상적으로 매핑이 되는 것을 확인할 수 있었다.

## @ModelAttribute에 Parameter 테스트

```java
    @Test
    public void modelAttributeParameterTest() throws Exception {
        String json = "{ \"name\":\"kan\", \"age\":\"13\" }";
        mockMvc.perform(MockMvcRequestBuilders.get("/api/ma")
                .contentType(MediaType.APPLICATION_JSON)
                .characterEncoding("UTF-8")
                .param("name", "kan")
                .param("age", "13")
        ).andExpect(status().isOk()).andDo(print());
    }
```

![image](https://user-images.githubusercontent.com/45007556/112265784-64eb2280-8cb6-11eb-9f2f-6f71feda6492.png)

역시나 성공하는 것을 확인할 수 있었다.

## @ModelAttribute POST방식 테스트

이번에는 Body에 값을 넣어도 매핑이 되는지 확인해보기 위해 POST 방식으로 바꾸어서 테스트해보았다.

```java
    @PostMapping("")
    public void ma(@ModelAttribute PersonRequestDto dto){
        System.out.println("TEST :: "+dto.toString());
    }
```

```java
    @Test
    public void modelAttributeBodyTest() throws Exception {
        String json = "{ \"name\":\"kan\", \"age\":\"13\" }";
        mockMvc.perform(MockMvcRequestBuilders.post("/api/ma")
                .contentType(MediaType.APPLICATION_JSON)
                .characterEncoding("UTF-8")
                .content(json)
        ).andExpect(status().isOk()).andDo(print());
    }
```

![image](https://user-images.githubusercontent.com/45007556/112265944-b2678f80-8cb6-11eb-9d0e-c61aab10b392.png)

@RequestBody와는 다르게 Body에 값이 있어 매핑이 안되는 상황이지만, 오류는 나지 않고 null 및 0으로 값이 들어간 것을 확인할 수 있었다.

# 참고

[https://mangkyu.tistory.com/72](https://mangkyu.tistory.com/72)  
[https://jojoldu.tistory.com/407](https://jojoldu.tistory.com/407)
