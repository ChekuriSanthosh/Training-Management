package com.capstone.service;

import com.capstone.dto.*;
import com.capstone.model.Maintainer;
import com.capstone.repository.MaintainerRepository;
import com.capstone.util.EmailUtil;
import com.sun.tools.javac.Main;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.http.client.MultipartBodyBuilder;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.File;
import java.io.IOException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;


@Service
public class MaintainerServiceImpl implements MaintainerService {


    @Autowired
    private MaintainerRepository maintainerRepository;

    @Autowired
    private EmailUtil emailUtil;

    @Autowired
    private RestTemplate restTemplate;

    private int roomsize=0;


    public List<Maintainer> getall() {
        return maintainerRepository.findAll();
    }

    public Maintainer saveMaintainer(Maintainer maintainer) {
        for(Maintainer s:maintainerRepository.findAll()){
            if(s.getEmailId().equalsIgnoreCase(maintainer.getEmailId())){
                throw new RuntimeException("Can't add maintainer");
            }
        }
        List<Maintainer> maintainers=maintainerRepository.findAll();
        Maintainer m=null;
        if(!maintainers.isEmpty()) {
            m = maintainers.get(0);
            maintainer.setRoomSize(m.getRoomSize());
        }
        else {
            maintainer.setRoomSize(roomsize);
        }
//        String maintainerName = maintainer.getMaintainerName();
//
//        String subject = "You Have Been Registered By Admin Successfully";
//        String body = "<html>"
//                + "<body>"
//                + "<p>Hello <strong>" + maintainerName + "</strong>,</p>"
//                + "<p>Welcome to Platform ! Your default password is:</p>"
//                + "<p><strong>USTMaintainer@123</strong></p>"
//                + "<p>For your security, please reset your password by clicking the link below:</p>"
//                + "<p><a href='https://ust.com' style='color: #007BFF;'>Reset your password</a></p>"
//                + "<p>If you have any issues, feel free to contact us.</p>"
//                + "<br>"
//                + "<p>Best regards,</p>"
//                + "<p>The Admin Team</p>"
//                + "</body>"
//                + "</html>";
//
//        emailUtil.sendEmail(maintainer.getEmailId(), subject, body);
        return maintainerRepository.save(maintainer);
    }

    public Maintainer updateMaintainer(int id, Maintainer maintainer) {
        if (!maintainerRepository.existsById(id)) {
            throw new RuntimeException("Maintainer Not Exists with this id");
        }
        Maintainer maintainer1 = maintainerRepository.findById(id).orElse(null);
        maintainer1.setMaintainerName(maintainer.getMaintainerName());
        return maintainerRepository.save(maintainer1);
    }

    public Student updateRoomandDuration(int id, String trainingRoom, int duration){
        String url = "http://STUDENT-SERVICE/student/updateRoomandDuration/"+id+"?trainingRoom="+trainingRoom+"&duration="+duration;
        ResponseEntity<Student> responseEntity = restTemplate.exchange(url, HttpMethod.PUT, null, Student.class);
        return responseEntity.getBody();
    }

    public List<Student> getallStudents(){
        String url = "http://STUDENT-SERVICE/student";
        Student[] StudentList = restTemplate.getForObject(url + "/allStudents", Student[].class);
        List<Student> students = new ArrayList<>();
        for (Student i : StudentList) {
            students.add(i);
        }
        return students;
    }

    public List<Trainer> getAllTrainers() {

        String url = "http://TRAINER-SERVICE/trainer";
        Trainer[] TrainerList = restTemplate.getForObject(url, Trainer[].class);
        List<Trainer> trainers = new ArrayList<>();
        for (Trainer i : TrainerList) {
            trainers.add(i);
        }
        return trainers;
    }

    public int getMaintainerByEmail(String managerEmail){
        List<Maintainer>maintainers=getall();
        for(Maintainer m:maintainers){
            if(m.getEmailId().equalsIgnoreCase(managerEmail)){
                return m.getMaintainerId();
            }
        }
        throw new RuntimeException("Maintainer Not Found with mail");
    }
    public String getMaintainerNameByEmail(String managerEmail){
        List<Maintainer>maintainers=getall();
        for(Maintainer m:maintainers){
            if(m.getEmailId().equalsIgnoreCase(managerEmail)){
                return m.getMaintainerName();
            }
        }
        throw new RuntimeException("Maintainer Not Found with mail");
    }

    public List<Student> getStudentsByTrainingRoom(String trainingRoom) {
        String url = "http://STUDENT-SERVICE/student";
        Student[] StudentList = restTemplate.getForObject(url + "/trainingRoom/" + trainingRoom, Student[].class);
        List<Student> students = new ArrayList<>();
        for (Student i : StudentList) {
            students.add(i);
        }
        return students;
    }

    //    public Trainer AssignTrainingRoom(int id, String trainingRoom) {
//        String BaseUrl = "http://TRAINER-SERVICE/trainer/AssignTrainingRoom/"+id+"?trainingRoom="+trainingRoom;
//
//        ResponseEntity<Trainer> response = restTemplate.exchange(BaseUrl, HttpMethod.POST,null, Trainer.class);
//
//        return response.getBody();
//    }
    public Trainer UpdateTrainingRoom(int id, String trainingRoom) {
        String BaseUrl = "http://TRAINER-SERVICE/trainer/UpdateTrainingRoom/" + id + "?trainingRoom=" + trainingRoom;
        ResponseEntity<Trainer> responseEntity = restTemplate.exchange(BaseUrl, HttpMethod.PUT, null, Trainer.class);
        return responseEntity.getBody();
    }


    public Requests UpdateRequest(int id, RequestStatus requestStatus, String msg, String maintainername) {
        String url = "http://MANAGER-SERVICE/manager/UpdateRequestAdmin/" + id + "?requestStatus=" + requestStatus + "&msg=" + msg+ "&maintainerName=" + maintainername;

        ResponseEntity<Requests> response = restTemplate.exchange(url, HttpMethod.PUT, null, Requests.class);

        return response.getBody();
    }

    public Student addMarks(int id, Marks marks) {
        String BaseUrl = "http://STUDENT-SERVICE/student/Marks";
        Student response = restTemplate.postForObject(
                BaseUrl + "/" + id,
                new HttpEntity<>(marks),
                Student.class
        );

        return response;
    }

    public Student RegisterStudent(Student studentdto) {

        String BaseUrl = "http://STUDENT-SERVICE/student";
        Student response = restTemplate.postForObject(
                BaseUrl,
                studentdto,
                Student.class
        );

        return response;

    }

    public Trainer RegisterTrainer(Trainer trainer) {
//        trainer.setSkills(null);
        String BaseUrl = "http://TRAINER-SERVICE/trainer";
        Trainer response = restTemplate.postForObject(
                BaseUrl,
                trainer,
                Trainer.class
        );

        return response;

    }

    public Student UpdateMarksByWeek(int id, Marks marksdto) {
        String BaseUrl = "http://STUDENT-SERVICE/student/Marks";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Marks> requestEntity = new HttpEntity<>(marksdto, headers);

        ResponseEntity<Student> responseEntity = restTemplate.exchange(BaseUrl + "/" + id, HttpMethod.PUT, requestEntity, Student.class);

        return responseEntity.getBody();
    }


//    public Trainer saveTrainerPdf(int id, MultipartFile file) throws IOException {
//        String Baseurl="http://TRAINER-SERVICE/trainer/saveTimeTablePdf";
//        String url = String.format("%s/%d", Baseurl, id);
//
//        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
//        body.add("file", new MultipartInputStreamFileResource(file.getInputStream(), file.getOriginalFilename()));
//
//        HttpHeaders headers = new HttpHeaders();
//        headers.setContentType(MediaType.MULTIPART_FORM_DATA);
//
//        HttpEntity<MultiValueMap<String, Object>> entity = new HttpEntity<>(body, headers);
//
//        ResponseEntity<Trainer> response = restTemplate.exchange(url, HttpMethod.POST, entity, Trainer.class);
//
//        return response.getBody();
//    }

    public Trainer saveTrainerPdf(int id, MultipartFile file) throws IOException {
        String TRAINER_SERVICE_URL = "http://TRAINER-SERVICE/trainer/saveTimeTablePdf/";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);
        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("file", file.getResource());
        HttpEntity<MultiValueMap<String, Object>> entity = new HttpEntity<>(body, headers);
        try {
            ResponseEntity<Trainer> response = restTemplate.exchange(
                    TRAINER_SERVICE_URL + id,
                    HttpMethod.POST,
                    entity,
                    Trainer.class);

            if (response.getStatusCode() == HttpStatus.OK) {
                return response.getBody();
            } else {
                throw new RuntimeException("Failed to upload the timetable PDF.");
            }
        } catch (Exception e) {
            throw new RuntimeException("Error while communicating with Trainer service: " + e.getMessage(), e);
        }
    }

    public List<Student> CreateNewDateAttendence(String trainingRoom, LocalDate date){

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

    public int GetnumberOfTrainingRoom(){
        List<Maintainer> maintainers=maintainerRepository.findAll();
        Maintainer m=null;
        if(!maintainers.isEmpty()) {
            m = maintainers.get(0);
        }
        return m.getRoomSize();
    }

    public int PostNumberOfTrainingRoom(int number){
        roomsize=number;
        saveallMaintainer();
        return roomsize;
    }
    public void saveallMaintainer(){
        List<Maintainer> maintainers=maintainerRepository.findAll();
        for(Maintainer maintainer:maintainers){
            maintainer.setRoomSize(roomsize);
            maintainerRepository.save(maintainer);
        }
    }
    public List<Manager> getAllManagers() {
        String url = "http://MANAGER-SERVICE/manager";
        Manager[] managersList=restTemplate.getForObject(url, Manager[].class);
        List<Manager> managers=new ArrayList<>();
        for(Manager s:managersList){
            managers.add(s);
        }
        return managers;
    }
    public List<Requests> getAllRequests() {
        String url = "http://MANAGER-SERVICE/manager/request";
        Requests[] requestsList=restTemplate.getForObject(url, Requests[].class);
        List<Requests> requests=new ArrayList<>();
        for(Requests s:requestsList){
            requests.add(s);
        }
        return requests;
    }
    public List<Requests> getRequestByStatus(RequestStatus requestStatus){
        String url = "http://MANAGER-SERVICE/manager/request/status/"+requestStatus;
        Requests[] requestsList=restTemplate.getForObject(url, Requests[].class);
        List<Requests> requests=new ArrayList<>();
        for(Requests s:requestsList){
            requests.add(s);
        }
        return requests;
    }
    public Trainer unassignRoom(int id){
        String url="http://TRAINER-SERVICE/trainer/UnAssignRoom/";
        ResponseEntity<Trainer> response=restTemplate.exchange(url+id,HttpMethod.PUT,null,Trainer.class);
        return response.getBody();
    }

    public void unassignStudentTrainingRoom(String trainingroom){
        String url="http://STUDENT-SERVICE/student/MakeTrainingDone/"+trainingroom;


        ResponseEntity response=restTemplate.exchange(url,HttpMethod.PUT,null,ResponseEntity.class);

        return;
    }


    public List<Student> getallstudentTrainingDone(){
        String url="http://STUDENT-SERVICE/student/GetallTrainingDoneStudents";

        Student[] StudentList = restTemplate.getForObject(url, Student[].class);
        List<Student> students = new ArrayList<>();
        for (Student i : StudentList) {
            students.add(i);
        }
        return students;

    }


    public List<FeedBack> gettallfeedbackbyTrainer(int id){
        String url="http://TRAINER-SERVICE/trainer/allFeebackbyTrainer/";
        FeedBack[] feedBacks=restTemplate.getForObject(url+id,FeedBack[].class);
        List<FeedBack> feedBackList=new ArrayList<>();
        for(FeedBack f:feedBacks){
            feedBackList.add(f);
        }
        return feedBackList;
    }

}



