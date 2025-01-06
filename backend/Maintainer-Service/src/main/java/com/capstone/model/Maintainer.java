package com.capstone.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "maintainer")
public class Maintainer {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int maintainerId;
    @Column(unique = true)
    private String emailId;
    private String maintainerName;
    private int RoomSize;

}
