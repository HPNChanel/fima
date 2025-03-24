package org.example.finance_management_system.security.jwt;

import java.security.SecureRandom;
import java.util.Base64;

public class JWTSecretGenerator {
    public static void main(String[] args) {
        System.out.println("Generated Secret Key: " + generateSecretKey(64));
    }

    public static String generateSecretKey(int length) {
        SecureRandom secureRandom = new SecureRandom();
        byte[] key = new byte[length];
        secureRandom.nextBytes(key);
        return Base64.getEncoder().encodeToString(key);
    }
}
