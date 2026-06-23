package healthyatra.com.healthyatra.Repository;

import healthyatra.com.healthyatra.Model.EmailVerify.EmailVerification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmailVerificationRepository extends JpaRepository<EmailVerification, Long> {
    EmailVerification findByEmail(String email);
    Boolean existsByEmail(String email);
}
