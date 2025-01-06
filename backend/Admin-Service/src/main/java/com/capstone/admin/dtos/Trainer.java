package com.capstone.admin.dtos;

import lombok.Data;

import java.util.List;
@Data
public class Trainer {
    private int TrainerId;
    private String TrainerName;
    private String TrainerEmail;
    private String trainingRoom;
    private boolean Notification;
    private String TimeTablePDF;
    private List<String> Skills;
}
