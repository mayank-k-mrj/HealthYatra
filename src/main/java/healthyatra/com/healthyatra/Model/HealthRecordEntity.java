package healthyatra.com.healthyatra.Model;

import healthyatra.com.healthyatra.Model.DoctorProfEntity;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.util.Set;

@Entity
@Table(name = "health_record")
@Data
public class HealthRecordEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "date", nullable = false)
    private LocalDate date = LocalDate.now();

    @Column(name = "symptoms", nullable = false)
    private String symptoms;

    @Column(name = "diagnois", nullable = false)
    private String diagnosis;

    @Column(name = "medicine_prescribed")
    private String medicine_pres;

    @Column(name = "disease")
    private String disease;

    @Column(name = "allergis")
    private String allergis;

    @Column(name = "chronic_cond")
    private String chronic_cond;

    @Column(name = "migAadhar", nullable = false)
    private String migAadhar;

    @ManyToMany
    @JoinTable(name = "patient_doctor", joinColumns = @JoinColumn(name = "patient_id"), inverseJoinColumns = @JoinColumn(name = "doctor_id"))
    private Set<DoctorProfEntity> docAadhar;

}
