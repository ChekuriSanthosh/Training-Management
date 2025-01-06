package com.capstone.student.repositories;

import com.capstone.student.model.Attendence;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AttendenceRepository extends JpaRepository<Attendence,Integer> {
}
