package com.capstone.trainer.dto;

//import com.ust.project.model.

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.Data;

import java.time.LocalDate;

@Data
public class Attendence {
    private int AttendenceId;
    private LocalDate date;
    private String AttendenceStatus;
    private String TrainingRoom;
    private Student student;
}

