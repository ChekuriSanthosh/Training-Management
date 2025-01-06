package com.capstone.repository;

import com.capstone.model.Maintainer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MaintainerRepository extends JpaRepository<Maintainer,Integer> {
}
