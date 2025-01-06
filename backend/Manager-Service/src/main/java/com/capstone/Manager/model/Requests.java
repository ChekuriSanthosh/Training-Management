package com.capstone.Manager.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.net.Proxy;
import java.util.List;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "requests")
public class Requests {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int RequestId;
    private int ManagerId;
    private String ManagerName;
    private String AccountType;
    private List<String> Skills;
    private int RequiredTrainees;
    @Enumerated(EnumType.STRING)
    private RequestStatus status;
    private String AdminName;
    private String AdminMessage;
    @JsonIgnore
    @ManyToOne(cascade = CascadeType.ALL)
    private Manager manager;
}
