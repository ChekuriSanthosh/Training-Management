package com.capstone.service;

import com.capstone.dto.*;
import com.capstone.model.Maintainer;
import com.sun.tools.javac.Main;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;
import java.util.concurrent.TransferQueue;

public interface MaintainerService {
    public List<Maintainer> getall();
    public Maintainer saveMaintainer(Maintainer maintainer);
    public Maintainer updateMaintainer(int id, Maintainer maintainer);
    public List<Trainer> getAllTrainers();
    public List<Student> getStudentsByTrainingRoom(String trainingRoom);
    public int getMaintainerByEmail(String managerEmail);

    public List<Student> getallstudentTrainingDone();
    public void unassignStudentTrainingRoom(String trainingroom);
    public Student updateRoomandDuration(int id, String trainingRoom, int duration);
    public List<Student> getallStudents();
    public List<FeedBack> gettallfeedbackbyTrainer(int id);
//    public Trainer AssignTrainingRoom(int id,String trainingRoom);
    public Trainer UpdateTrainingRoom(int id,String trainingRoom);
    public Requests UpdateRequest(int id, RequestStatus requestStatus, String msg, String maintainername);
    public Student addMarks(int id, Marks marks);
    public Student RegisterStudent(Student studentdto);
    public Trainer RegisterTrainer(Trainer trainer);
    public Student UpdateMarksByWeek(int id,Marks marksdto);
    public Trainer saveTrainerPdf(int id, MultipartFile file) throws IOException;
    public List<Student> CreateNewDateAttendence(String Trainingroom, LocalDate date);
    public int PostNumberOfTrainingRoom(int number);
    public void saveallMaintainer();
    public int GetnumberOfTrainingRoom();
    public List<Manager> getAllManagers();
    public String getMaintainerNameByEmail(String managerEmail);
    public List<Requests> getAllRequests();
    public List<Requests> getRequestByStatus(RequestStatus requestStatus);
    public Trainer unassignRoom(int id);
}

