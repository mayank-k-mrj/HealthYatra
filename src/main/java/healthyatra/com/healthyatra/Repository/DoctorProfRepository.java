package healthyatra.com.healthyatra.Repository;

import healthyatra.com.healthyatra.Model.DoctorProfEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DoctorProfRepository extends JpaRepository<DoctorProfEntity, Long> {
    DoctorProfEntity findByAadhar(String aadhar);
}
