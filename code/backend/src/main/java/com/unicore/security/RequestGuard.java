package com.unicore.security;

import jakarta.servlet.*;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.util.Arrays;
import java.util.Set;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.*;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

public class RequestGuard extends OncePerRequestFilter {
    private final Set<String> origins;private final UserDetailsService users;
    public RequestGuard(String origin,UserDetailsService users){
        this.origins = origin == null ? Set.of() : Set.copyOf(Arrays.stream(origin.split(",")).map(String::trim).toList());
        this.users = users;
    }
    protected void doFilterInternal(HttpServletRequest q,HttpServletResponse r,FilterChain chain)throws ServletException,IOException {
        String reqOrigin = q.getHeader("Origin");
        if(!Set.of("GET","HEAD","OPTIONS").contains(q.getMethod()) && (reqOrigin != null && !origins.contains(reqOrigin))) {
            r.setStatus(403);r.setContentType("application/json");r.getWriter().write("{\"error\":\"Request origin denied\"}");return;
        }
        var auth=SecurityContextHolder.getContext().getAuthentication();
        if(auth!=null && auth.getPrincipal() instanceof UserDetails old) {
            try {
                var current=users.loadUserByUsername(old.getUsername());
                if(!current.isEnabled() || !current.getPassword().equals(old.getPassword()))throw new UsernameNotFoundException("Session revoked");
                SecurityContextHolder.getContext().setAuthentication(UsernamePasswordAuthenticationToken.authenticated(current,null,current.getAuthorities()));
            } catch(UsernameNotFoundException ex) {
                var session=q.getSession(false);if(session!=null)session.invalidate();SecurityContextHolder.clearContext();
                r.setStatus(401);r.setContentType("application/json");r.getWriter().write("{\"error\":\"Session expired. Sign in again\"}");return;
            }
        }
        chain.doFilter(q,r);
    }
}
