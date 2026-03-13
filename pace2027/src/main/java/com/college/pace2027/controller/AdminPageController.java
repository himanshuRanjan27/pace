package com.college.pace2027.controller;

import com.college.pace2027.dto.SportDto;
import com.college.pace2027.service.SportService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@Controller
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminPageController {

    private final SportService sportService;

    @GetMapping("/login")
    public String loginPage() {
        return "admin/login";
    }

    @GetMapping("/dashboard")
    public String dashboard(Model model) {
        List<SportDto> sports = sportService.getAllSports();
        model.addAttribute("sports", sports);
        return "admin/dashboard";
    }
}