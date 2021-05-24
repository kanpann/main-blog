---
date: "2020-08-09"
title: 스프링 부트(Spring Boot) + 스프링 시큐리티(Spring Security) + JWT(Json Web Token) 연동하기
category: Spring
tag: [Spring Boot, Spring Security, Jwt]
image: https://user-images.githubusercontent.com/45007556/91056380-e0252100-e660-11ea-8e46-241b38268250.png
---

사실 아래 게시물은 스프링 부트 + 리액트 개발을 하는데 로그인 처리를 위해 JWT와 스프링 시큐리티를 연동해보기 위해서 스프링 시큐리티를 정리한 게시물이었다. 이번 게시물 이해를 위해서는 아래에 이전 포스트를 먼저 보고오면 좋을 듯 하다.

이번에는 스프링 시큐리티 + JWT 연동을 정리해보려고 한다. 너무 글이 소스로 도배되는 것 같아서 임포트 부분을 제외하고, 핵심 소스 위주로 작성해보려고 한다. 자세한 소스는 여기서 확인해볼 수 있다. [예제 프로젝트](https://github.com/gunkim0318/springboot-security-jwt)

# 의존성 추가

jwt처리를 위한 라이브러리를 추가해주었다.

```java
implementation group: 'io.jsonwebtoken', name: 'jjwt', version: '0.9.1'
```

# JWT 생성 및 파싱을 위한 유틸 작성

```java
/**
 * JWT 발급 및 파싱을 위한 유틸
 */
@ToString
@Component
public class JwtUtil {
    @Value("${jwt.token.secret-key}")
    private String secretKey;
    @Value("${jwt.token.expTime}")
    private long expirationTime;
    @Value("${jwt.token.issuer}")
    private String issuer;

    /**
     * JWT 토큰 생성
     * @param username
     * @param authorities
     * @return
     */
    public String createToken(String username, List<GrantedAuthority> authorities){
        Claims claims = Jwts.claims().setSubject(username);
        claims.put("roles", authorities.stream().map(role -> role.toString()).collect(Collectors.toList()));

        LocalDateTime currentTime = LocalDateTime.now();

        return Jwts.builder()
                .setClaims(claims)
                .setIssuer(ISSUER)
                .setIssuedAt(Date.from(currentTime.atZone(ZoneId.systemDefault()).toInstant()))
                .setExpiration(Date.from(currentTime.plusMinutes(EXPIRATION_TIME)
                        .atZone(ZoneId.systemDefault()).toInstant()))
                .signWith(SignatureAlgorithm.HS512, SECRET_KEY)
                .compact();
    }

    /**
     * JWT 토큰 파싱
     * @param token
     * @return
     * @throws BadCredentialsException
     * @throws JwtExpiredTokenException
     */
    public Jws<Claims> parserToken(String token) throws BadCredentialsException, JwtExpiredTokenException{
        Jws<Claims> claimsJws = null;
        try {
            claimsJws = Jwts.parser().setSigningKey(SECRET_KEY).parseClaimsJws(token);
        } catch (UnsupportedJwtException | MalformedJwtException | IllegalArgumentException | SignatureException ex) {
            throw new BadCredentialsException("Invalid JWT token: ", ex);
        } catch (ExpiredJwtException expiredEx) {
            throw new JwtExpiredTokenException(claimsJws.toString(), "JWT Token expired", expiredEx);
        }
        return claimsJws;
    }
}
```

토큰 발행자 정보 및 유효기간 암호화 키 정보를 프로퍼티를 통해서 읽어온 정보를 토대로 파싱 및 토큰 생성하는 JWT 전용 유틸이다.

# 비동기(POST) 로그인 처리 흐름

![image](https://user-images.githubusercontent.com/45007556/91056380-e0252100-e660-11ea-8e46-241b38268250.png)

## Filter 작성

```java
/**
 * 비동기 로그인 처리를 위한 시큐리티 필터
 */
@Slf4j
public class AsyncLoginProcessingFilter extends AbstractAuthenticationProcessingFilter {
    private final ObjectMapper objectMapper;

    private final AuthenticationSuccessHandler authenticationSuccessHandler;
    private final AuthenticationFailureHandler authenticationFailureHandler;
    public AsyncLoginProcessingFilter(String defaultFilterProcessesUrl, ObjectMapper objectMapper, AuthenticationSuccessHandler authenticationSuccessHandler, AuthenticationFailureHandler authenticationFailureHandler) {
        super(defaultFilterProcessesUrl);
        this.objectMapper = objectMapper;
        this.authenticationSuccessHandler = authenticationSuccessHandler;
        this.authenticationFailureHandler = authenticationFailureHandler;
    }

    /**
     * 비동기 post형식으로 온 요청에 대해 username, password를 받아 토큰 생성 후 AuthenticationManager에게 전달함.
     * @param request
     * @param response
     * @return
     * @throws AuthenticationException
     * @throws IOException
     * @throws ServletException
     */
    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException, IOException, ServletException {
        if(this.isNotPostMethod(request) || this.isNotAsync(request)){
            log.debug("비동기 로그인 처리 지원이 되지 않는 메소드 요청입니다. :: "+request.getMethod());
            throw new AuthMethodNotSupportedException("Authentication method not supported");
        }
        LoginRequest loginRequest = objectMapper.readValue(request.getReader(), LoginRequest.class);
        UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword());
        return this.getAuthenticationManager().authenticate(token);
    }

    /**
     * 인증(Authentication) 성공 시 실행
     * @param request
     * @param response
     * @param chain
     * @param authResult
     * @throws IOException
     * @throws ServletException
     */
    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain, Authentication authResult) throws IOException, ServletException {
        //성공 시 처리 로직을 SuccessHandler에 위임함.
        authenticationSuccessHandler.onAuthenticationSuccess(request, response, authResult);
    }

    /**
     * 인증(Authentication) 실패 시 실행
     * @param request
     * @param response
     * @param failed
     * @throws IOException
     * @throws ServletException
     */
    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response, AuthenticationException failed) throws IOException, ServletException {
        //실패 시 처리 로직을 FailureHandler에 위임함.
        authenticationFailureHandler.onAuthenticationFailure(request, response, failed);
    }

    /**
     * 비동기 요청이 아닌 지 확인
     * @param request
     * @return
     */
    private boolean isNotAsync(HttpServletRequest request) {
        return !"XMLHttpRequest".equals(request.getHeader("X-Requested-With"));
    }

    /**
     * POST 요청이 아닌 지 확인
     * @param request
     * @return
     */
    private boolean isNotPostMethod(HttpServletRequest request){
        return !HttpMethod.POST.name().equals(request.getMethod());
    }
}
```

사용자 요청이 들어오면 해당 필터 attemptAuthentication 메소드가 실행되어 POST요청이고, 비동기 요청인지 확인 후 맞으면 요청할 때 넘어온 username, password를 가지고 토큰을 생성하여 AuthenticationManager로 전달한다.

## Service 작성

```java
/**
 * 유저 정보를 반환하는 클래스
 */
@Slf4j
@RequiredArgsConstructor
@Service
public class CustomUserDetailsService implements UserDetailsService {
    private final MemberRepository memberRepository;

    /**
     * 유저 정보를 조회 후 반환.
     * @param username
     * @return
     * @throws UsernameNotFoundException
     */
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Member member = memberRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("해당 유저를 찾을 수 없습니다. :::"+username));

        Collection<SimpleGrantedAuthority> roles = new ArrayList<>();
        roles.add(new SimpleGrantedAuthority(member.getRole().getValue()));

        return new User(member.getUsername(), member.getPassword(), roles);
    }
}
```

스프링 시큐리티의 UserDetatilsService를 상속받은 후 DB에서 유저 정보를 조회하는 메소드를 구현해주었다.

## Provider 작성

```java
/**
 * 비동기 로그인에 대한 실질적인 인증 처리 로직이 구현된 클래스
 */
@Slf4j
@RequiredArgsConstructor
@Component
public class AsyncAuthenticationProvider implements AuthenticationProvider {
    private final PasswordEncoder passwordEncoder;
    private final CustomUserDetailsService customUserDetailsService;

    /**
     * 인증 처리 로직
     * @param authentication
     * @return
     * @throws AuthenticationException
     */
    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        if(authentication == null){
            throw new IllegalArgumentException("authentication 발급 오류");
        }

        String username = (String) authentication.getPrincipal();
        String password = (String) authentication.getCredentials();

        UserDetails user = customUserDetailsService.loadUserByUsername(username);

        if(!passwordEncoder.matches(password, user.getPassword())){
            throw new BadCredentialsException("인증 실패. username or password 불일치");
        }
        List<GrantedAuthority> authorities = user.getAuthorities().stream()
                .map(authority -> new SimpleGrantedAuthority(authority.getAuthority()))
                .collect(Collectors.toList());

        return new UsernamePasswordAuthenticationToken(user.getUsername(), null, authorities);
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return (UsernamePasswordAuthenticationToken.class.isAssignableFrom(authentication));
    }
}
```

필터로 부터 전달받은 Authentication(아이디, 비밀번호)와 UserDetails(DB에서 불러온 사용자 정보)를 가지고 인증 처리를 한다.

## SuccessHandler 작성

```java
/**
 * 비동기 로그인 성공 처리 핸들러
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class AsyncLoginAuthenticationSuccessHandler implements AuthenticationSuccessHandler {
    private final ObjectMapper objectMapper;

    /**
     * 성공 시 처리 로직.
     * TODO: 토큰을 발행하여 response해준다.
     * @param request
     * @param response
     * @param authentication
     * @throws IOException
     * @throws ServletException
     */
    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        String username = (String) authentication.getPrincipal();
        List<GrantedAuthority> authorities = (List<GrantedAuthority>) authentication.getAuthorities();
        String jwtToken = JwtUtil.createToken(username, authorities);

        response.setStatus(HttpStatus.OK.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        objectMapper.writeValue(response.getWriter(), jwtToken);

        HttpSession session = request.getSession(false);

        if (session != null) {
            session.removeAttribute(WebAttributes.AUTHENTICATION_EXCEPTION);
        }
    }
}
```

로그인이 성공되었기 때문에 JWT 토큰을 생성하여 토큰을 응답해준다.

## FailureHandler 작성(아래 확인)

# JWT Token 인증(로그인 확인) 처리 대략적인 흐름

![image](https://user-images.githubusercontent.com/45007556/104460703-c5dce700-55f1-11eb-8931-991164f48a52.png)

## Filter 작성

```java
/**
 * JWT 토큰 유효성 검증을 위한 시큐리티 필터
 */
@Slf4j
public class JwtTokenAuthenticationProcessingFilter extends AbstractAuthenticationProcessingFilter {
    private final AuthenticationFailureHandler failureHandler;

    public JwtTokenAuthenticationProcessingFilter(RequestMatcher matcher, AuthenticationFailureHandler failureHandler) {
        super(matcher);
        this.failureHandler = failureHandler;
    }

    /**
     * 요청 Header에서 JWT토큰을 획득하여 JwtAuthenticationToken 토큰을 생성함.
     * @param request
     * @param response
     * @return
     * @throws AuthenticationException
     * @throws IOException
     * @throws ServletException
     */
    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException{
        String tokenPayload = request.getHeader(SecurityConfig.AUTHENTICATION_HEADER_NAME);

        Jws<Claims> claimsJws = JwtUtil.parserToken(tokenPayload);

        return getAuthenticationManager().authenticate(new JwtAuthenticationToken(claimsJws));
    }

    /**
     * 인증(Authentication) 성공 시 실행
     * @param request
     * @param response
     * @param chain
     * @param authResult
     * @throws IOException
     * @throws ServletException
     */
    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain, Authentication authResult) throws IOException, ServletException {
        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(authResult);
        SecurityContextHolder.setContext(context);
        chain.doFilter(request, response);
    }

    /**
     * 인증(Authentication) 실패 시 실행
     * @param request
     * @param response
     * @param failed
     * @throws IOException
     * @throws ServletException
     */
    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response, AuthenticationException failed) throws IOException, ServletException {
        SecurityContextHolder.clearContext();
        //FailureHandler에 처리 로직 위임
        failureHandler.onAuthenticationFailure(request, response, failed);
    }
}
```

로그인을 하게 되면 프론트에서는 발급받은 토큰을 헤더에 추가하여 요청을 하게 된다. 그러면 이제 필터에 attemptAuthentication 메소드가 실행되어 헤더에서 획득한 토큰을 가지고 유효한 토큰인지를 검증하고 유효할 경우 Authentication을 생성하여 AuthenticationManager로 전달한다.

## Provider 작성

```java
/**
 * JWT 토큰 유효성 검증을 위한 실질 적인 인증 로직이 구현된 클래스
 */
@Slf4j
@RequiredArgsConstructor
@Component
@SuppressWarnings("unchecked")
public class JwtAuthenticationProvider implements AuthenticationProvider {
    private final AuthenticationFailureHandler failureHandler;

    /**
     * JWT 유효성 검증
     * @param authentication
     * @return
     * @throws AuthenticationException
     */
    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        Jws<Claims> jwsClaims = (Jws<Claims>)authentication.getCredentials();
        String subject = jwsClaims.getBody().getSubject();
        List<String> roles = jwsClaims.getBody().get("roles", List.class);

        List<GrantedAuthority> authorities = roles.stream()
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());

        return new JwtAuthenticationToken(subject, authorities);
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return (JwtAuthenticationToken.class.isAssignableFrom(authentication));
    }
}
```

Provider는 AuthenticationException이 발생하면 실패, Authentication을 반환하면 성공으로 보기 때문에

Authentication을 생성하여 인증(Authentication)에 성공하도록 한다.

## 인증(Authentication) 실패 시 핸들러 작성

```java
/**
 * 공통 실패 처리 핸들러
 */
@Component
@RequiredArgsConstructor
public class CommonAuthenticationFailureHandler implements AuthenticationFailureHandler {
    private final ObjectMapper objectMapper;

    /**
     * 실패 시 처리 로직
     * TODO: 예외에 따른 메시지를 response 해줌.
     * @param request
     * @param response
     * @param exception
     * @throws IOException
     * @throws ServletException
     */
    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception) throws IOException, ServletException {
        response.setStatus(HttpStatus.UNAUTHORIZED.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");

        String msg = "인증 실패";
        if (exception instanceof BadCredentialsException) {
            msg = "비밀번호 불일치";
        } else if (exception instanceof AuthMethodNotSupportedException) {
            msg = "해당 요청으로 인한 로그인 미지원";
        } else if(exception instanceof JwtExpiredTokenException){
            msg = "JWT 토큰 유효기간 만료";
        }
        objectMapper.writeValue(response.getWriter(), msg);
    }
}

```

로그인 처리할 때와 공통으로 사용하기 위해 만든 실패 처리 핸들러. 예외에 따른 메시지를 응답해준다.

# 비밀번호 암호화를 위한 PasswordEncoder 빈 등록

```java
/**
 * PasswordEncoder 빈 등록을 위한 클래스
 */
@Configuration
public class PasswordConfig {
    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }
}
```

BCrypt 알고리즘을 구현한 구현체를 등록해주었다. 스프링 시큐리티 패스워드 암호화를 사용하기 위한 빈 등록

# 스프링 시큐리티 설정

```java
/**
 * 스프링 시큐리티 설정을 위한 클래스
 */
@RequiredArgsConstructor
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    public static final String AUTHENTICATION_HEADER_NAME = "Authorization"; //요청 시 토큰이 넘어오는 헤더 이름
    public static final String AUTHENTICATION_URL = "/api/auth/login"; //로그인 요청 URL
    public static final String API_ROOT_URL = "/api/**";

    private final AuthenticationSuccessHandler successHandler;
    private final AuthenticationFailureHandler failureHandler;

    private final AsyncAuthenticationProvider asyncAuthenticationProvider;
    private final JwtAuthenticationProvider jwtAuthenticationProvider;

    public final ObjectMapper objectMapper;

    /**
     * 시큐리티 설정
     * @param http
     * @throws Exception
     */
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        List<String> permitAllEndpointList = Arrays.asList(
                AUTHENTICATION_URL
        );
        http
                .csrf().disable()
                .exceptionHandling()
                .and()
                .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                .authorizeRequests()
                .antMatchers("/api/say/adminHello").hasAnyRole(Role.ADMIN.name())
                .antMatchers("/api/say/userHello").hasAnyRole(Role.USER.name())
                .and()
                .addFilterBefore(buildAjaxLoginProcessingFilter(), UsernamePasswordAuthenticationFilter.class)
                .addFilterBefore(buildJwtTokenAuthenticationProcessingFilter(permitAllEndpointList, API_ROOT_URL), UsernamePasswordAuthenticationFilter.class);
    }

    /**
     * Provider 등록
     * @param auth
     */
    @Override
    protected void configure(AuthenticationManagerBuilder auth) {
        auth.authenticationProvider(jwtAuthenticationProvider);
        auth.authenticationProvider(asyncAuthenticationProvider);
    }

    /**
     * 비동기 로그인 처리를 위한 필터 생성하고, authenticationManager를 등록해줌. 후에 반환.
     * @return
     * @throws Exception
     */
    private AsyncLoginProcessingFilter buildAsyncLoginProcessingFilter() throws Exception {
        AsyncLoginProcessingFilter filter = new AsyncLoginProcessingFilter(AUTHENTICATION_URL, objectMapper, successHandler, failureHandler);
        filter.setAuthenticationManager(this.authenticationManager());
        return filter;
    }

    /**
     * 토큰 검즈을 위한 필터 생성하고, authenticationManager를 등록해줌. 후에 반환.
     * @param pathsToSkip
     * @param pattern
     * @return
     * @throws Exception
     */
    private JwtTokenAuthenticationProcessingFilter buildJwtTokenAuthenticationProcessingFilter(List<String> pathsToSkip, String pattern) throws Exception {
    	//해당하는 URL에 대한 요청은 필터링하지 않기 위한 객체
        SkipPathRequestMatcher matcher = new SkipPathRequestMatcher(pathsToSkip, pattern);
        JwtTokenAuthenticationProcessingFilter filter = new JwtTokenAuthenticationProcessingFilter(matcher, failureHandler);
        filter.setAuthenticationManager(this.authenticationManager());
        return filter;
    }
}
```

## configure(HttpSecurity http)

- sessionCreationPolicy(SessionCreationPolicy.STATELESS) - 스프링 시큐리티의 세션-쿠키 방식을 사용 안함

- antMatchers("/api/say/adminHello").hasAnyRole(Role.ADMIN.name()) - /api/say/adminHello에 대한 URL은 admin권한을 가진 계정만이 접근할 수 있음

- antMatchers("/api/say/userHello").hasAnyRole(Role.USER.name()) - /api/say/userHello에 대한 URL은 user권한을 가진 계정만이 접근할 수 있음

- addFilterBefore(buildAsyncLoginProcessingFilter(), UsernamePasswordAuthenticationFilter.class) - 스프링 시큐리티 필터 체인 UsernamePasswordAuthenticationFilter 필터 앞에 임의로 만든 AsyncLoginProcessingFilter를 끼워넣음

- addFilterBefore(buildJwtTokenAuthenticationProcessingFilter(permitAllEndpointList, API_ROOT_URL), UsernamePasswordAuthenticationFilter.class) - 스프링 시큐리티 필터 체인UsernamePasswordAuthenticationFilter 필터 앞에 임의로 만든 JwtTokenAuthenticationProcessingFilter를 끼워넣음

## configure(AuthenticationManagerBuilder auth)

실제 인증 처리 로직이 구현된 Provider들을 등록함.

## 그 외 필터 인스턴스 생성 메소드

인스턴스 생성 후 AuthenticationManager를 주입해주기 위해서 작성함.

# 그러면 AuthenticationManager는 Provider를 어떻게 할당 받을까?

스프링 시큐리티를 공부해보면 AuthenticationManager는 AuthenticationProvider에게 실질적인 인증 처리를 위임한다고 한다.

하지만 지금까지 본 코드를 보았을 때 SecurityConfig를 통해 Provider를 등록해주는 코드는 있어도, Filter이나 AuthenticationManager에게 직접적으로 어떤 Provider를 쓸 것이라고 주입해주는 코드는 없다. 만약 여러개의 Provider가 등록이 되어 있을 경우, AuthenticationManager는 어떻게 어떤 Provider에게 위임할 지를 결정할까?

## 둘 이상의 Provider가 전달된 경우 Authentication을 가지고 판단한다.

AuthenticationManager을 구현한 ProviderManager [API문서](https://docs.spring.io/spring-security/site/docs/4.2.15.RELEASE/apidocs/org/springframework/security/authentication/ProviderManager.html#authenticate-org.springframework.security.core.Authentication-)를 보면 둘 이상의 Provider가 등록된 경우 Authentication을 처리할 수 있는 Provider를 찾아 할당한다고 한다.

### 비동기 로그인 처리 시 Filter-Provider 코드

```java
UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword());
return this.getAuthenticationManager().authenticate(token);
```

```java
@Override
public boolean supports(Class<?> authentication) {
    return (UsernamePasswordAuthenticationToken.class.isAssignableFrom(authentication));
}
```

### JWT 토큰 인증 시 Filter-Provider 코드

```java
return getAuthenticationManager().authenticate(new JwtAuthenticationToken(claimsJws));
```

```java
@Override
public boolean supports(Class<?> authentication) {
    return (JwtAuthenticationToken.class.isAssignableFrom(authentication));
}
```

해당 소스들을 보면 supports에 지원하는 토큰 타입을 명시해놓았다. 그래서 이것을 가지고 필터에서 전달하는 토큰 타입을 확인하여 Provider를 매칭해준다는 것을 알 수 있다.

# 끝으로

그냥 간단히 JWT서비스를 만들어 토큰을 발행하는 식으로 구현하려고 했는데 스프링 시큐리티와도 한번 연동해보는 것도 좋을 것 같아 진행해보았다.

스프링 시큐리티에 대한 이해도만 높다면 얼마든지 마음대로 스프링 시큐리티를 커스텀할 수 있을 것 같다.

# 참고

[https://github.com/svlada/springboot-security-jwt/tree/master/src/main/java/com/svlada/security/auth/ajax](https://github.com/svlada/springboot-security-jwt/tree/master/src/main/java/com/svlada/security/auth/ajax)
