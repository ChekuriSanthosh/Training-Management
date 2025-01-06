package com.capstone.dto;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.Data;

import java.util.List;

@Data
public class Manager {
    private int ManagerId;
    private String ManagerName;
    private String Manageremail;
    private String AccountType;
    @OneToMany(mappedBy = "manager")
    List<Requests> createdRequests;
}

