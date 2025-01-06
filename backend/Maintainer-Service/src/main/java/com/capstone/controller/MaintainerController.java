package com.capstone.controller;


import com.capstone.dto.*;
import com.capstone.model.Maintainer;
import com.capstone.service.MaintainerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/maintainer")
//@CrossOrigin
public class MaintainerController {

    @Autowired
    private MaintainerService maintainerService;

    @GetMapping
    public List<Maintainer> getAllMaintainers(){
        return maintainerService.getall();
    }




    @GetMapping("/AllCompletedStudents")
    public List<Student> getalldoneSTudents(){
        return maintainerService.getallstudentTrainingDone();
    }

    @PutMapping("/makeTrainingRoomDone/{trainingroom}")
    public void maketrainingroomdone(@PathVariable String trainingroom){
        maintainerService.unassignStudentTrainingRoom(trainingroom);
    }

    @PostMapping
    public Maintainer saveNewMaintainer(@RequestBody Maintainer maintainer){
        return maintainerService.saveMaintainer(maintainer);
    }

    @PutMapping("/{id}")
    public Maintainer updateTheMaintainer(@PathVariable int id,@RequestBody Maintainer maintainer){
        return maintainerService.updateMaintainer(id,maintainer);
    }

    @GetMapping("/trainers")
    public List<Trainer> getAllTheTrainers(){
        return maintainerService.getAllTrainers();
    }

    @GetMapping("/getStudentsByRoom/{trainingRoom}")
    public List<Student> getStudentsByRoom(@PathVariable String trainingRoom){
        return maintainerService.getStudentsByTrainingRoom(trainingRoom);
    }
    @GetMapping("/getallFeedbacksbyTrainer/{TrainerID}")
    public List<FeedBack> getFeedbackByTrainer(@PathVariable int TrainerID){
        return maintainerService.gettallfeedbackbyTrainer(TrainerID);
    }

    @GetMapping("/getMaintainerByEmail/{email}")
    public int getMaintainerByemail(@PathVariable String email){
        return maintainerService.getMaintainerByEmail(email);
    }
    @GetMapping("/getMaintainerNameByEmail/{email}")
    public String getMaintainerNameByemail(@PathVariable String email){
        return maintainerService.getMaintainerNameByEmail(email);
    }

//    @PostMapping("/AssignTrainingRoom/{id}")
//    public Trainer AssignRoomToTrainer(@PathVariable int id, @RequestParam String trainingRoom){
//        return maintainerService.AssignTrainingRoom(id,trainingRoom);
//    }

    @PutMapping("/UpdateTrainerTrainingRoom/{id}")
    public Trainer UpdateTrainingRoomToTrainer(@PathVariable int id,@RequestParam String trainingRoom){
        return maintainerService.UpdateTrainingRoom(id,trainingRoom);
    }

    @PutMapping("/updateRequest/{id}")
    public Requests UpdateRequestMaintainer(@PathVariable int id, @RequestParam RequestStatus requestStatus,@RequestParam String msg, @RequestParam String maintainerName){
        return maintainerService.UpdateRequest(id,requestStatus,msg,maintainerName);
    }

    @PostMapping("/AddNewMarks/{StudentId}")
    public Student AddMarksToStudent(@PathVariable int StudentId,@RequestBody Marks marks){
        return maintainerService.addMarks(StudentId,marks);
    }

    @PostMapping("/registerStudents")
    public Student RegisterNewStudent(@RequestBody Student studentdto){
        return maintainerService.RegisterStudent(studentdto);
    }

    @PutMapping("/updateroomandDuration/{id}")
    public Student updateRoomandDuration(@PathVariable int id, @RequestParam String trainingRoom, @RequestParam int duration){
        return maintainerService.updateRoomandDuration(id,trainingRoom,duration);
    }

    @PostMapping("/registerTrainer")
    public Trainer RegisterTrainer(@RequestBody Trainer trainer){
        return maintainerService.RegisterTrainer(trainer);
    }

    @PutMapping("/UpdateMarksByWeek/{Studentid}")
    public Student UpdateMarksByWeekNumber(@PathVariable int Studentid,@RequestBody Marks marks){
        return maintainerService.UpdateMarksByWeek(Studentid,marks);
    }


    @PostMapping("/createnewDateAttendence/{Trainingroom}")
    public List<Student> CreateNewDateAttendence(@PathVariable String Trainingroom, @RequestParam LocalDate date){
        return maintainerService.CreateNewDateAttendence(Trainingroom,date);
    }




    //    public Trainer saveTrainerPdf(int id, MultipartFile file) throws IOException;
    @PostMapping("/saveTimeTablePdf/{id}")
    public Trainer uploadTimeTablePdf(@PathVariable int id, @RequestParam("file") MultipartFile file) throws IOException {
        return maintainerService.saveTrainerPdf(id,file);
    }
    @GetMapping("GetTrainingRoomSize")
    public int getRoomSize()
    {
        return maintainerService.GetnumberOfTrainingRoom();
    }
    @PostMapping("AssignNumberOfTrainingRooms/{roomSize}")
    public void AssignTrainingRoom(@PathVariable int roomSize)
    {
        maintainerService.PostNumberOfTrainingRoom(roomSize);
    }
    @GetMapping("/managers")
    public List<Manager> getAllManagers(){
        return maintainerService.getAllManagers();
    }
    @GetMapping("/request")
    public List<Requests> getAllRequests() {
        return maintainerService.getAllRequests();
    }
    @GetMapping("/request/status/{status}")
    public List<Requests> getRequestByStatus(@PathVariable RequestStatus status){
        return maintainerService.getRequestByStatus(status);
    }
    @GetMapping("/timetable/{trainerId}/preview")
    public ResponseEntity<FileSystemResource> previewTimetable(@PathVariable int trainerId) {
        List<Trainer> trainers=maintainerService.getAllTrainers();
        Trainer trainer=null;
        for(Trainer t:trainers){
            if(t.getTrainerId()==trainerId)
            {
                trainer=t;
                break;
            }
        }
        String filePath = trainer.getTimeTablePDF(); // Get the file path
        File file = new File(filePath);

        if (!file.exists()) {
            throw new RuntimeException("File not found");
        }

        Path path = file.toPath();
        FileSystemResource resource = new FileSystemResource(file);

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .body(resource);
    }

    @GetMapping("/getAllStudents")
    public List<Student> getAllStudents(){
        return maintainerService.getallStudents();
    }


    @PutMapping("/UnAssignRoom/{id}")
    public Trainer UnassignRoom(@PathVariable int id){
        return maintainerService.unassignRoom(id);
    }


}
