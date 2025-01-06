package com.myportfolio.apigateway.api;

import com.myportfolio.apigateway.dto.JwtToken;
import com.myportfolio.apigateway.dto.UserCredentials;
import com.myportfolio.apigateway.model.UserModel;
import com.myportfolio.apigateway.service.AuthenticationService;
import com.myportfolio.apigateway.service.UserDetailsServiceImpl;
import com.myportfolio.apigateway.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin
public class AuthController {

    @Autowired
    private AuthenticationService authenticationService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @PostMapping("/login")
    public JwtToken login(@RequestBody UserCredentials userCredentials){

      return authenticationService.loginUser(userCredentials);

    }

    @GetMapping("/jwtToken/{jwt}")
    public String getToken(@PathVariable String jwt){
        String username=jwtUtil.getUsernameFromToken(jwt);
        return userDetailsService.loadUser(username).getUsername();
    }

}
