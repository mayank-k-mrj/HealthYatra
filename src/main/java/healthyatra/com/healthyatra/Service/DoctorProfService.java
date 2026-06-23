package healthyatra.com.healthyatra.Service;

import healthyatra.com.healthyatra.Model.DoctorProfEntity;

public interface DoctorProfService {
    Boolean createDoctorProf(DoctorProfEntity doctorProfEntity, String aadhar);
    Boolean updateDoctorProf(DoctorProfEntity doctorProfEntity, String aadhar);
    DoctorProfEntity fetchDoctor(String aadhar);
}
