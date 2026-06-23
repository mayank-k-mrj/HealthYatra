package healthyatra.com.healthyatra.Service;

import healthyatra.com.healthyatra.Model.DoctorProfEntity;
import healthyatra.com.healthyatra.Model.HealthRecordEntity;
import healthyatra.com.healthyatra.Model.MigrantProfEntity;
import healthyatra.com.healthyatra.Repository.DoctorProfRepository;
import healthyatra.com.healthyatra.Repository.HealthRecordRepository;
import healthyatra.com.healthyatra.Repository.MigrantProfRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.print.Doc;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class HealthRecordServiceImp implements HealthRecordService{

    @Autowired
    private HealthRecordRepository healthRecordRepository;

    @Autowired
    private MigrantProfRepository migrantProfRepository;

    @Autowired
    private DoctorProfRepository doctorProfRepository;

    @Override
    public HealthRecordEntity CreateHealthRecord(HealthRecordEntity healthRecordEntity, String aadhar){

        MigrantProfEntity migrantProfEntity = migrantProfRepository.findByAadhar(healthRecordEntity.getMigAadhar());
        System.out.println("Migrant found with aadhar : "+migrantProfEntity.getAadhar());

        if(migrantProfEntity != null){
            DoctorProfEntity doctorProfEntity = doctorProfRepository.findByAadhar(aadhar);
            System.out.println("Doctor found with aadhar : "+doctorProfEntity.getAadhar());

            if(doctorProfEntity != null){
                HashSet<DoctorProfEntity> doc_set = new HashSet<>();
                doc_set.add(doctorProfEntity);

                healthRecordEntity.setDocAadhar(doc_set);

                healthRecordRepository.save(healthRecordEntity);

                return healthRecordEntity;
            }
        }
        throw new RuntimeException("Error while saving health-record!");
    }

    @Override
    public List<HealthRecordEntity> fetchHealthRecord(String aadhar){
        List<HealthRecordEntity> healthRecord = healthRecordRepository.findByMigAadhar(aadhar);
        if(healthRecord != null){
            return healthRecord;
        }
        throw new RuntimeException("Empty Health-Record!");
    }

    @Override
    public HealthRecordEntity updateHealthRecord(HealthRecordEntity healthRecordEntity, Long id){
        HealthRecordEntity healthRecord = healthRecordRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Health Record not found!"));

        if(healthRecord != null){
            healthRecord.setDate(LocalDate.now());
            healthRecord.setSymptoms(healthRecordEntity.getSymptoms());
            healthRecord.setDiagnosis(healthRecordEntity.getDiagnosis());
            healthRecord.setMedicine_pres(healthRecordEntity.getMedicine_pres());
            healthRecord.setDisease(healthRecordEntity.getDisease());
            healthRecord.setAllergis(healthRecord.getAllergis());
            healthRecord.setChronic_cond(healthRecordEntity.getChronic_cond());
            healthRecord.setMigAadhar(healthRecordEntity.getMigAadhar());

            healthRecordRepository.save(healthRecord);
            return healthRecord;
        }
        throw new RuntimeException("Error occurred while updating record!");
    }
}
