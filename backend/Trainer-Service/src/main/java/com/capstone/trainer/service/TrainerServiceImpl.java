package com.capstone.trainer.service;

import com.capstone.trainer.dto.FeedBack;
import com.capstone.trainer.dto.Marks;
import com.capstone.trainer.dto.Student;
import com.capstone.trainer.model.Trainer;
import com.capstone.trainer.repository.TrainerRepository;
import com.capstone.trainer.util.EmailUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cglib.core.Local;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class TrainerServiceImpl implements TrainerService{
    @Autowired
    private TrainerRepository trainerRepository;

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private EmailUtil emailUtil;

    public TrainerServiceImpl() throws IOException {
    }

    public List<Trainer> getallTrainer(){
        return trainerRepository.findAll();
    }

    public Trainer saveTrainer(Trainer trainer) {
        for(Trainer s:trainerRepository.findAll()){
            if(s.getTrainerEmail()==null){
                continue;
            }
            if(s.getTrainerEmail().equalsIgnoreCase(trainer.getTrainerEmail())){
                throw new RuntimeException("Can't add trainer");
            }
        }
//        trainer.setFeedBacks(new ArrayList<FeedBack>());
        trainer.setNotification(false);
//        trainerdto.setTrainingRoom(null);
        trainer.setTimeTablePDF(null);
//        String trainerName = trainer.getTrainerName();
//
//        String subject = "Training Program Assigned Successfully";
//        String body = "<html>"
//                + "<body>"
//                + "<p>Hello <strong>" + trainerName + "</strong>,</p>"
//                + "<p>Welcome to your Training Program! Your default password is:</p>"
//                + "<p><strong>ustTrainer@123</strong></p>"
//                + "<p>For your security, please reset your password by clicking the link below:</p>"
//                + "<p><a href='https://ust.com' style='color: #007BFF;'>Reset your password</a></p>"
//                + "<p>If you have any issues, feel free to contact us.</p>"
//                + "<br>"
//                + "<p>Best regards,</p>"
//                + "<p>The Training Team</p>"
//                + "</body>"
//                + "</html>";
//
//        emailUtil.sendEmail(trainer.getTrainerEmail(), subject, body);
        return trainerRepository.save(trainer);

    }

    public int getTrainerByemail(String email){
        for(Trainer t:trainerRepository.findAll()){
            if(t.getTrainerEmail()==null){
                continue;
            }
            if(t.getTrainerEmail().equalsIgnoreCase(email)){
                return t.getTrainerId();
            }
        }
        throw new RuntimeException("Trainer Not Found By this email");
    }

    public Trainer getTrainerById(int id) {
        return trainerRepository.findById(id).orElseThrow(()->new RuntimeException("Trainer Not Found By Id"));
    }

    public Trainer getTrainerByTrainingRoom(String room) {
        List<Trainer> trainerList=trainerRepository.getTrainerfromTrainingRoom(room);
        if(trainerList.size()>0){
            return trainerList.get(0);
        }
        throw new RuntimeException("Training Room Not Assigned To Trainer");
    }

    public Trainer UpdateTrainer(int id, Trainer trainerdto) {
        if(!trainerRepository.existsById(id)){
            throw new RuntimeException("Trainer Not Found By Id");
        }
        Trainer trainer=trainerRepository.getById(id);
        if(trainerdto.getTrainerName()!=null) {
            trainer.setTrainerName(trainerdto.getTrainerName());
        }
        if(trainerdto.getSkills()!=null) {
            trainer.setSkills(trainerdto.getSkills());
        }
        return trainerRepository.save(trainer);
    }

    public List<Student> getallStudents(int id) {
        if(!trainerRepository.existsById(id)){
            throw new RuntimeException("Trainer Not Found By Id");
        }
        Trainer trainer=trainerRepository.findById(id).orElse(null);
        if(trainer.getTrainingRoom()==null){
            return new ArrayList<>();
        }
        String url = "http://STUDENT-SERVICE/student/trainingRoom";
        Student[] studentList=restTemplate.getForObject(url+"/"+trainer.getTrainingRoom(), Student[].class);
        List<Student> students=new ArrayList<>();
        for(Student s:studentList){
            students.add(s);
        }
        return students;
    }

    public Trainer disableNotification(int id){
        Trainer trainerdto=getTrainerById(id);
        if(trainerdto.isNotification()) {
            trainerdto.setNotification(false);
        }
        return trainerRepository.save(trainerdto);
    }
    public List<FeedBack> getAllFeedBacks(int id){
        List<Student> studentList=getallStudents(id);
        List<FeedBack> feedBackdtoList=new ArrayList<>();
        for(Student studentdto: studentList){
            if(studentdto.getFeedback()!=null){
                feedBackdtoList.add(studentdto.getFeedback());
            }
        }
        return feedBackdtoList;
    }

    public Student saveAttendence(int TrainerId, LocalDate date, String attendanceStatus, int StudentId){
        Trainer trainer=trainerRepository.findById(TrainerId).orElseThrow(()->new RuntimeException("Trainer Not Found With the given Id"));
        String trainingRoom=trainer.getTrainingRoom();
        if(trainingRoom==null){
            throw new RuntimeException("No Training Room is Assigned to you");
        }
        String baseurl = "http://STUDENT-SERVICE/student/";
        String url = baseurl + "/SaveAttendence/" + StudentId + "?Trainingroom=" + trainingRoom +
                "&date=" + date + "&attendanceStatus=" + attendanceStatus;
        ResponseEntity<Student> response = restTemplate.exchange(url, HttpMethod.POST, null, Student.class);
        return response.getBody();
    }

    public List<Student> markAllStudentPresent(int TrainerId,LocalDate date){
        Trainer trainer=trainerRepository.findById(TrainerId).orElseThrow(()->new RuntimeException("Trainer Not Found With the given Id"));
        String trainingRoom=trainer.getTrainingRoom();
        if(trainingRoom==null){
            throw new RuntimeException("No Training Room is Assigned to you");
        }
        String baseurl = "http://STUDENT-SERVICE/student/";
        String url = baseurl + "/MarkAllPresent/" + trainingRoom + "?&date=" + date;
        ResponseEntity<Student[]> response = restTemplate.exchange(url, HttpMethod.POST, null, Student[].class);
        Student[] students=response.getBody();
        List<Student> studentList=new ArrayList<>();
        for(Student i:students){
            studentList.add(i);
        }

        return studentList;
    }
    public List<Student> CreateNewDateAttendence(int TrainerId, LocalDate date){
        Trainer trainer=trainerRepository.findById(TrainerId).orElseThrow(()->new RuntimeException("Trainer Not Found With the given Id"));
        String trainingRoom=trainer.getTrainingRoom();
        if(trainingRoom==null){
            throw new RuntimeException("No Training Room is Assigned to you");
        }
        String baseurl = "http://STUDENT-SERVICE/student/";
        String url = baseurl + "/CreateNewDateAttendence/" + trainingRoom + "?&date=" + date;
        ResponseEntity<Student[]> response = restTemplate.exchange(url, HttpMethod.POST, null, Student[].class);
        Student[] students=response.getBody();
        List<Student> studentList=new ArrayList<>();
        for(Student i:students){
            studentList.add(i);
        }
        return studentList;

    }



    @Override
    public Trainer AssignTrainingRoom(int id, String trainingRoom) {
        Trainer trainerdto=trainerRepository.findById(id).orElseThrow(()->new RuntimeException("Trainer Not Found with the Id"));
        if(trainerdto.getTrainingRoom()!=null){
            throw new RuntimeException("Trainer Already Assigned To Another Room");
        }
        List<Trainer> trainerdtos=trainerRepository.findAll();
        for(Trainer t:trainerdtos){
            if(t.getTrainingRoom().equals(trainingRoom))
            {
                throw new RuntimeException("Training Room Already Assigned");
            }
        }

        trainerdto.setTrainingRoom(trainingRoom);
        return trainerRepository.save(trainerdto);
    }

    public void MakeFeedbacksnull(String trainingRoom){
        if(trainingRoom==null){
            throw new RuntimeException("Training Room can't be null");
        }
        String baseUrl="http://STUDENT-SERVICE/student/setFeedbackNull/"+trainingRoom;
        ResponseEntity response=restTemplate.exchange(baseUrl, HttpMethod.PUT, null, ResponseEntity.class);
    }

    public List<FeedBack> getFeedBackbyTrainer(int TrainerId){
        String Baseurl="http://STUDENT-SERVICE/student/allFeedbacks";
        FeedBack[] feedBacks=restTemplate.getForObject(Baseurl, FeedBack[].class);
        List<FeedBack> feedBackList=new ArrayList<>();
        for(FeedBack f:feedBacks){
            if(f.getTrainerId()==TrainerId){
                feedBackList.add(f);
            }
        }
        return feedBackList;
    }




    @Override
    public Trainer UpdateTrainingRoom(int id, String trainingRoom) {
        Trainer trainerdto=trainerRepository.findById(id).orElseThrow(()->new RuntimeException("Trainer Not Found By this Id"));
        List<Trainer> trainerdtos=trainerRepository.findAll();
//        if(trainerdto.getTrainingRoom()==null){
//            throw new RuntimeException("Trainer Not Assigned To Any Training Room");
//        }
        for(Trainer t:trainerdtos){
            if(t.getTrainingRoom()==null){
                continue;
            }
            if(t.getTrainingRoom().equals(trainingRoom))
            {
                throw new RuntimeException("Training Room Already Assigned");
            }
        }

        trainerdto.setTrainingRoom(trainingRoom);

        return trainerRepository.save(trainerdto);
    }
    public Trainer saveTrainerPdf(int id, MultipartFile file) throws IOException {
        String currentPath = new java.io.File(".").getCanonicalPath();
        String uploadDir = currentPath+"/TimeTablePdfs/";
        Trainer trainer1=getTrainerById(id);
        if (file != null && !file.isEmpty()) {
            String fileName=trainer1.getTrainingRoom().toString();
            String filePath = uploadDir + fileName+".pdf";
            file.transferTo(new File(filePath));
            trainer1.setNotification(true);
            trainer1.setTimeTablePDF(filePath);
        }
        return trainerRepository.save(trainer1);
    }


    public Trainer UnassignRoom(int id){
        Trainer t=trainerRepository.findById(id).orElseThrow(()->new RuntimeException("Trainer Not found with ID"));
        if(t.getTrainingRoom()!=null){
            t.setTrainingRoom(null);
            t.setTimeTablePDF(null);
        }

        return trainerRepository.save(t);
    }


//    public Trainer AddTrainerFeedback(int id,FeedBack feedBack){
//        Trainer t=trainerRepository.findById(id).orElseThrow(()->new RuntimeException("Trainer Not Found by the id"));
//        List<FeedBack> feedBacks=t.getFeedBacks();
//        feedBack.setDate(LocalDate.now());
//        feedBacks.add(feedBack);
//        t.setFeedBacks(feedBacks);
//
//        return trainerRepository.save(t);
//    }


}
