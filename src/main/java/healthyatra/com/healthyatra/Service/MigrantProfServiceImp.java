package healthyatra.com.healthyatra.Service;

import healthyatra.com.healthyatra.Configuration.ImageKitConfig;
import healthyatra.com.healthyatra.Model.MigrantProfEntity;
import healthyatra.com.healthyatra.Model.PicEntity.ProfPicEntity;
import healthyatra.com.healthyatra.Repository.MigrantProfRepository;
import healthyatra.com.healthyatra.Repository.ProfPicRepository;
import io.imagekit.models.files.FileUploadParams;
import io.imagekit.models.files.FileUploadResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class MigrantProfServiceImp implements MigrantProfService{

    @Autowired
    private MigrantProfRepository migrantProfRepository;

    @Autowired
    private ProfPicRepository profPicRepository;

    @Override
    public Boolean createMigrantProf(MigrantProfEntity migrantProfEntity, String aadhar){
        MigrantProfEntity migrantProf = migrantProfRepository.findByAadhar(aadhar);
        if(migrantProf == null){
            migrantProfRepository.save(migrantProfEntity);
            return true;
        }
        return false;
    }

    @Override
    public Boolean updateMigrantProf(MigrantProfEntity migrantProfEntity, String aadhar){
        MigrantProfEntity migrantProf = migrantProfRepository.findByAadhar(aadhar);
        if(migrantProf != null){

            migrantProf.setFirst_name(migrantProfEntity.getFirst_name());
            migrantProf.setMiddle_name(migrantProfEntity.getMiddle_name());
            migrantProf.setLast_name(migrantProfEntity.getLast_name());
            migrantProf.setAge(migrantProfEntity.getAge());
            migrantProf.setGender(migrantProfEntity.getGender());
            migrantProf.setBlood_g(migrantProfEntity.getBlood_g());
            migrantProf.setAdd_curr(migrantProfEntity.getAdd_curr());
            migrantProf.setAdd_native(migrantProfEntity.getAdd_native());
            migrantProf.setEmergency_c(migrantProfEntity.getEmergency_c());
            migrantProf.setOccupation(migrantProfEntity.getOccupation());

            try {
                migrantProfRepository.save(migrantProf);
            } catch (Exception e) {
                System.out.println("Error occurred while updating migrant details! : "+e.getMessage());
            }
            return true;
        }
        return false;
    }

    @Override
    public MigrantProfEntity fetchMigrant(String aadhar){
        MigrantProfEntity migrantProf = migrantProfRepository.findByAadhar(aadhar);

        if(migrantProf != null){
            return migrantProf;
        }

        throw  new RuntimeException("Migrant with aadar : "+aadhar+" not exists!");
    }

    @Autowired
    private ImageKitConfig imageKitConfig;

    @Override
    public String migrantPic(String aadhar,MultipartFile file){
        ProfPicEntity profPicEntity = profPicRepository.findByAadhar(aadhar);
        String picUrl = "";

        try {
            FileUploadParams params = FileUploadParams.builder()
                    .file(file.getInputStream())
                    .fileName(file.getOriginalFilename())
                    .build();

            FileUploadResponse response = imageKitConfig.imageKitClient()
                    .files()
                    .upload(params);

            picUrl = String.valueOf(response.url());
        }
        catch (Exception e){
            throw new RuntimeException("Image upload failed", e);
        }

        if(profPicEntity == null){

            ProfPicEntity profPicEntity1 = new ProfPicEntity();

            profPicEntity1.setAadhar(aadhar);
            profPicEntity1.setPic(picUrl);

            profPicRepository.save(profPicEntity1);
        }
        else{
            profPicEntity.setPic(picUrl);
            profPicRepository.save(profPicEntity);
        }
        return picUrl;
    }
}
