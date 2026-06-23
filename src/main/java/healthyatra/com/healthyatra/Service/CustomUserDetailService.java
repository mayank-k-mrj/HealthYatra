package healthyatra.com.healthyatra.Service;

import healthyatra.com.healthyatra.Model.RegisterEntity;
import healthyatra.com.healthyatra.Repository.RegisterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailService implements UserDetailsService {

    @Autowired
    private RegisterRepository registerRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        RegisterEntity register = registerRepository.findByName(email)
                .orElseThrow(() -> new UsernameNotFoundException("User doesn't exists."));

        return User.withUsername(register.getName())
                .password(register.getPassword())
                .roles(register.getRoles())
                .build();
    }
}
