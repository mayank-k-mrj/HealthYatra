package healthyatra.com.healthyatra.Service;

import healthyatra.com.healthyatra.Model.EmailVerify.EmailVerification;
import healthyatra.com.healthyatra.Model.RegisterEntity;
import healthyatra.com.healthyatra.Repository.EmailVerificationRepository;
import healthyatra.com.healthyatra.Repository.RegisterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class RegisterImpService implements RegisterService{

    @Autowired
    private RegisterRepository registerRepository;

    @Autowired
    private EmailVerificationRepository emailVerificationRepository;

    @Override
    public RegisterEntity registerNew(RegisterEntity registerEntity){
        EmailVerification verification = emailVerificationRepository.findByEmail(registerEntity.getName());

        //Check ho raha hai ki kahi verification khali to nahi hai
        if(verification == null){
            throw new RuntimeException("Please verify email first");
        }

        //Kahi otp expired to nahi hai
        if(LocalDateTime.now().isAfter(verification.getExpiryTime())){
            throw new RuntimeException("Verification expired, please verify again");
        }

        //User already exist to nahi karta
        if(registerRepository.findByName(registerEntity.getName()).isPresent()){
            throw new RuntimeException("User already exists");
        }

        registerEntity.setIsverified(true);

        RegisterEntity saveUser = registerRepository.save(registerEntity);

        //Delete entire row after verification
        emailVerificationRepository.delete(verification);

        return saveUser;
    }
}
