package com.capstone.trainer.dto;


import lombok.Data;

import java.time.LocalDate;

@Data
public class FeedBack {
    int FeedbackId;
    String FeedbackMessage;
    int Rating;
    LocalDate date;
    private int TrainerId;
}
