---
date: "2020-11-24"
title: "Jekyll 'Invalid Markdown processor given: redcarpet' 에러"
category: 문제 해결
tags: [Jekyll]
image: https://user-images.githubusercontent.com/45007556/103326178-75fb0d80-4a92-11eb-983c-dbd6adc70b15.png
---

오래된 지킬 테마를 다운 받고, 실행 시켰더니 처음 보는 종류의 빌드 오류가 발생해서 해당 내용 정리하려고 한다.

# 문제 상황

```bash
PS C:\Users\gunkim\workspace\git\gunkim0318.github.io> jekyll server
Configuration file: C:/Users/gunkim/workspace/git/gunkim0318.github.io/_config.yml
       Deprecation: You appear to have pagination turned on, but you haven't included the `jekyll-paginate` gem. Ensure you have `plugins: [jekyll-paginate]` in your configuration file.
            Source: C:/Users/gunkim/workspace/git/gunkim0318.github.io
       Destination: C:/Users/gunkim/workspace/git/gunkim0318.github.io/_site
 Incremental build: disabled. Enable with --incremental
      Generating...
Markdown processor: "redcarpet" is not a valid Markdown processor.
                    Available processors are: kramdown

  Liquid Exception: Invalid Markdown processor given: redcarpet in about.html
             ERROR: YOUR SITE COULD NOT BE BUILT:
                    ------------------------------------
                    Invalid Markdown processor given: redcarpet
                    ------------------------------------------------
      Jekyll 4.1.1   Please append `--trace` to the `serve` command
                     for any additional information or backtrace.
                    ------------------------------------------------
```

# 해결 방법

> redcarpet -> kramdown

구버전 Jekyll 3.0 미만 테마들에 한해서 redcarpet 마크다운 프로세서를 사용할 경우 오류가 나는 상황이 발생해서 \_config.yml의 markdown 항목의 **redcarpet**를 **kramdown**으로 변경해서 해결해주었음.
