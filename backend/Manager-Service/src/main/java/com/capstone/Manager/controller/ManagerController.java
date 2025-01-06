package com.capstone.Manager.controller;

import com.capstone.Manager.model.Manager;
import com.capstone.Manager.model.RequestStatus;
import com.capstone.Manager.model.Requests;
import com.capstone.Manager.service.ManagerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/manager")
//@CrossOrigin
public class ManagerController {
    @Autowired
    ManagerService managerservice;


    @ResponseStatus(code = HttpStatus.OK)
    @GetMapping("/{id}")
    public Manager getManager(@PathVariable int id){
        return managerservice.GetManagerById(id);
    }

    @ResponseStatus(code = HttpStatus.OK)
    @GetMapping
    public List<Manager> getAllManagers(){
        return managerservice.GetAllManagers();
    }

    @ResponseStatus(code = HttpStatus.CREATED)
    @PostMapping
    public Manager saveManager(@RequestBody Manager managerdto){
        return managerservice.saveManager(managerdto);
    }

    @ResponseStatus(code = HttpStatus.OK)
    @GetMapping("/name/{name}")
    public List<Manager> getManagerbyName(@PathVariable String name){
        return managerservice.GetManagersbyName(name);
    }

    @ResponseStatus(code = HttpStatus.OK)
    @GetMapping("/getManagerByemail/{email}")
    public int getManagerByEmail(@PathVariable String email){
        return managerservice.getManagerByemail(email);
    }

    @ResponseStatus(code = HttpStatus.OK)
    @GetMapping("/accountType/{name}")
    public List<Manager> getManagerbyAccount(@PathVariable String name){
        return managerservice.GetManagersbyAccountType(name);
    }

    @ResponseStatus(code = HttpStatus.OK)
    @PutMapping("/update/{id}")
    public Manager updateManager(@PathVariable int id, @RequestBody Manager managerdto){
        return managerservice.updateManager(id,managerdto);
    }

    @ResponseStatus(code = HttpStatus.NO_CONTENT)
    @DeleteMapping("/delete/{id}")
    public void deleteManager(@PathVariable int id){
        managerservice.deleteManagerbyId(id);
    }

    @ResponseStatus(code = HttpStatus.CREATED)
    @PostMapping("/request")
    public Requests PostRequest(@RequestBody Requests requestsdto){
        return managerservice.saveRequest(requestsdto);
    }

    @ResponseStatus(code = HttpStatus.OK)
    @GetMapping("/request")
    public List<Requests> getAllRequests(){
        return managerservice.getAllRequest();
    }

    @ResponseStatus(code = HttpStatus.OK)
    @GetMapping("/request/{id}")
    public Requests findRequestById(@PathVariable int id){
        return managerservice.getRequestById(id);
    }

    @ResponseStatus(code = HttpStatus.OK)
    @GetMapping("/request/status/{name}")
    public List<Requests> findRequestByStatus(@PathVariable RequestStatus name){
        return managerservice.getRequestByStatus(name);
    }

    @ResponseStatus(code = HttpStatus.NO_CONTENT)
    @DeleteMapping("/request/{id}")
    public void deleteRequestById(@PathVariable int id){
        managerservice.deleteRequestById(id);
    }

    @ResponseStatus(code = HttpStatus.OK)
    @PutMapping("/UpdateRequestAdmin/{id}")
    public Requests updateRequestByAdmin(@PathVariable int id,@RequestParam RequestStatus requestStatus, @RequestParam String msg,@RequestParam String maintainerName){
        return managerservice.UpdateRequestAdmin(id,requestStatus,msg,maintainerName);
    }


}
