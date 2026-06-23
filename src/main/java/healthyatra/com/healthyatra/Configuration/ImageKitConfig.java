package healthyatra.com.healthyatra.Configuration;

import io.imagekit.client.ImageKitClient;
import io.imagekit.client.okhttp.ImageKitOkHttpClient;
import jakarta.annotation.PostConstruct;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ImageKitConfig {
    @Bean
    public ImageKitClient imageKitClient(){
        return ImageKitOkHttpClient.fromEnv();
    }

}
