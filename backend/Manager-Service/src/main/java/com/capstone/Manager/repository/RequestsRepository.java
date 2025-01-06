package com.capstone.Manager.repository;

import com.capstone.Manager.model.RequestStatus;
import com.capstone.Manager.model.Requests;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface RequestsRepository extends JpaRepository<Requests,Integer> {
    @Query("from Requests where status = :name")
    List<Requests> findRequestsByStatus(RequestStatus name);
}
