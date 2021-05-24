function Category(image, descript) {
  this.image = image
  this.descript = descript
}
module.exports = {
  SiteMeta: {
    title: 'Gunlog',
    url: 'https://gunlog.dev',
    descript: '공부한 내용들을 정제하기 위한 블로그입니다.',
    info: {
      author: 'Gun kim',
      image: 'https://avatars.githubusercontent.com/u/45007556?v=4',
      descript: '안녕하세요. 공부한 내용들을 정제하기 위해서 블로그를 시작했습니다.',
      github: 'https://github.com/gunkims',
      email: 'gunkim.dev@gmail.com',
    },
    gitalk: {
      clientID: '950a9f1473b04652cbc0',
      clientSecret: '6b42fe4d369ba3a4918c0b629b35115111fb33ac',
      repo: 'blog-gitalk',
      owner: 'gunkims',
      admin: ['gunkims'],
    },
  },
  Category: {
    About: {
      isSub: false,
      sub: [],
      url: '/about',
    },
    '생각 정리': {
      isSub: false,
      sub: [],
    },
    Java: {
      isSub: true,
      sub: ['Spring', 'Kotlin'],
    },
    JavaScript: { isSub: true, sub: ['React', 'Vue'] },
    Linux: {
      isSub: false,
      sub: [],
    },
    '전공 지식': {
      isSub: true,
      sub: ['자료구조'],
    },
    '문제 해결': {
      isSub: false,
      sub: [],
    },
  },
  CategoryInfo: {
    Spring: new Category(
      'https://user-images.githubusercontent.com/45007556/103328175-0e958b80-4a9b-11eb-9db7-66230e0f057c.png',
      '스프링에 대한 글들을 모아놓은 카테고리입니다.',
    ),
    JavaScript: new Category(
      'https://user-images.githubusercontent.com/45007556/99826279-7c48c080-2b9b-11eb-8cce-3c92f971c803.png',
      '자바스크립트에 대한 글들을 모아놓은 카테고리입니다.',
    ),
    React: new Category(
      'https://user-images.githubusercontent.com/45007556/118911253-dcf56200-b960-11eb-83ec-fc42d522f231.png',
      '리액트에 대한 글들을 모아놓은 카테고리입니다.',
    ),
    Vue: new Category(
      'https://user-images.githubusercontent.com/45007556/111740934-f6c6ea00-88c8-11eb-8a49-c1f112655c81.png',
      '뷰에 대한 글들을 모아놓은 카테고리입니다.',
    ),
    Java: new Category(
      'https://media.vlpt.us/images/ym1085/post/67c7a3b2-3d80-4d40-887a-a4f500772e76/java.png',
      '자바에 대한 글들을 모아놓은 카테고리입니다.',
    ),
    '생각 정리': new Category(
      'https://user-images.githubusercontent.com/45007556/118910646-cdc1e480-b95f-11eb-88ab-f2f569186774.jpg',
      '생각 정리를 위한 카테고리입니다.',
    ),
    Linux: new Category(
      'https://user-images.githubusercontent.com/45007556/118910801-137ead00-b960-11eb-9260-c79ffa63a036.png',
      '리눅스에 대한 글들을 모아놓은 카테고리입니다.',
    ),
    '전공 지식': new Category(
      'https://user-images.githubusercontent.com/45007556/118910888-3ad57a00-b960-11eb-9547-3420775bf0e4.jpg',
      '전공 지식에 대한 글들을 모아놓은 카테고리입니다.',
    ),
    자료구조: new Category(
      'https://user-images.githubusercontent.com/45007556/118910981-5e002980-b960-11eb-906b-dc6a97654ec7.jpg',
      '자료구조에 대한 글들을 모아놓은 카테고리입니다.',
    ),
    Kotlin: new Category(
      'https://user-images.githubusercontent.com/45007556/118911050-7cfebb80-b960-11eb-860b-b118f1453f36.png',
      '코틀린에 대한 글들을 모아놓은 카테고리입니다.',
    ),
    '문제 해결': new Category(
      'https://user-images.githubusercontent.com/45007556/118911136-ad465a00-b960-11eb-8cbd-6791b04fb871.jpg',
      '개발을 하면서 해결한 문제에 대한 해결 방법에 대한 글들을 모아놓은 카테고리입니다.',
    ),
  },
}
