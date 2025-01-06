package com.capstone.Manager.repository;

import com.capstone.Manager.model.Manager;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ManagerRepository extends JpaRepository<Manager, Integer> {

    @Query("from Manager where AccountType = :name")
    List<Manager> findByAccountName(String name);

    @Query("from Manager where ManagerName = :name")
    List<Manager> findByManagerName(String name);

}
