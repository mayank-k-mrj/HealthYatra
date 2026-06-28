package healthyatra.com.healthyatra.Controller;

import healthyatra.com.healthyatra.Model.MigrantProfEntity;
import healthyatra.com.healthyatra.Service.MigrantProfService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/migrant")
public class MigrantController {
    @Autowired
    private MigrantProfService migrantProfService;

    //Registering Migrant workers.
    @PostMapping("/reg-mig")
    public ResponseEntity<String> registerMigrant(@RequestBody MigrantProfEntity migrantProfEntity){
        String aadhar = migrantProfEntity.getAadhar();
        if(migrantProfService.createMigrantProf(migrantProfEntity, aadhar)){
            return ResponseEntity.ok("Migrant registered with Name : "+migrantProfEntity.getFirst_name());
        }
        return ResponseEntity.status(500).body("Error in data format!");
    }

    //Upload migrant photo
    @PostMapping("/upload/{aadhar}")
    public String getPic(@RequestParam MultipartFile file, @PathVariable String aadhar){
        String prof_pic =  migrantProfService.migrantPic(aadhar, file);
        return prof_pic;
    }

    //Updating Migrant workers Data
    @PutMapping("/upd-mig")
    public ResponseEntity<String> updateMigrant(@RequestBody MigrantProfEntity migrantProfEntity){
        String aadhar = migrantProfEntity.getAadhar();
        if(migrantProfService.updateMigrantProf(migrantProfEntity, aadhar)){
            return ResponseEntity.ok("Migrant updated with Name : "+migrantProfEntity.getFirst_name());
        }
        return ResponseEntity.status(500).body("Error in data format!");
    }

    //Fetching user with aadhar
    @GetMapping("/mig/{aadhar}")
    public MigrantProfEntity fetchMigrant(@PathVariable String aadhar){
        return migrantProfService.fetchMigrant(aadhar);
    }

}
