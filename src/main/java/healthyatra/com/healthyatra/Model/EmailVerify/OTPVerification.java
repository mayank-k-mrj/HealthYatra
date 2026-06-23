package healthyatra.com.healthyatra.Model.EmailVerify;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "otpverify")
@Data
public class OTPVerification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "email", unique = true)
    private String email;
    private String otp;
    private LocalDateTime expiryTime;
}
