package healthyatra.com.healthyatra.Service;

import healthyatra.com.healthyatra.Model.EmailVerify.EmailVerification;
import healthyatra.com.healthyatra.Model.EmailVerify.OTPVerification;
import healthyatra.com.healthyatra.Repository.EmailVerificationRepository;
import healthyatra.com.healthyatra.Repository.OTPVerificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class MailSendingService {

    @Autowired
    private JavaMailSender javaMailSender;

    @Value("${spring.mail.username}")
    private String fromMail;

    SimpleMailMessage mail = new SimpleMailMessage();

    //Testing Sending Mail Feature
    public void sendMail(){
        try{

            mail.setFrom(fromMail);
            mail.setTo("ay892887@gmail.com");
            mail.setSubject("Testing for mail sending (SMTP)");
            mail.setText("Kaisa hai re bhai tu. Bhool gaya hai kya bhai");
            javaMailSender.send(mail);
        }
        catch (Exception e){
            System.out.println("Error occured while sending mail : "+e.getMessage());
        }
    }

    @Autowired
    private OTPVerificationRepository otpVerificationRepository;

    //Sending OTP on Email
    public Boolean SendOtpToEmail(String email){

        //Generating new otp.
        String otp = String.valueOf((int)(Math.random() * 900000) + 100000);

        OTPVerification existing = otpVerificationRepository.findByEmail(email);

        if(existing != null){
            existing.setOtp(otp);
            existing.setEmail(email);
            existing.setExpiryTime(LocalDateTime.now().plusMinutes(5));

            otpVerificationRepository.save(existing);
        }
        else{
            OTPVerification newOtp = new OTPVerification();
            newOtp.setOtp(otp);
            newOtp.setEmail(email.toLowerCase());
            newOtp.setExpiryTime(LocalDateTime.now().plusMinutes(5));

            otpVerificationRepository.save(newOtp);
        }

        sendOTP(email, otp);
        return true;
    }

    //Method Jo OTP send karega
    public Boolean sendOTP(String email, String otp){
        mail.setFrom(fromMail);
        mail.setTo(email);
        mail.setSubject("Email Verification OTP");
        mail.setText("Your OTP is: " + otp + "\nValid for 5 minutes.");

        javaMailSender.send(mail);
        return true;
    }

    @Autowired
    private EmailVerificationRepository emailVerificationRepository;

    //Data ko Verified table me save karega
    public Boolean EmailVerification(String email, String userOTP){
        try{
            EmailVerification emailVerification = new EmailVerification();

            OTPVerification otpVerification = otpVerificationRepository.findByEmail(email);
            String otp = otpVerification.getOtp();
            //Check karega ki OTP expire nahi naa ho gaya hai aur same hai yaa nahi.
            if(userOTP.equals(otp) && LocalDateTime.now().isBefore(otpVerification.getExpiryTime())){
                emailVerification.setEmail(email);
                emailVerification.setExpiryTime(LocalDateTime.now().plusMinutes(15));

                //Database me save kar dega
                emailVerificationRepository.save(emailVerification);

                return true;
            }
        }
        catch (Exception e){
            System.out.println("Error occurred while otp verification : "+e.getMessage());
        }
        return false;
    }
}
