package healthyatra.com.healthyatra.Controller;

import healthyatra.com.healthyatra.Service.MailSendingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthCheck {

    @GetMapping("/healthcheck")
    public String Healthcheck(){
        return "I am working fine!";
    }
}
