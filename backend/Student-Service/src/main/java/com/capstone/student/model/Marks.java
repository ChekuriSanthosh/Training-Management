package com.capstone.student.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "marks")
public class Marks {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int MarksId;
    private int WeekName;
    private double marks;
    @JsonIgnore
    @ManyToOne
    private Student student;
}
