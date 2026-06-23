package healthyatra.com.healthyatra.Service;

import healthyatra.com.healthyatra.Model.DoctorProfEntity;
import healthyatra.com.healthyatra.Repository.DoctorProfRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DoctorProfImpService implements DoctorProfService{

    @Autowired
    private DoctorProfRepository doctorProfRepository;

    @Override
    public Boolean createDoctorProf(DoctorProfEntity doctorProfEntity, String aadhar) {
        DoctorProfEntity doctorProf = doctorProfRepository.findByAadhar(aadhar);

        if(doctorProf == null){
            doctorProfRepository.save(doctorProfEntity);
            return true;
        }
        return false;
    }

    @Override
    public Boolean updateDoctorProf(DoctorProfEntity doctorProfEntity, String aadhar){
        DoctorProfEntity doctorProf = doctorProfRepository.findByAadhar(aadhar);

        if(doctorProf!= null){

            doctorProf.setFirst_name(doctorProfEntity.getFirst_name());
            doctorProf.setMiddle_name(doctorProfEntity.getMiddle_name());
            doctorProf.setLast_name(doctorProfEntity.getLast_name());
            doctorProf.setMedical_regi(doctorProfEntity.getMedical_regi());
            doctorProf.setQualification(doctorProfEntity.getQualification());
            doctorProf.setSpecilization((doctorProfEntity.getSpecilization()));
            doctorProf.setExp(doctorProfEntity.getExp());
            doctorProf.setLicense_no(doctorProfEntity.getLicense_no());
            doctorProf.setLicense_validity(doctorProfEntity.getLicense_validity());
            doctorProf.setHospital_name(doctorProfEntity.getHospital_name());
            doctorProf.setWorking_loc(doctorProfEntity.getWorking_loc());

            try{
                doctorProfRepository.save(doctorProf);
            }
            catch (Exception e){
                System.out.println("Error occurred while updating doctor details! : "+e.getMessage());
            }
            return true;
        }
        return false;
    }

    @Override
    public DoctorProfEntity fetchDoctor(String aadhar){
        DoctorProfEntity doctorProf = doctorProfRepository.findByAadhar(aadhar);

        if(doctorProf != null){
            return doctorProf;
        }

        throw new RuntimeException("Doctor with aadar : "+aadhar+" not exists!");
    }
}
