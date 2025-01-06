package com.capstone.trainer.service;

import com.capstone.trainer.dto.FeedBack;
import com.capstone.trainer.dto.Marks;
import com.capstone.trainer.dto.Student;
import com.capstone.trainer.model.Trainer;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;

public interface
TrainerService {
    public List<Trainer> getallTrainer();
    public Trainer saveTrainer(Trainer trainerdto);
    public Trainer getTrainerById(int id);
    public Trainer getTrainerByTrainingRoom(String room);
    public Trainer UpdateTrainer(int id, Trainer trainerdto);
    public List<Student> getallStudents(int id);
    public Trainer UnassignRoom(int id);
//    public Trainer AddTrainerFeedback(int id,FeedBack feedBack);

    public Trainer disableNotification(int id);
    public int getTrainerByemail(String email);
    public void MakeFeedbacksnull(String trainingRoom);
    public List<FeedBack> getAllFeedBacks(int id);
    public Student saveAttendence(int TrainerId, LocalDate date, String attendanceStatus, int StudentId);
    public List<Student> markAllStudentPresent(int TrainerId,LocalDate date);
    public List<Student> CreateNewDateAttendence(int TrainerId, LocalDate date);
//    public List<Marks> getAllMarks(int id);
public List<FeedBack> getFeedBackbyTrainer(int TrainerId);

    public Trainer AssignTrainingRoom(int id, String trainingRoom);
    public Trainer UpdateTrainingRoom(int id,String trainingRoom);
    public Trainer saveTrainerPdf(int id, MultipartFile file) throws IOException;

}
