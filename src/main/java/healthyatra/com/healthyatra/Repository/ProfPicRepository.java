package healthyatra.com.healthyatra.Repository;

import healthyatra.com.healthyatra.Model.PicEntity.ProfPicEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProfPicRepository extends JpaRepository<ProfPicEntity, Long> {
    ProfPicEntity findByAadhar(String aadhar);
}
