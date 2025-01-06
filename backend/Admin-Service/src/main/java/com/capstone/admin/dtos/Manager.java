package com.capstone.admin.dtos;

import jakarta.persistence.OneToMany;
import lombok.Data;

import java.util.List;
@Data
public class Manager {
    private int ManagerId;
    private String ManagerName;
    private String Manageremail;
    private String AccountType;
    List<Requests> createdRequests;
}
