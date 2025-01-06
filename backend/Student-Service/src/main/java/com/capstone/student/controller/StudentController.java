package com.capstone.student.controller;

import com.capstone.student.model.Attendence;
import com.capstone.student.model.Feedback;
import com.capstone.student.model.Marks;
import com.capstone.student.model.Student;
import com.capstone.student.repositories.AttendenceRepository;
import com.capstone.student.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/student")
//@CrossOrigin
public class StudentController {
    @Autowired
    StudentService studentService;

    @Autowired
    AttendenceRepository attendenceRepository;

    @ResponseStatus(code = HttpStatus.CREATED)
    @PostMapping
    public Student saveStudent(@RequestBody Student student){
        return studentService.saveStudent(student);
    }

    @GetMapping("hello")
    public String hello(){
        return "Hello";
    }
    @ResponseStatus(code = HttpStatus.OK)
    @GetMapping("/{id}")
    public Student getStudentById(@PathVariable int id){
        return studentService.getStudentById(id);
    }

    @ResponseStatus(code = HttpStatus.OK)
    @GetMapping("/getStudentbymail/{email}")
    public int getIdBymail(@PathVariable String email){
        return studentService.getStudentByemail(email);
    }

    @ResponseStatus(code = HttpStatus.OK)
    @PutMapping("/{id}")
    public Student updateStudentById(@PathVariable int id,@RequestBody Student student){
        return studentService.UpdateStudent(id,student);
    }

    @ResponseStatus(code = HttpStatus.OK)
    @GetMapping("/trainingRoom/{room}")
    public List<Student> getStudentsByTrainingRoom(@PathVariable String room){
        return studentService.getStudentsByTrainingRoom(room);
    }

    @ResponseStatus(code = HttpStatus.OK)
    @GetMapping("/Marks/{id}")
    public List<Marks> getMarksById(@PathVariable int id){
        return studentService.getMarksById(id);
    }

    @ResponseStatus(code = HttpStatus.CREATED)
    @PostMapping("/Marks/{id}")
    public Student AddMarks(@PathVariable int id, @RequestBody Marks marks){
        return studentService.AddMarks(id,marks);
    }

    @ResponseStatus(code = HttpStatus.OK)
    @PutMapping("/Marks/{id}")
    public Student UpdateMarks(@PathVariable int id, @RequestBody Marks marks){
        return studentService.UpdateMarks(id,marks);
    }
    @ResponseStatus(code = HttpStatus.CREATED)
    @PostMapping("/FeedBack/{id}")
    public Student AddFeedBack(@PathVariable int id, @RequestBody Feedback feedback){
        return studentService.saveFeedback(id,feedback);
    }
    @PostMapping("/MarkAllPresent/{trainingroom}")
    public List<Student> markAllpresent(@PathVariable String trainingroom,
                                        @RequestParam  LocalDate date) {
        return studentService.markAllStudentPresent(trainingroom, date);
    }

    @PostMapping("/CreateNewDateAttendence/{trainingroom}")
    public List<Student> createNewDateAttendence(@PathVariable String trainingroom, @RequestParam LocalDate date){
        return studentService.CreateNewDateAttendence(trainingroom,date);
    }

    @ResponseStatus(code = HttpStatus.OK)
    @PostMapping("/SaveAttendence/{id}")
    public Student SaveAttendenceRepository(@RequestParam String Trainingroom,@RequestParam LocalDate date, @RequestParam String attendanceStatus, @PathVariable int id){
        return studentService.saveAttendence(Trainingroom,date,attendanceStatus,id);
    }

    @ResponseStatus(code=HttpStatus.OK)
    @PutMapping("/updateRoomandDuration/{id}")
    public Student updateRoomandDuration(@PathVariable int id, @RequestParam String trainingRoom,@RequestParam int duration){
        return studentService.UpdateTrainingRoom(id, trainingRoom, duration);
    }


    @ResponseStatus(code = HttpStatus.OK)
    @GetMapping("/allFeedbacks")
    public List<Feedback> getallFeedbacks(){
        return studentService.getallfeedbacks();
    }


    @ResponseStatus(code = HttpStatus.OK)
    @PutMapping("/setFeedbackNull/{trainingRoom}")
    public void SetFeedbackNull(@PathVariable String trainingRoom){
        studentService.SetFeedbackNull(trainingRoom);
    }


    @ResponseStatus(code = HttpStatus.OK)
    @GetMapping("/allStudents")
    public List<Student> getAllStudents(){
        return studentService.getAllStudents();
    }


    @ResponseStatus(code = HttpStatus.OK)
    @GetMapping("/GetallTrainingDoneStudents")
    public List<Student> getallTrainingRoomDone(){
        return studentService.getTrainingDoneStudents();
    }



    @ResponseStatus(code = HttpStatus.OK)
    @PutMapping("/MakeTrainingDone/{trainingroom}")
    public void makeTrainingDone(@PathVariable String trainingroom){
        studentService.StudentTrainingDone(trainingroom);
    }
}
