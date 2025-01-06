package com.capstone.admin.service;

import com.capstone.admin.dtos.*;

import org.springframework.stereotype.Service;

import java.util.List;


public interface AdminService {
    public Maintainer saveMaintainer(Maintainer maintainer);
    public List<Student> getStudentByTrainingRoom(String trainingRoom);
    public List<Trainer> getAllTrainers();
    public List<Manager> getAllManagers();
    public List<Maintainer> getAllMaintainers();
    public int getTrainingRoomSize();
    public void PostTrainingRoomSize(int id);
    public List<Student> getallStudents();
    public List<Requests> getAllRequests();
    public Manager saveManager(Manager manager);
}
