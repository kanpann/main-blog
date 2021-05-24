---
date: "2020-10-06"
title: 리액트 초보의 컴포넌트에 대한 고민(feat.디자인 패턴)
category: React
tags: [React]
image: https://user-images.githubusercontent.com/45007556/95151526-d6491e80-07c5-11eb-9388-5fd48280d712.png
---

요즘 리액트에 관심이 생겨서 이것저것 해보는데 문뜩 고민이 생겼다. **컴포넌트는 재사용이 가능해야 하고, 독립적이어야 하고 작게 쪼개져야 한다**고 한다. 그런데 내가 짜논 코드를 문뜩 보니 재사용은 고사하고 그냥 jsp 코딩을 옮겨논 것 같아 리액트의 장점을 못 살리고 있다는 기분이 들었다.
찾아보던 중 솔루션이 있었는데 일단은 크게 만들고(이미 한 것), 그 다음 눈에 보이는 것을 쪼개는 방법(쪼개야 할 것이 안 보임)을 추천한다는 글을 보았다. 결과 크게 도움이 되진 않았다...

> 이럴꺼면 리액트를 왜 써? jsp를 쓰지?

그래서 리액트의 장점을 극대화할 수 있는 코딩 스타일에 대해서 찾아보았다. 그런데 리액트는 라이브러리라는 말에 맞게 사람들마다 폴더 구조를 어떻게 하고, 어떤 식으로 코딩을 하고 등에 대해서
다 제각각이었다. **(자유로운건 좋은데 내가 잘 짜고 있는게 맞냐구:예상 답변-개발에는 정답이 없읍니다..나쁜코드만 있을 뿐..)**
일단 그렇게 찾아보고, 직접 적용해보거나 의향이 있는 디자인 패턴에 대해서 정리해보려고 한다.

# Container + Presenter 패턴

![image](https://user-images.githubusercontent.com/45007556/95151526-d6491e80-07c5-11eb-9388-5fd48280d712.png)

컴포넌트를 **Container컴포넌트**와 **Presenter컴포넌트**로 나눠서 코딩하는 디자인 패턴인데,
**Presenter컴포넌트**는 로직이나 api처리 없이 Prop를 통해 전달받은 데이터를 화면에 표출시켜주기 위한 컴포넌트이고 마크업, 스타일시트 등이 포함되어 있다.
**Container컴포넌트**는 리덕스나 State, Api호출 등 디스패치나 로직 처리 등을 담당하고, 그 값을 Prop를 통해 **Presenter컴포넌트**에게 전달한다.  
처음 봤을 때 느낀 점은 보통 말하는 MVC패턴에서 Container컴포넌트를 MC로 Presenter컴포넌트를 V로 분리해놓은 듯한 모양새에서 익숙해서 반가웠던 것 같다.

마지막으로 예제 코드로 살펴보려고 한다.

_/components/List.js_

```javascript
const List = () => {
  const { loading, error, data: todoList } = useSelector(
    (state) => state.todos
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getTodos());
  }, [dispatch]);

  if (loading) {
    return <div>목록을 불러오는 중...</div>;
  }
  if (error) {
    return <div>오류입니다... 잠시 후 다시시도해주세요.</div>;
  }
  return (
    <div>
      {todoList.map((todo) => (
        <Item key={todo.id} id={todo.id} text={todo.text} check={todo.check} />
      ))}
    </div>
  );
};
```

위 코드는 부끄럽지만 나름대로 예전에 코딩해놓은 투두리스트 목록을 뿌려주는 컴포넌트 전체 코드이다. 이 코드를 나름 이해한 방식으로 Container와Presenter로 분리해보려고 한다.

_/container/ListContainer.js_

```javascript
const ListContainer = () => {
  const { loading, error, data: todoList } = useSelector(
    (state) => state.todos
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getTodos());
  }, [dispatch]);

  return <List list={todoList} loading={loading} error={error} />;
};
export default ListContainer;
```

_/components/List.js_

```javascript
const List = ({ list, loading, error }) => {
  if (loading) {
    return <div>목록을 불러오는 중...</div>;
  }
  if (error) {
    return <div>오류입니다... 잠시 후 다시시도해주세요.</div>;
  }
  return (
    <>
      {list.map((todo) => (
        <Item key={todo.id} id={todo.id} text={todo.text} check={todo.check} />
      ))}
    </>
  );
};
List.defaultProps = {
  list: [],
  loading: false,
  error: true,
};

export default List;
```

자 이렇게 리덕스를 통해 state를 받아오거나, 디스패치하는 로직은 Container컴포넌트로 분리하고, state값을 Props를 통해 Presenter컴포넌트로 전달하도록 컴포넌트를 분리해보았다.

# Atomic 패턴

> 그냥 처음부터 쪼개진 상태로 개발하는 방법은 없을까?

위와 같은 생각으로 찾아본 패턴인데, 이름처럼 작은 원자들을 합쳐서 하나의 큰 덩어리를 만드는 개발 방법이다. 간단하게 가장 작은 원자들을 모아 분자를 만들고, 분자들을 모아 유기체를 만들어 실제 화면에 보여준다고 보면 된다.

리액트를 공부하면서 남들 따라 컴포넌트를 만들어왔는데, 어느 정도 나도 모르게 이 패턴대로 작은 컴포넌트들을 조합해서 Templates를 만들고 Pages를 만들고 하는 식으로 코딩은 했었던 것 같다.

> 그럼 이미 적용 중인거 아냐?

그런데 이 패턴에서 중요한건 크기가 커질수록 재사용성이 떨어지기 마련이다. 그러면 원소들을 얼마 만큼 재사용 가능하게 만드느냐가 이 패턴의 중점인 것 같다. 흉내만 냈다고 보는 게 맞을 것이다.

> 이름이 원자 패턴 답게 먼저 각 단위에 대한 이해가 필요하다.

![image](https://user-images.githubusercontent.com/45007556/95158784-70fe2900-07d7-11eb-9383-61f830bd261f.png)

- **Atoms**: 가장 작은 단위의 컴포넌트. 대표적인 form요소인 Label, Input, CheckBox, Select 등이 위치한 가장 하위 요소. 재사용이 가능하게끔 특정 기능을 구현하는 것이 아니라 일반적인 사용이 가능하도록 만들고, 기능을 수행하더라도 Props를 통해 함수를 주입 받아서 수행하도록 만든다.
- **Molecules**: 2개 이상의 원자로 구성된 컴포넌트. 단순한 UI 컴포넌트들 Label+Input 등의 단순한 조합.
- **Organisms**: 하나의 인터페이스를 형성하는 컴포넌트. Header, Navigation 등이 여기에 속한다.
- **Templates**: 인터페이스들을 모아 레이아웃을 형성하는 컴포넌트. 컴포넌트들을 주입받아 로직이 아닌 스타일링에 집중한다.
  ![image](https://user-images.githubusercontent.com/45007556/95160850-90e41b80-07dc-11eb-9cb3-0734d4084813.png)

- **Pages**: 실제 페이지를 구성하는 컴포넌트. Template에 컴포넌트 및 데이터들을 주입해주어서 레이아웃을 구성할 수 있게 해준다. 사용자가 직접적으로 보는 화면과 동일하다.

## 고민

state를 props를 통해 내리고 내리고 하는 점 때문에 redux및 상태관리 라이브러리를 사용하는데, 최상위인 Pages에서 state 및 함수 등을 Props를 통해 내려줘야 한다. 그러면 상태관리 라이브러리를 도입한 메리트가 없어지는 건 아닌가 하는 고민을 하게 된다. 그리고 보통 사람들이 Top-Down(크게 만들어서 쪼갠다) 방식을 선호하는 데에 비해 Down-Top(작게 만들어서 크게 만든다)방식이라서 개발 전에 설계 시간이 오래 걸릴 것 같다. 일단 개발을 해보면서 느껴봐야 할 것 같다.

# 마지막으로

리액트는 정말 자유로운 라이브러리인 것 같다. 하지만 너무 자유롭다 보니 프레임워크 위주로 무언가 틀 안에서 코딩을 해왔다면 자유롭게 코딩하라고 시키면 나처럼 헤매는 경우도 많을 것 같다. 그리고 코딩을 하기 전에 폴더 구조는 어떻게 해야 하고, 컴포넌트는 어떻게 만들어야 하고, 고민하다 보면 코드 작성은 뒷전이고 고민만 하게 된다. 그런 점에서 많은 사람들이 택한 디자인 패턴들을 공부하다 보면 패턴 속에 녹아 있는 리액트의 개발 철학들을 흡수할 수 있게 되어 좋은 것 같다.
