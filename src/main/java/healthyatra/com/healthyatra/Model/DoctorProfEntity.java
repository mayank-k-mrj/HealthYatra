package healthyatra.com.healthyatra.Model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Table(name = "doctor_prof")
@Data
public class DoctorProfEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "first_name", nullable = false)
    private String first_name;

    @Column(name = "middle_name", nullable = true)
    private String middle_name;

    @Column(name = "last_name", nullable = false)
    private String last_name;

    @Column(name = "medical_regi", nullable = false)
    private String medical_regi;

    @Column(name = "qualification", nullable = false)
    private String qualification;

    @Column(name = "specilization", nullable = true)
    private String specilization;

    @Column(name = "exp", nullable = false)
    private int exp;

    @Column(name = "license_no", nullable = false)
    private String license_no;

    @Column(name = "license_validity", nullable = false)
    private LocalDate license_validity;

    @Column(name = "hospital_name", nullable = false)
    private String hospital_name;

    @Column(name = "working_loc", nullable = false)
    private String working_loc;

    @Column(name = "aadhar", nullable = false, unique = true)
    private String aadhar;

}
