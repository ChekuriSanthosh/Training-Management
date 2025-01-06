package com.capstone.student.dto;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

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
