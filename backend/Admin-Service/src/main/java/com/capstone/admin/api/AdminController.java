package com.capstone.admin.api;

import com.capstone.admin.dtos.*;
import com.capstone.admin.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;



@RestController
@RequestMapping("/admin")
//@CrossOrigin
public class AdminController {
    @Autowired
    private AdminService adminService;
    @PostMapping("/manager")
    public Manager postManager(@RequestBody Manager manager){
        return adminService.saveManager(manager);
    }
    @PostMapping("/maintainer")
    public Maintainer postMaintainer(@RequestBody Maintainer maintainer){
        return adminService.saveMaintainer(maintainer);
    }
    @GetMapping("/students/{trainingRoom}")
    public List<Student> getAllStudents(@PathVariable String trainingRoom){
        return adminService.getStudentByTrainingRoom(trainingRoom);
    }
    @GetMapping("/trainers")
    public List<Trainer> getAllTrainers(){
        return adminService.getAllTrainers();
    }
    @GetMapping("/managers")
    public List<Manager> getAllManagers(){
        return adminService.getAllManagers();
    }
    @GetMapping("/maintainers")
    public List<Maintainer> getAllMaintainers(){
        return adminService.getAllMaintainers();
    }
    @GetMapping("/GetTrainingRoomSize")
    public int getTrainingRoomSize(){
        return adminService.getTrainingRoomSize();
    }
    @PostMapping("/AssignTrainingRoomSize/{roomSize}")
    public void AssignRoomSize(@PathVariable int roomSize){
        adminService.PostTrainingRoomSize(roomSize);
    }

    @GetMapping("/request")
    public List<Requests> getAllRequests() {
        return adminService.getAllRequests();
    }

    @GetMapping("/getAllStudents")
    public List<Student> getAllStudents(){
        return adminService.getallStudents();
    }



}
