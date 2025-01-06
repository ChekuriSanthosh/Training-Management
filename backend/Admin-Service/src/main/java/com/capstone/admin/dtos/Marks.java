package com.capstone.admin.dtos;


import lombok.Data;

@Data
public class Marks {
    int MarksId;
    int WeekName;
    double marks;
    Student student;
}
