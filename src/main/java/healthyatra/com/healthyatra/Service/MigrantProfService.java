package healthyatra.com.healthyatra.Service;

import healthyatra.com.healthyatra.Model.MigrantProfEntity;
import healthyatra.com.healthyatra.Model.PicEntity.ProfPicEntity;
import org.springframework.web.multipart.MultipartFile;

public interface MigrantProfService {

    Boolean createMigrantProf(MigrantProfEntity migrantProfEntity, String aadhar);
    Boolean updateMigrantProf(MigrantProfEntity migrantProfEntity, String aadhar);
    MigrantProfEntity fetchMigrant(String aadhar);
    String migrantPic(String aadhar, MultipartFile file);
    ProfPicEntity fetchMigPic(String aadhar);
}
