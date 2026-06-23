package healthyatra.com.healthyatra.Model;

import healthyatra.com.healthyatra.DTO.Role;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "registration")
@Data
public class RegisterEntity{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "username")
    private String username;

    @Column(name = "name", nullable = false, unique = true)
    private String name;

    @Column(name = "phone", nullable = false, unique = true)
    private String phone;

    @Column(name = "aadhar", nullable = false, unique = true)
    private String aadhar;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "isverified", nullable = false)
    private Boolean isverified = false;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    private Role role;

    public String getRoles(){
        return role.name();
    }
}
