package com.capstone.admin.dtos;

import lombok.Data;

@Data
public class Maintainer {
    private int maintainerId;
    private String maintainerName;
    private String emailId;
    private int RoomSize;
}
