---
date: "2020-10-31"
title: Git 커밋 메세지를 수정하는 방법
category: 생각 정리
tags: [Git]
image: https://user-images.githubusercontent.com/45007556/103328013-6a134980-4a9a-11eb-9d40-6b44a80658ff.png
---

깃에 커밋하다가 메시지가 잘못 올라간 게 있어서 수정하는 방법에 대해서 알아본 것에 대해서 정리하려고 한다.

# 가장 최신인 마지막 커밋의 메세지를 수정하고 싶다!

가장 최신인 마지막 커밋에 대한 커밋 메세지를 수정하는 방법

```bash
git commit --amend -m "수정할 메세지"
git push -f
```

git commit에 **--amend** 옵션을 적용하여 최신 커밋에 덮어씌운 후 git push에 **-f** 옵션을 통해 원격 저장소에 강제로 푸쉬해주면 된다.

# 최신인 직전 커밋 메세지 말고도 다른 커밋도 수정하고 싶다!

예시로 직전 커밋부터 최근 5개의 커밋을 수정하고 싶다면 아래 처럼 pick으로 되어 있는 부분을 edit로 변경하고, 뒤에 메시지를 수정해주면 된다. 수정이 끝나면 **!wq**명령어로 저장해주면 된다.

```bash
git bash rebase -i HEAD~5
```

```
pick 584661a 소스 수정
pick 55492ca 소스 입력
pick 57692ca 소스 입력
edit fae85ea 오~ 수정이 되네?
edit 38531e6 수정 테스트

# ...
```

마지막으로 아래 명령어를 입력해주면 끝난다.

```bash
git commit --amend
git rebase --continue
git push -f
```
