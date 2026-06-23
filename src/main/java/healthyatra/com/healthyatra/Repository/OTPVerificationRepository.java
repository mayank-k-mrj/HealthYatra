package healthyatra.com.healthyatra.Repository;

import healthyatra.com.healthyatra.Model.EmailVerify.OTPVerification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OTPVerificationRepository extends JpaRepository<OTPVerification, Long> {
    OTPVerification findByEmail(String email);
}
