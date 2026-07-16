package healthyatra.com.healthyatra.Service;

import com.sendgrid.Request;
import com.sendgrid.SendGrid;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import healthyatra.com.healthyatra.Model.EmailVerify.EmailVerification;
import healthyatra.com.healthyatra.Model.EmailVerify.OTPVerification;
import healthyatra.com.healthyatra.Repository.EmailVerificationRepository;
import healthyatra.com.healthyatra.Repository.OTPVerificationRepository;
import org.apache.tomcat.util.http.Method;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class MailSendingService {

    @Value("${sendgrid.api-key}")
    private String apiKey;

    @Value("${sendgrid.from-email}")
    private String fromMail;

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
        try {
            // Ek hi line me Mail object create karna
            Mail mail = new Mail(new Email(fromMail), "Email Verification OTP", new Email(email), new Content("text/plain", "Your OTP is: " + otp + "\nValid for 5 minutes."));

            // Request setup aur API call
            Request request = new Request();
            request.setMethod(com.sendgrid.Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());

            // Direct status code check karke true/false return karna
            return new SendGrid(apiKey).api(request).getStatusCode() < 300;

        } catch (Exception ex) {
            return false;
        }
    }

    @Autowired
    private EmailVerificationRepository emailVerificationRepository;

    //Data ko Verified table me save karega
    public Boolean EmailVerification(String email, String userOTP){
        try{
            if (emailVerificationRepository.existsByEmail(email)) {
                return true;
            }
            else {
                EmailVerification emailVerification = new EmailVerification();

                OTPVerification otpVerification = otpVerificationRepository.findByEmail(email);
                String otp = otpVerification.getOtp();
                //Check karega ki OTP expire nahi naa ho gaya hai aur same hai yaa nahi.
                if (userOTP.equals(otp) && LocalDateTime.now().isBefore(otpVerification.getExpiryTime())) {
                    emailVerification.setEmail(email);
                    emailVerification.setExpiryTime(LocalDateTime.now().plusMinutes(15));

                    //Database me save kar dega
                    emailVerificationRepository.save(emailVerification);

                    return true;
                }
            }
        }
        catch (Exception e){
            System.out.println("Error occurred while otp verification : "+e.getMessage());
        }
        return false;
    }
}
