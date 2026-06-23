package healthyatra.com.healthyatra.Model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "migrant_prof")
@Data
public class MigrantProfEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "first_name", nullable = false)
    private String first_name;

    @Column(name = "middle_name", nullable = true)
    private String middle_name;

    @Column(name = "last_name", nullable = false)
    private String last_name;

    @Column(name = "age", nullable = false)
    private int age;

    @Column(name = "gender", nullable = false)
    private String gender;

    @Column(name = "blood_g")
    private String blood_g;

    @Column(name = "add_curr")
    private String add_curr;

    @Column(name = "add_native")
    private String add_native;

    @Column(name = "emergency_c", nullable = false)
    private String emergency_c;

    @Column(name = "occupation")
    private String occupation;

    @Column(name = "aadhar", nullable = false, unique = true)
    private String aadhar;

}
