---
date: "2021-03-23"
title: JavaScript에서 Byte로 문자열 자르기
tags: [JavaScript]
category: JavaScript
image: https://user-images.githubusercontent.com/45007556/99826279-7c48c080-2b9b-11eb-8cce-3c92f971c803.png
draft: false
---

[Java에서 Byte로 문자열 자르기](/Java-Byte-String)에서 한번 소개했던 적은 있는데, 이번엔 JS에서 해야 하는 상황이 발생했다.
![image](https://user-images.githubusercontent.com/45007556/112081265-b7e5ac80-8bc6-11eb-8078-8d173f4f1e58.png)

블로그 목록 표출 시 제목이 너무 긴 게시물들이 있어서 20글자로 제한하려고 했는데, 영어로 된 게시물들의 경우 20글자로 자르게 되면 한글보다 엄청 짧아지는 경향이 있기 때문이었다.

그래서 한글은 20글자, 영어는 40글자 정도로 제한하는 게 어떨까 해서 생각해 본 방법 중 Byte로 제한하는 방법이 떠오르게 되어서 찾아보게 되었다. 그런데 JS에서 공식적으로 지원해 주는 함수는 없어서, 직접 만들어서 해결했다. 오늘은 그 방법에 대해 작성해보려고 한다.

# 예제

```js
const targetStr = "Hello World!";
let buffer = 0;
let idx = 0;
while (true) {
  const unicode = targetStr.charCodeAt(idx);
  buffer += unicode > 127 ? 2 : 1;

  if (buffer > 4) break;
  idx++;
}
let result = targetStr.substring(0, idx);
console.log(result); //Hell
```

해당 예제는 "Hello World!"라는 문자열을 앞에서부터 4Byte 만큼 자르는 예제이다.
생각보다 쉽게 구현했는데, 한 글자씩 유니코드가 127을 넘는지 확인 후 넘을 경우 2byte, 안 넘을 경우 1byte로 판단해 buffer 변수에 쌓아주었다. 그리고 계속 반복하다 buffer 변수의 값이 4를 넘어설 경우 해당 idx까지 문자열에서 잘라주었다.

# 함수로 만들기

```js
function substrToByte(targetStr, maxByte) {
  let buffer = 0;
  let idx = 0;
  while (true) {
    const unicode = targetStr.charCodeAt(idx);
    buffer += unicode > 127 ? 2 : 1;

    if (buffer > maxByte) break;
    idx++;
  }
  return targetStr.substring(0, idx);
}
console.log(substrToByte("Hello", 2)); //He
```

재활용이 가능하도록 함수로 만들어보았다. 필요할 때 사용하면 될 것 같다.
