package com.myportfolio.apigateway.service;

import com.myportfolio.apigateway.model.UserModel;
import com.myportfolio.apigateway.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import javax.xml.transform.sax.SAXResult;

@Service
public class UserDetailsServiceImpl implements org.springframework.security.core.userdetails.UserDetailsService {

    @Autowired
    private UserRepository userRepository;


    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        UserModel userModel = userRepository.findByUsername(username)
                .orElseThrow(()->new UsernameNotFoundException("User with email "+username+" not found"));

        return new UserDetailsImpl(userModel);
    }


    public UserModel loadUser(String username) throws UsernameNotFoundException{
        UserModel userModel = userRepository.findByUsername(username)
                .orElseThrow(()->new UsernameNotFoundException("User with name "+username+" not found"));
        return userModel;
    }


    public UserModel updatewithUserId(String username,int id) throws UsernameNotFoundException{
        UserModel userModel = userRepository.findByUsername(username)
                .orElseThrow(()->new UsernameNotFoundException("User with name "+username+" not found"));
        return userModel;
    }
}
