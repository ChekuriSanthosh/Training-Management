package com.capstone.trainer.dto;


import lombok.Data;

@Data
public class Marks {
    int MarksId;
    int WeekName;
    double marks;
    Student student;
}
