package healthyatra.com.healthyatra.Service;

import healthyatra.com.healthyatra.Model.HealthRecordEntity;

import java.util.List;

public interface HealthRecordService {
    HealthRecordEntity CreateHealthRecord(HealthRecordEntity healthRecordEntity, String aadhar);
    List<HealthRecordEntity> fetchHealthRecord(String aadhar);
    HealthRecordEntity updateHealthRecord(HealthRecordEntity healthRecordEntity, Long id);
}
