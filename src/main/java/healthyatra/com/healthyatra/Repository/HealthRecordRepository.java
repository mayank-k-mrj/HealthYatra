package healthyatra.com.healthyatra.Repository;

import healthyatra.com.healthyatra.Model.HealthRecordEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HealthRecordRepository extends JpaRepository<HealthRecordEntity, Long> {
    List<HealthRecordEntity> findByMigAadhar(String aadhar);
}
