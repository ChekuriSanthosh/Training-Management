package com.capstone.student.service;

import com.capstone.student.dto.Trainer;
import com.capstone.student.model.Attendence;
import com.capstone.student.model.Feedback;
import com.capstone.student.model.Marks;
import com.capstone.student.model.Student;
import com.capstone.student.repositories.AttendenceRepository;
import com.capstone.student.repositories.FeedbackRepository;
import com.capstone.student.repositories.MarksRepository;
import com.capstone.student.repositories.StudentRepository;
import com.capstone.student.util.EmailUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
@Service
@Slf4j
public class StudentServiceImpl implements StudentService{
    @Autowired
    StudentRepository studentRepository;
    @Autowired
    FeedbackRepository feedbackRepository;
    @Autowired
    MarksRepository marksRepository;
    @Autowired
    AttendenceRepository attendenceRepository;

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private EmailUtil emailUtil;

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public Student saveStudent(Student student) {
        for (Student s : studentRepository.findAll()) {
            if (s.getStudentEmail().equalsIgnoreCase(student.getStudentEmail())) {
                throw new RuntimeException("Can't add Student");
            }
        }

        student.setMarks(null);
        student.setFeedback(null);
        student.setTrainingdone(false);
        student.setAttendences(new ArrayList<>());

//        String studentName = student.getStudentName();
//
//        String subject = "Training Program Assigned Successfully";
//        String body = "<html>"
//                + "<body>"
//                + "<p>Hello <strong>" + studentName + "</strong>,</p>"
//                + "<p>Welcome to your Training Program! Your default password is:</p>"
//                + "<p><strong>ust@123</strong></p>"
//                + "<p>For your security, please reset your password by clicking the link below:</p>"
//                + "<p><a href='https://ust.com' style='color: #007BFF;'>Reset your password</a></p>"
//                + "<p>If you have any issues, feel free to contact us.</p>"
//                + "<br>"
//                + "<p>Best regards,</p>"
//                + "<p>The Training Team</p>"
//                + "</body>"
//                + "</html>";
//
//        emailUtil.sendEmail(student.getStudentEmail(), subject, body);
        return studentRepository.save(student);
    }

    public void SetFeedbackNull(String trainingRoom)
    {
        List<Student> students=studentRepository.findStudentByTrainingRoom(trainingRoom);
        for(Student s:students)
        {
            s.setFeedback(null);
            studentRepository.save(s);
        }
    }


    public Student getStudentById(int id) {
        return studentRepository.findById(id).orElseThrow(()->new RuntimeException("Student Not Found By Id"));
    }

    public List<Student> getStudentsByTrainingRoom(String trainingRoom) {
        return studentRepository.findStudentByTrainingRoom(trainingRoom).stream().filter(i->i.isTrainingdone()==false).toList();
    }

    public int getStudentByemail(String email){
        for(Student s:studentRepository.findAll()){
            if(s.getStudentEmail().equalsIgnoreCase(email)){
                return s.getStudentId();
            }
        }
        throw new RuntimeException("STudent Not Found with ID");
    }

    public List<Marks> getMarksById(int id) {
        Student student=getStudentById(id);
        return student.getMarks();
    }

    public Student UpdateTrainingRoom(int id, String trainingRoom, int duration) {
        Student student=getStudentById(id);
        student.setTrainingRoom(trainingRoom);
        student.setTotalduration(duration);
        return studentRepository.save(student);
    }

    public Student UpdateStudent(int id,Student student) {
        if(studentRepository.existsById(id)){
            Student student1=studentRepository.findById(id).orElse(null);
            student1.setStudentName(student.getStudentName());
            return studentRepository.save(student1);
        }
        else {
            throw new RuntimeException("Student Not Found By Id");
        }
    }

//    public Student AddMarks(int id, Marks marks) {
//        if (studentRepository.existsById(id)) {
//            Student student = studentRepository.findById(id).orElseThrow(()->new RuntimeException("Student Not Found By Id"));
//            marks.setStudent(null);
//
//            List<Marks> marksList = student.getMarks();
//            if (marksList != null) {
//                for (Marks existingMarks : marksList) {
//                    if (existingMarks.getWeekName()==marks.getWeekName()) {
//                        existingMarks.setMarks(marks.getMarks());
//                        marksRepository.save(existingMarks);
//                    }
//                }
//            } else {
//                marksList = new ArrayList<>();
//                marks.setStudent(student);
//                marksList.add(marks);
//                marksRepository.save(marks);
//            }
//            student.setMarks(marksList);
//            return studentRepository.save(student);
//        }
//        throw new RuntimeException("Student Not Found By Id");
//    }
public Student AddMarks(int id, Marks marks) {
    if (studentRepository.existsById(id)) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student Not Found By Id"));
        List<Marks> marksList = student.getMarks();

        if (marksList != null) {
            boolean weekExists = false;
            for (Marks existingMarks : marksList) {
                if (existingMarks.getWeekName() == marks.getWeekName()) {
                    existingMarks.setMarks(marks.getMarks());
                    marksRepository.save(existingMarks);
                    weekExists = true;
                    break;
                }
            }
            if (!weekExists) {
                marks.setStudent(student);
                marksList.add(marks);
                marksRepository.save(marks);
            }
        } else {

            marksList = new ArrayList<>();
            marks.setStudent(student);
            marksList.add(marks);
            marksRepository.save(marks);
        }
        student.setMarks(marksList);
        return studentRepository.save(student);
    }

    throw new RuntimeException("Student Not Found By Id");
}


    //    public Student UpdateMarks(int id, Marks marks){
//        if(studentRepository.existsById(id)){
//            Student student=studentRepository.findById(id).orElseThrow(()->new RuntimeException("Student Not Found By Id"));
//            List<Marks> marksList=student.getMarks();
//            boolean found=false;
//            if(marksList==null){
//                return null;
//            }
//            for(Marks marks1:marksList){
//                if(marks1.getWeekName()==marks.getWeekName()){
//                    marks1.setMarks(marks.getMarks());
//                    marksRepository.save(marks1);
//                    found=true;
//                    break;
//                }
//            }
//            if(found==false){
//                throw new RuntimeException("Week not found");
//            }
//            student.setMarks(marksList);
//            return studentRepository.save(student);
//
//        }
//        throw new RuntimeException("Student Not Found By Id");
//    }
public Student UpdateMarks(int id, Marks marks){
    if(studentRepository.existsById(id)){
        Student student=studentRepository.findById(id).orElseThrow(()->new RuntimeException("Student Not Found By Id"));
        List<Marks> marksList=student.getMarks();
        boolean found=false;
        if(marksList==null){
            return null;
        }
        for(Marks marks1:marksList){
            if(marks1.getWeekName()==marks.getWeekName()){
                marks1.setMarks(marks.getMarks());
                marksRepository.save(marks1);
                found=true;
                break;
            }
        }
        if(found==false){
            throw new RuntimeException("Week not found");
        }
        student.setMarks(marksList);
        return studentRepository.save(student);

    }
    throw new RuntimeException("Student Not Found By Id");
}

    public Student saveFeedback(int id, Feedback feedback){
        Student student = getStudentById(id);
        feedback.setDate(LocalDate.now());
        String room=student.getTrainingRoom();
        String url = "http://TRAINER-SERVICE/trainer/room/";
        Trainer trainer=restTemplate.getForObject(url+room, Trainer.class);

        feedback.setTrainerId(trainer.getTrainerId());
        Feedback feedback1=feedbackRepository.save(feedback);
        student.setFeedback(feedback1);


        return studentRepository.save(student);
    }


    public Student saveAttendence(String Trainingroom, LocalDate date, String attendanceStatus, int StudentId){
        Student student=studentRepository.findById(StudentId).orElseThrow(()->new RuntimeException("Student Not Found For Trainer"));
        List<Attendence> attendences=student.getAttendences();
        int flag=0;
        if(!student.getTrainingRoom().equals(Trainingroom)){
            throw new RuntimeException("You Don't Have Access");
        }
        for(Attendence attendenceloop:attendences)
        {
            if(attendenceloop.getDate().equals(date))
            {
                attendenceloop.setAttendenceStatus(attendanceStatus);
//                attendenceloop.setTrainingRoom(Trainingroom);
//                attendenceloop.setStudent(student);
                attendenceRepository.save(attendenceloop);
                student.setAttendences(attendences);
                flag=1;
                return studentRepository.save(student);
            }
        }
        if(flag==0) {
            Attendence attendance = new Attendence();
            attendance.setDate(date);
            attendance.setTrainingRoom(Trainingroom);
            attendance.setAttendenceStatus(attendanceStatus);
            attendance.setStudent(student);
            List<Attendence> attendenceList = student.getAttendences();
            if (attendenceList == null) {
                attendenceList = new ArrayList<>();
                attendenceList.add(attendance);
            } else {
                attendenceList.add(attendance);
            }
            student.setAttendences(attendenceList);
            attendenceRepository.save(attendance);
        }
        return studentRepository.save(student);
    }
    public List<Student> markAllStudentPresent(String trainingRoom,LocalDate date)
    {
        List<Student> students=studentRepository.findStudentByTrainingRoom(trainingRoom).stream().filter(i->i.isTrainingdone()==false).toList();
        for(Student s:students)
        {
            List<Attendence> attendence=s.getAttendences();
            for(Attendence attendence1:attendence){
                if(attendence1.getDate().equals(date)){
                    attendence1.setAttendenceStatus("P");
                    attendenceRepository.save(attendence1);
                    studentRepository.save(s);
                    break;
                }
            }
            }
        return students;
    }



    public List<Student> CreateNewDateAttendence(String trainingRoom,LocalDate date)
    {
        List<Student> students=studentRepository.findStudentByTrainingRoom(trainingRoom).stream().filter(i->i.isTrainingdone()==false).toList();
        for(Student s:students)
        {
            if(!s.getAttendences().isEmpty()){
//                throw new RuntimeException("Attendence already Allocated to a student");
                continue;
            }
            List<Attendence> attendence=s.getAttendences();
            for(int i=0;i<s.getTotalduration()*7;i++){
                LocalDate presentdate= date.plusDays(i);
                Attendence attendence1=new Attendence();
                attendence1.setDate(presentdate);
                attendence1.setAttendenceStatus(null);
                attendence1.setTrainingRoom(trainingRoom);
                attendence1.setStudent(s);
                attendence.add(attendence1);


                attendenceRepository.save(attendence1);
                studentRepository.save(s);
            }
        }
        return students;
    }


    public void StudentTrainingDone(String trainingRoom){
        List<Student> students=getStudentsByTrainingRoom(trainingRoom).stream().filter(i->i.isTrainingdone()==false).toList();
        for(Student s:students){
            s.setTrainingdone(true);
            studentRepository.save(s);
        }

        return;
    }


    public List<Student> getTrainingDoneStudents(){
        return studentRepository.findAll().stream().filter(i->i.isTrainingdone()==true).toList();
    }


    public List<Feedback> getallfeedbacks(){
        return feedbackRepository.findAll();
    }


}
