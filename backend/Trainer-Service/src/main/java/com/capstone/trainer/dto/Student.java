package com.capstone.trainer.dto;

import jakarta.persistence.CascadeType;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import lombok.Data;

import java.util.List;

@Data
public class Student {
    private int StudentId;
    private String StudentName;
    private String StudentEmail;
    private String TrainingRoom;
    private int Totalduration;
    private boolean trainingdone;
    private List<Marks> marks;
    private FeedBack feedback;
    private List<Attendence> attendences;
}
