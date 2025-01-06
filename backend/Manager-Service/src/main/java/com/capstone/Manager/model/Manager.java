package com.capstone.Manager.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "manager")
public class Manager {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int ManagerId;
    @Column(unique = true)
    private String Manageremail;
    private String ManagerName;
    private String AccountType;
    @OneToMany(mappedBy = "manager")
    List<Requests> createdRequests;
}
