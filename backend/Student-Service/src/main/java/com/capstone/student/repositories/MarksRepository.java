package com.capstone.student.repositories;

import com.capstone.student.model.Marks;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MarksRepository extends JpaRepository<Marks,Integer> {
}
