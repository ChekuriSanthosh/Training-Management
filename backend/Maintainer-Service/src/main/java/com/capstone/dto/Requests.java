package com.capstone.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
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