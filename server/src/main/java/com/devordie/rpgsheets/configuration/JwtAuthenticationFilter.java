package com.devordie.rpgsheets.configuration;

import java.io.IOException;
import java.security.Principal;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.devordie.rpgsheets.services.JwtService;

import jakarta.annotation.Priority;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.container.ContainerRequestFilter;
import jakarta.ws.rs.container.PreMatching;
import jakarta.ws.rs.core.SecurityContext;
import jakarta.ws.rs.ext.Provider;

@Provider
@ApplicationScoped
@PreMatching
@Priority(1)
public class JwtAuthenticationFilter implements ContainerRequestFilter {

  private static final Log LOGGER = LogFactory.getLog(JwtAuthenticationFilter.class);

  @Inject
  private JwtService jwtService;

  @Override
  public void filter(ContainerRequestContext requestContext) throws IOException {

    final String bearerToken = requestContext.getHeaderString("Authorization");
    if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
      final String token = bearerToken.substring(7);
      try {
      final String username = jwtService.extractUsername(token);
      requestContext.setSecurityContext(new SecurityContext() {
        @Override
        public Principal getUserPrincipal() {
          return new Principal() {
            @Override
            public String getName() {
              return username;
            }
          };
        }

        @Override
        public String getAuthenticationScheme() {
          return "basic";
        }

        @Override
        public boolean isSecure() {
          return false;
        }

        @Override
        public boolean isUserInRole(String role) {
          return false;
        }
      });
    } catch (Exception ex) {
      LOGGER.warn("Failed to decrypt JWT token");
    }
  }
  }
}
