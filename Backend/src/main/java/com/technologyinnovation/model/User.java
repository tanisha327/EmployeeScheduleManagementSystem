package com.technologyinnovation.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "app_user")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String username; // This is email
    @Column
    private String password;

    private String name; // The name of the user

    private String organizationNumber;

    @Enumerated(EnumType.STRING)
    private UserRole userRole;

    private Long loggedInUserId;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Event> events = new ArrayList<>();
}
