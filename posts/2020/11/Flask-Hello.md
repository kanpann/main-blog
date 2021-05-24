---
date: "2020-11-23"
title: Flask 웹 프레임워크를 이용한 Hello World! 출력하기
category: Python
tags: [Python, Flask]
image: https://user-images.githubusercontent.com/45007556/99931497-1a08df00-2d98-11eb-8b9a-8024dd4b4a69.png
---

플라스크를 깊게 사용은 안해보더라도, 나중에 플라스크를 써야할 때 내가 다시 찾아보려고 정리해놓으려고 한다.

# 플라스크(Flask)란?

![image](https://user-images.githubusercontent.com/45007556/112269831-3d975400-8cbc-11eb-88ea-e9934d534fbb.png)

파이썬에서 웹 개발을 도와주는 프레임워크인데, 사람들이 흔히 '마이크로 웹 프레임워크'라고 한다. 이유는 파이썬 파일 한개만 있어도 웹 프로그램 작성이 가능하다. ~~ㄷㄷㄷ~~
마이크로 웹 프로젝트 답게 매우 경량화되어 있어서 직접 라이브러리를 설치하고 개발환경 셋팅하면서 파이썬에 더 익숙해지기 좋을 것 같다. ~~이게 싫으면 장고로 가자~~

# Hello World! 출력하기

## Flask 설치하기

> pip install flask

터미널에서 이 명령어만 쳐주게 되면 손쉽게 Flask가 설치된다.

## 코드 작성하기

```py
from flask import Flask
app = Flask(__name__)

@app.route("/")
def hello():
    return "<h1>Hello! World!</h1>"

if __name__ == "__main__":
    app.run()
```

## 플라스크 실행하기

> Flask run

해당 파이썬 경로에서 이 명령어를 쳐주면 손쉽게 실행이 된다.
![image](https://user-images.githubusercontent.com/45007556/99931839-6e608e80-2d99-11eb-98bd-721dff6bef54.png)

## 확인하기

> localhost:5000

해당 경로에 들어가서 Hello World! 메시지를 확인할 수 있다.
![image](https://user-images.githubusercontent.com/45007556/99931902-9f40c380-2d99-11eb-9c4d-1637fba6e0e8.png)

# REST API로 Hello World! 출력하기

## Flask-RESTful 설치하기

> pip install flask-restful

Flask는 이미 설치가 되어 있으니 Flask-RESTful만 추가로 설치해주면 된다.

## 코드 작성하기

```py
from flask import Flask
from flask_restful import Resource, reqparse, Api

class HelloWorld(Resource):
    def get(self):
        list = [ "Hello!", "World!" ]
        return list

app = Flask('My First App')
api = Api(app)

api.add_resource(HelloWorld, '/sayHello')

if __name__ == '__main__':
    app.run()
```

HelloWorld라는 클래스를 만들어주었는데, 이 때 메소드명을 get, post, put, delete 등으로 지어주면 자동으로 해당 요청 메소드로 매핑된다.

## 플라스크 실행하기

> flask run

해당 파이썬 경로에서 이 명령어를 쳐주면 손쉽게 실행이 된다.
![image](https://user-images.githubusercontent.com/45007556/99932130-7d940c00-2d9a-11eb-922e-65e404897d78.png)

## 확인하기

> localhost:5000/sayHello

![image](https://user-images.githubusercontent.com/45007556/99932243-d82d6800-2d9a-11eb-8c07-8406bcec48c0.png)

# 마지막으로

파이썬을 써보면서 너무 간편하고, 빠르게 여러 라이브러리를 사용해서 개발할 수 있다는 것에 매력을 느꼈는데, 플라스크는 그런 파이썬을 언어로 해서 가볍게 웹 개발을 할 수 있다는 점에서 매우 매력 있는 것 같다. 나중에 플라스크로 토이 프로젝트라도 해봐야 겠다.
