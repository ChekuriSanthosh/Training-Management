package com.capstone.trainer.repository;

import com.capstone.trainer.model.Trainer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface TrainerRepository extends JpaRepository<Trainer,Integer> {
    @Query("from Trainer where trainingRoom = :name")
    public List<Trainer> getTrainerfromTrainingRoom(String name);
}
