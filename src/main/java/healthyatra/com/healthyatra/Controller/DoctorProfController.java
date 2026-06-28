package healthyatra.com.healthyatra.Controller;

import healthyatra.com.healthyatra.Model.DoctorProfEntity;
import healthyatra.com.healthyatra.Service.DoctorProfService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/doctor")
public class DoctorProfController {

    @Autowired
    private DoctorProfService doctorProfService;

    @PostMapping("/reg-doc")
    public ResponseEntity<String> registerDoctor(@RequestBody DoctorProfEntity doctorProf){
        String aadhar = doctorProf.getAadhar();
        if(doctorProfService.createDoctorProf(doctorProf, aadhar)){
            return ResponseEntity.ok("Doctor registered with name : "+doctorProf.getFirst_name());
        }
        return ResponseEntity.status(500).body("Error in data format!");
    }

    @PutMapping("/upd-doc")
    public ResponseEntity<String> updateDoctor(@RequestBody DoctorProfEntity doctorProfEntity){
        String aadhar = doctorProfEntity.getAadhar();
        if(doctorProfService.updateDoctorProf(doctorProfEntity, aadhar)){
            return ResponseEntity.ok("Doctor updated with Name : "+doctorProfEntity.getFirst_name());
        }
        return ResponseEntity.status(500).body("Error in data format!");
    }

    //Fetching doctor with aadhar
    @GetMapping("/doc/{aadhar}")
    public DoctorProfEntity fetchDoctor(@PathVariable String aadhar){
        return doctorProfService.fetchDoctor(aadhar);
    }
}
