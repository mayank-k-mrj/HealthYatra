package healthyatra.com.healthyatra.Controller;

import healthyatra.com.healthyatra.Configuration.PasswordConfig;
import healthyatra.com.healthyatra.DTO.EmailRequest;
import healthyatra.com.healthyatra.DTO.VerificationData;
import healthyatra.com.healthyatra.Model.RegisterEntity;
import healthyatra.com.healthyatra.Repository.RegisterRepository;
import healthyatra.com.healthyatra.Service.MailSendingService;
import healthyatra.com.healthyatra.Service.RegisterService;
import healthyatra.com.healthyatra.Service.JwtService; // <-- JWT Service Import karo

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager; // <-- Import for Auth
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken; // <-- Import
import org.springframework.security.core.userdetails.UserDetails; // <-- Import
import org.springframework.security.core.userdetails.UserDetailsService; // <-- Import
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/authorize")
public class RegisterController {

    @Autowired
    private RegisterService registerService;

    @Autowired
    private RegisterRepository registerRepository;

    @Autowired
    private PasswordConfig passwordConfig;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private MailSendingService mailSendingService;


    @PostMapping("/login")
    public ResponseEntity<?> loginAndGetToken(@RequestBody RegisterEntity loginRequest) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()
                    )
            );
        } catch (Exception e) {
            return ResponseEntity.status(403).body("Invalid Username or Password!");
        }


        final UserDetails userDetails = userDetailsService.loadUserByUsername(loginRequest.getUsername());


        final String jwtToken = jwtService.generateToken(userDetails);


        Map<String, String> tokenResponse = new HashMap<>();
        tokenResponse.put("token", jwtToken);
        tokenResponse.put("username", userDetails.getUsername());

        return ResponseEntity.ok(tokenResponse);
    }


    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterEntity registerEntity){

        RegisterEntity registerEntity1 = new RegisterEntity();

        String password = registerEntity.getPassword();
        registerEntity1.setName(registerEntity.getName());
        registerEntity1.setAadhar(registerEntity.getAadhar());
        registerEntity1.setPhone(registerEntity.getPhone());
        registerEntity1.setUsername(registerEntity.getUsername());
        registerEntity1.setRole((registerEntity.getRole()));
        registerEntity1.setPassword(passwordConfig.passwordEncoder().encode(password));

        registerService.registerNew(registerEntity1);
        return ResponseEntity.ok("User registered with username : "+registerEntity.getUsername()+" with email : "+ registerEntity.getName()+" and phone : "+registerEntity.getPhone());
    }

    // System otp bhejega email verify karne ke liye
    @PostMapping("/verifyemail")
    public ResponseEntity<String> sendOTP(@RequestBody EmailRequest emailReq){
        String email = emailReq.getEmail();
        boolean sent = mailSendingService.SendOtpToEmail(email);
        if(sent){
            return ResponseEntity.ok("OTP sent on email : "+email);
        }
        return ResponseEntity.status(500).body("Error occurred Please check your email.");
    }

    // User otp bhejega verification ke liye
    @PostMapping("/verify")
    public ResponseEntity<String> OtpVerification(@RequestBody VerificationData verificationData){
        boolean verified = mailSendingService.EmailVerification(verificationData.getEmail(), verificationData.getOtp());
        if(verified){
            return ResponseEntity.ok("Verification Successful!");
        }
        return ResponseEntity.status(500).body("Verification failed!");
    }

    @GetMapping("/loggedIn")
    public String getLoggedIn(Principal principal){
        String email = principal.getName();
        RegisterEntity register = registerRepository.findByName(email)
                .orElseThrow(() -> new RuntimeException("data not found with emial :"+email));

        if(register != null){
            String aadhar = register.getAadhar();

            return aadhar;
        }
        return "Aadhar not found with email "+email;
    }
}