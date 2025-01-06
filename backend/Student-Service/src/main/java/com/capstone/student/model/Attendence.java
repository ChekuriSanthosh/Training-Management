package com.capstone.student.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "attendence")
public class Attendence {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int AttendenceId;
    private LocalDate date;
    private String AttendenceStatus;
    private String TrainingRoom;
    @JsonIgnore
    @ManyToOne
    private Student student;
}
