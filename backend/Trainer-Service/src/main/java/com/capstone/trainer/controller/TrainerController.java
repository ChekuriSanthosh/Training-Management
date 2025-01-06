package com.capstone.trainer.controller;


import com.capstone.trainer.dto.FeedBack;
import com.capstone.trainer.dto.Marks;
import com.capstone.trainer.dto.Student;
import com.capstone.trainer.model.Trainer;
import com.capstone.trainer.service.TrainerService;
import jakarta.annotation.Resource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.yaml.snakeyaml.error.Mark;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/trainer")
//@CrossOrigin
public class TrainerController {
    @Autowired
    TrainerService trainerService;

    @ResponseStatus(code = HttpStatus.OK)
    @GetMapping
    public List<Trainer> getallTrainers(){
        return trainerService.getallTrainer();
    }

    @ResponseStatus(code = HttpStatus.OK)
    @GetMapping("/getTrainerByEmail/{email}")
    public int getByTrainerEmail(@PathVariable String email){
        return trainerService.getTrainerByemail(email);
    }

    @ResponseStatus(code = HttpStatus.CREATED)
    @PostMapping
    public Trainer saveTrainer(@RequestBody Trainer trainerdto){
        return trainerService.saveTrainer(trainerdto);
    }

    @ResponseStatus(code = HttpStatus.OK)
    @GetMapping("/{id}")
    public Trainer getTrainerByid(@PathVariable int id){
        return trainerService.getTrainerById(id);
    }

    @ResponseStatus(code = HttpStatus.OK)
    @GetMapping("/room/{room}")
    public Trainer getTrainerByTrainingRoom(@PathVariable String room){
        return trainerService.getTrainerByTrainingRoom(room);
    }

    @ResponseStatus(code = HttpStatus.OK)
    @PutMapping("/update/{id}")
    public Trainer updateTrainer(@PathVariable int id, @RequestBody Trainer trainerdto){
        return trainerService.UpdateTrainer(id,trainerdto);
    }




//    @ResponseStatus(code = HttpStatus.OK)
//    @PutMapping("/assigntrainerFeedback/{id}")
//    public Trainer addtrainerFeedback(@PathVariable int id,@RequestBody FeedBack feedBack){
//        return trainerService.AddTrainerFeedback(id,feedBack);
//    }





    @ResponseStatus(code = HttpStatus.OK)
    @GetMapping("/allstudents/{id}")
    public List<Student> getallStudents(@PathVariable int id){
        return trainerService.getallStudents(id);
    }
    @ResponseStatus(code = HttpStatus.OK)
    @PutMapping("/DisableNotification/{id}")
    public Trainer disableNotification(@PathVariable int id){
        return trainerService.disableNotification(id);
    }

    @ResponseStatus(code = HttpStatus.OK)
    @PutMapping("/makeFeedbackNull/{trainingRoom}")
    public void makeitnull(@PathVariable String trainingRoom){
        trainerService.MakeFeedbacksnull(trainingRoom);
    }

    @ResponseStatus(code = HttpStatus.OK)
    @GetMapping("/TrainerFeedbacks/{id}")
    public List<FeedBack> getallFeedbacks(@PathVariable int id){
        return trainerService.getAllFeedBacks(id);
    }
    @ResponseStatus(code = HttpStatus.CREATED)
    @PostMapping("/Attendence/{TrainerId}/{StudentId}")
    public Student saveAttendence(@PathVariable int TrainerId, @RequestParam LocalDate date, @RequestParam String AttendenceStatus, @PathVariable int StudentId){
        return trainerService.saveAttendence(TrainerId,date,AttendenceStatus,StudentId);
    }
    @PostMapping("/MarkAllPresent/{TrainerId}")
    public List<Student> markAllPresent(@PathVariable int TrainerId,@RequestParam LocalDate date){
        return trainerService.markAllStudentPresent(TrainerId,date);
    }
    @PostMapping("/CreateNewAttendence/{TrainerId}")
    public List<Student> CreateNewAttendence(@PathVariable int TrainerId,@RequestParam LocalDate date){
        return trainerService.CreateNewDateAttendence(TrainerId,date);
    }



    @PostMapping("/AssignTrainingRoom/{id}")
    public Trainer AssignTrainingRoomForTrainer(@PathVariable int id,@RequestParam String trainingRoom){
        return trainerService.AssignTrainingRoom(id,trainingRoom);
    }

    @PutMapping("/UpdateTrainingRoom/{id}")
    public Trainer UpdateTrainingRoomForTrainer(@PathVariable int id,@RequestParam String trainingRoom){
        return trainerService.UpdateTrainingRoom(id,trainingRoom);
    }

    @PostMapping("/saveTimeTablePdf/{id}")
    public Trainer saveTheTrainerPDF(@PathVariable int id,@RequestParam("file") MultipartFile file) throws IOException {
        return trainerService.saveTrainerPdf(id,file);
    }

    @GetMapping("/timetable/{trainerId}/download")
    public ResponseEntity<FileSystemResource> downloadTimetable(@PathVariable int trainerId) {
        // Fetch the file path for the trainer from the database
        Trainer t=trainerService.getTrainerById(trainerId);
        String filePath = t.getTimeTablePDF();
        if(filePath==null){
            return null;// Update with your service logic
        }
        File file = new File(filePath);

        if (!file.exists()) {
            throw new RuntimeException("File not found");
        }

        Path path = file.toPath();
        FileSystemResource resource = new FileSystemResource(file);

        String contentDisposition = "attachment; filename=\"" + file.getName() + "\"";
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, contentDisposition)
                .body(resource);
    }


    @GetMapping("/timetable/{trainerId}/preview")
    public ResponseEntity<FileSystemResource> previewTimetable(@PathVariable int trainerId) {
        Trainer t=trainerService.getTrainerById(trainerId);
        String filePath = t.getTimeTablePDF(); // Get the file path
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
    @ResponseStatus(code = HttpStatus.OK)
    @PutMapping("/UnAssignRoom/{id}")
    public Trainer UnassignRoom(@PathVariable int id){
        return trainerService.UnassignRoom(id);
    }

    @GetMapping("allFeebackbyTrainer/{TrainerId}")
    @ResponseStatus(code = HttpStatus.OK)
    public List<FeedBack> getallfeedbackbyid(@PathVariable int TrainerId){
        return trainerService.getFeedBackbyTrainer(TrainerId);
    }



}
