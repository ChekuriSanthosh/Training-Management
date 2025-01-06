package com.capstone.admin.dtos;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDetails {

    private int id;
    private String username;
    private String password;
    private String role;
    private int userId;
}
