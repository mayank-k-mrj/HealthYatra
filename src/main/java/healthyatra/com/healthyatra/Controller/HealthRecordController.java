package healthyatra.com.healthyatra.Controller;

import healthyatra.com.healthyatra.Model.HealthRecordEntity;
import healthyatra.com.healthyatra.Model.RegisterEntity;
import healthyatra.com.healthyatra.Repository.DoctorProfRepository;
import healthyatra.com.healthyatra.Repository.HealthRecordRepository;
import healthyatra.com.healthyatra.Repository.RegisterRepository;
import healthyatra.com.healthyatra.Service.DoctorProfService;
import healthyatra.com.healthyatra.Service.HealthRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/record")
public class HealthRecordController {

    @Autowired
    private HealthRecordService healthRecordService;

    @Autowired
    private RegisterRepository registerRepository;

    @PostMapping("/health-record")
    public ResponseEntity<String> CreateHealthReocrd(@RequestBody HealthRecordEntity healthRecordEntity, Principal principal){
        String email = principal.getName();
        RegisterEntity registerEntity = registerRepository.findByName(email)
                .orElseThrow(() -> new RuntimeException("Doctor not found with email : "+email+ " error note : health-record doctor not found!"));

        String aadhar = registerEntity.getAadhar();

        HealthRecordEntity healthRecordEntity1 = healthRecordService.CreateHealthRecord(healthRecordEntity, aadhar);
        if(healthRecordEntity1 != null){
            return ResponseEntity.ok("Record saved with patient aadhar : "+healthRecordEntity.getMigAadhar()+ " and doctor aadhar : "+aadhar);
        }
        return ResponseEntity.status(500).body("Error occurred while saving data!");
    }

    @GetMapping("/fetch-health/{aadhar}")
    public List<HealthRecordEntity> fetchHealthRecord(@PathVariable String aadhar){
        return healthRecordService.fetchHealthRecord(aadhar);
    }

    @PutMapping("/set-record/{id}")
    public HealthRecordEntity updateHealthRecord(@PathVariable Long id, @RequestBody HealthRecordEntity healthRecord){
        HealthRecordEntity healthRecordEntity =  healthRecordService.updateHealthRecord(healthRecord, id);
        if(healthRecordEntity != null){
            return healthRecordEntity;
        }
        throw new RuntimeException("Something went wrong while updating record!");
    }
}
