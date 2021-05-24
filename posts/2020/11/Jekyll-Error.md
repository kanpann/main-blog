---
date: "2020-11-24"
title: Jekyll 하위 버전 실행 시 오류
category: 문제 해결
tags: [Jekyll]
image: https://user-images.githubusercontent.com/45007556/103326178-75fb0d80-4a92-11eb-983c-dbd6adc70b15.png
---

지킬 테마를 다운 받아서 실행할 때 간혹 지킬 버전 호환성 때문에 오류가 날 때가 있는데, 그럴 때마다 찾아보기 귀찮아서 정리해놓음.

# 문제 상황

```bash
gimgeon-ui-MacBook-Pro:kross-jekyll-master gunkim$ jekyll server
Traceback (most recent call last):
	12: from /usr/local/bin/jekyll:23:in `<main>'
	11: from /usr/local/bin/jekyll:23:in `load'
	10: from /Users/gunkim/.gem/ruby/2.7.0/gems/jekyll-4.1.1/exe/jekyll:11:in `<top (required)>'
	 9: from /Users/gunkim/.gem/ruby/2.7.0/gems/jekyll-4.1.1/lib/jekyll/plugin_manager.rb:52:in `require_from_bundler'
	 8: from /Users/gunkim/.gem/ruby/2.7.0/gems/bundler-2.1.4/lib/bundler.rb:149:in `setup'
	 7: from /Users/gunkim/.gem/ruby/2.7.0/gems/bundler-2.1.4/lib/bundler/runtime.rb:20:in `setup'
	 6: from /Users/gunkim/.gem/ruby/2.7.0/gems/bundler-2.1.4/lib/bundler/runtime.rb:101:in `block in definition_method'
	 5: from /Users/gunkim/.gem/ruby/2.7.0/gems/bundler-2.1.4/lib/bundler/definition.rb:226:in `requested_specs'
	 4: from /Users/gunkim/.gem/ruby/2.7.0/gems/bundler-2.1.4/lib/bundler/definition.rb:237:in `specs_for'
	 3: from /Users/gunkim/.gem/ruby/2.7.0/gems/bundler-2.1.4/lib/bundler/definition.rb:170:in `specs'
	 2: from /Users/gunkim/.gem/ruby/2.7.0/gems/bundler-2.1.4/lib/bundler/spec_set.rb:80:in `materialize'
	 1: from /Users/gunkim/.gem/ruby/2.7.0/gems/bundler-2.1.4/lib/bundler/spec_set.rb:80:in `map!'
/Users/gunkim/.gem/ruby/2.7.0/gems/bundler-2.1.4/lib/bundler/spec_set.rb:86:in `block in materialize': Could not find public_suffix-4.0.5 in any of the sources (Bundler::GemNotFound)
```

# 해결 방법

1. 지킬 프로젝트 내 Gemfile.lock 파일 삭제
2. 터미널에서 **bundle install** 명령어 실행
