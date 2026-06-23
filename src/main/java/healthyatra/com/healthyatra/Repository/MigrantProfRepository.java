package healthyatra.com.healthyatra.Repository;

import healthyatra.com.healthyatra.Model.MigrantProfEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MigrantProfRepository extends JpaRepository<MigrantProfEntity, Long> {
    MigrantProfEntity findByAadhar(String aadhar);
}
