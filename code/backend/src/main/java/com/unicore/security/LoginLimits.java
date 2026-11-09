package com.unicore.security;
import java.util.*;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
@Component
public class LoginLimits {
    private final Map<String,Deque<Long>> hits=new HashMap<>();
    public synchronized void check(String email,String ip){
        long now=System.currentTimeMillis();hits.values().forEach(q->{while(!q.isEmpty()&&q.peek()<now-900000)q.remove();});hits.entrySet().removeIf(e->e.getValue().isEmpty());
        if(hits.size()>5000)throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS,"Sign-in is busy");
        for(String key:List.of("user:"+email,"ip:"+ip)) {
            var q=hits.computeIfAbsent(key,k->new ArrayDeque<>());
            if(q.size()>=(key.startsWith("user:")?8:40))throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS,"Too many attempts. Try again in 15 minutes");
        }
        hits.get("user:"+email).add(now);hits.get("ip:"+ip).add(now);
    }
    public synchronized void success(String email,String ip){hits.remove("user:"+email);var q=hits.get("ip:"+ip);if(q!=null&&!q.isEmpty())q.removeLast();}
}
