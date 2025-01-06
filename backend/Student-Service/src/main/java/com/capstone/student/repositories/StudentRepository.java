package com.capstone.student.repositories;

import com.capstone.student.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface StudentRepository extends JpaRepository<Student,Integer> {
    @Query("from Student where TrainingRoom = :name")
    List<Student> findStudentByTrainingRoom(String name);
}
