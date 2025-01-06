package com.capstone.admin.service;
import com.capstone.admin.dtos.*;
import org.h2.engine.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
@Service
public class AdminServiceImpl implements AdminService{
    @Autowired
    private RestTemplate restTemplate;

    public Manager saveManager(Manager manager){
        String url="http://MANAGER-SERVICE/manager";
        ResponseEntity<Manager> response=restTemplate.exchange(url,HttpMethod.POST,new HttpEntity<>(manager),Manager.class);
        return response.getBody();
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
    public List<Student> getallStudents(){
        String url = "http://STUDENT-SERVICE/student";
        Student[] StudentList = restTemplate.getForObject(url + "/allStudents", Student[].class);
        List<Student> students = new ArrayList<>();
        for (Student i : StudentList) {
            students.add(i);
        }
        return students;
    }

    public Maintainer saveMaintainer(Maintainer maintainer) {
//        Maintainer maintainer1=new Maintainer();
//        maintainer1.setMaintainerName(maintainer.getMaintainerName());
        String url = "http://MAINTAINER-SERVICE/maintainer";
        ResponseEntity<Maintainer> response = restTemplate.exchange(url, HttpMethod.POST, new HttpEntity<>(maintainer), Maintainer.class);
//        UserDetails user=new UserDetails();
//        user.setUserId(response.getBody().getMaintainerId());
//        user.setUsername(maintainer.getUsername());
//        user.setPassword(maintainer.getPassword());
//        user.setRole(maintainer.getRole());
//        String url1 = "http://localhost:8888/auth/register";
//        ResponseEntity<UserDetails> response1 = restTemplate.exchange(url1, HttpMethod.POST, new HttpEntity<>(user), UserDetails.class);
        return response.getBody();
    }

    public List<Student> getStudentByTrainingRoom(String trainingRoom) {
        String url = "http://STUDENT-SERVICE/student/trainingRoom";
        Student[] studentList=restTemplate.getForObject(url+"/"+trainingRoom, Student[].class);
        List<Student> students=new ArrayList<>();
        for(Student s:studentList){
            students.add(s);
        }
        return students;
    }

    public List<Trainer> getAllTrainers() {
        String url = "http://TRAINER-SERVICE/trainer";
        Trainer[] trainersList=restTemplate.getForObject(url, Trainer[].class);
        List<Trainer> trainers=new ArrayList<>();
        for(Trainer s:trainersList){
            trainers.add(s);
        }
        return trainers;
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


    public List<Maintainer> getAllMaintainers() {
        String url = "http://MAINTAINER-SERVICE/maintainer";
        Maintainer[] maintainersList=restTemplate.getForObject(url, Maintainer[].class);
        List<Maintainer> maintainers=new ArrayList<>();
        for(Maintainer s:maintainersList){
            maintainers.add(s);
        }
        return maintainers;
    }

    public int getTrainingRoomSize(){
        String url="http://MAINTAINER-SERVICE/maintainer/GetTrainingRoomSize";
        return restTemplate.getForObject(url, Integer.class);
    }
    public void PostTrainingRoomSize(int id){
        String url="http://MAINTAINER-SERVICE/maintainer/AssignNumberOfTrainingRooms/"+id;
        restTemplate.postForObject(url,null,Void.class);
    }
}
