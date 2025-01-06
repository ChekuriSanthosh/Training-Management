package com.capstone.admin.dtos;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.CascadeType;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.ManyToOne;
import lombok.Data;

import java.util.List;
@Data
public class Requests {
    private int RequestId;
    private int ManagerId;
    private String ManagerName;
    private String AccountType;
    private List<String> Skills;
    private int RequiredTrainees;
    private RequestStatus status;
    private String AdminName;
    private String AdminMessage;
    private Manager manager;
}
