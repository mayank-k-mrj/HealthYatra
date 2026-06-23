package healthyatra.com.healthyatra.Model.PicEntity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "prof_pic")
@Data
public class ProfPicEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "aadhar", nullable = false, unique = true)
    private String aadhar;

    @Column(name = "pic", nullable = true, unique = true)
    private String pic;
}
