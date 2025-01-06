package com.capstone.student.service;

import com.capstone.student.model.Attendence;
import com.capstone.student.model.Feedback;
import com.capstone.student.model.Marks;
import com.capstone.student.model.Student;

import java.time.LocalDate;
import java.util.List;

public interface StudentService {
    public Student saveStudent(Student student);
    public Student getStudentById(int id);
    public List<Student> getStudentsByTrainingRoom(String trainingRoom);
    public List<Marks> getMarksById(int id);
    public void StudentTrainingDone(String trainingRoom);
    public Student UpdateStudent(int id,Student studentdto);
    public Student AddMarks(int id, Marks marks);
    public Student UpdateMarks(int id, Marks marksdto);
    public Student UpdateTrainingRoom(int id, String trainingRoom, int duration);
    public Student saveFeedback(int id, Feedback feedBackdto);
    public int getStudentByemail(String email);
    public void SetFeedbackNull(String trainingRoom);
    public List<Student> getAllStudents();
    public List<Feedback> getallfeedbacks();

    public Student saveAttendence(String Trainingroom, LocalDate date, String attendanceStatus, int StudentId);
    public List<Student> markAllStudentPresent(String trainingRoom,LocalDate date);
    public List<Student> CreateNewDateAttendence(String trainingRoom,LocalDate date);
    public List<Student> getTrainingDoneStudents();
}
