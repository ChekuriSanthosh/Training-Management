package com.capstone.student.model;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "student")
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int StudentId;
    private String StudentName;
    @Column(unique = true)
    private String StudentEmail;
    private String TrainingRoom;
    private int Totalduration;
    private boolean trainingdone;
    @OneToMany
    private List<Marks> marks;
    @OneToOne(cascade = CascadeType.ALL)
    private Feedback feedback;
    @OneToMany(mappedBy = "student")
    private List<Attendence> attendences;
}






