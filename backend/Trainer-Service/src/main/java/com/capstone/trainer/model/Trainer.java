package com.capstone.trainer.model;

import com.capstone.trainer.dto.FeedBack;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class Trainer {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int TrainerId;
    private String TrainerName;
    @Column(unique = true)
    private String TrainerEmail;
    private String trainingRoom;
    private boolean Notification;
    private String TimeTablePDF;
    private List<String> Skills;
}
