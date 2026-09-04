package healthyatra.com.healthyatra.Service;

import healthyatra.com.healthyatra.DTO.RegistrationDTO;
import healthyatra.com.healthyatra.Model.RegisterEntity;

public interface RegisterService {
    //For registering new user.
    RegisterEntity registerNew(RegisterEntity registerEntity);
    RegistrationDTO fetchRegistered(String aadhar);
}
