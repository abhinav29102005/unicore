package com.unicore.controller;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
@Controller
public class SpaController {
    @GetMapping({"/","/sign","/sign/","/admin","/admin/","/student","/student/","/faculty","/faculty/","/staff","/staff/","/profile","/profile/","/settings","/settings/","/courses","/courses/","/docs","/docs/"})
    public String spa(){return "forward:/index.html";}
}
