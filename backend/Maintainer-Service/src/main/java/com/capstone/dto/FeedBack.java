package com.capstone.dto;


import lombok.Data;

import java.time.LocalDate;

@Data
public class FeedBack {
    int FeedbackId;
    String FeedbackMessage;
    int Rating;
    private LocalDate date;
    private int TrainerId;
}
