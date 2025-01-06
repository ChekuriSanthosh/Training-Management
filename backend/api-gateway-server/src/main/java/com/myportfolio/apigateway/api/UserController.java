package com.myportfolio.apigateway.api;

import com.myportfolio.apigateway.model.UserModel;
import com.myportfolio.apigateway.service.UserCrudService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth/register")
@CrossOrigin
public class UserController {

    @Autowired
    private UserCrudService userService;

    @PostMapping
    public UserModel createUser(@RequestBody UserModel user){
        return userService.saveUser(user);
    }

}
