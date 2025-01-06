package com.capstone.dto;

//import com.ust.project.model.

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

