package com.server.common.converter;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.util.Base64;
import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import lombok.extern.slf4j.Slf4j;

/**
 * TBAccount.accountNum 필드에 적용되는 AES-256-CBC 양방향 암호화 Converter.
 * 암호문 형식: Base64(IV[16 bytes] + Ciphertext)
 *
 * 암호화 키는 EncryptionConfig 가 애플리케이션 기동 시 {@link #setKey(String)} 로 주입한다.
 */
@Slf4j
@Converter
public class AccountNumConverter implements AttributeConverter<String, String> {

    private static final String ALGORITHM = "AES/CBC/PKCS5Padding";
    private static final int IV_LENGTH = 16;

    /** Spring 기동 시 EncryptionConfig 에 의해 주입되는 정적 키 */
    private static byte[] AES_KEY;

    public static void setKey(String base64Key) {
        AES_KEY = Base64.getDecoder().decode(base64Key);
        if (AES_KEY.length != 32) {
            throw new IllegalArgumentException("AES-256 키는 반드시 32바이트(Base64 인코딩된 44자)여야 합니다.");
        }
    }

    // ── DB 저장 시: 평문 → 암호문 ──────────────────────────────────────────────

    @Override
    public String convertToDatabaseColumn(String plainText) {
        if (plainText == null) {
            return null;
        }
        try {
            byte[] iv = generateIv();
            byte[] encrypted = encrypt(plainText.getBytes(StandardCharsets.UTF_8), iv);
            byte[] combined = combine(iv, encrypted);
            return Base64.getEncoder().encodeToString(combined);
        } catch (Exception e) {
            log.error("[AccountNumConverter] 암호화 실패", e);
            throw new RuntimeException("계좌번호 암호화 중 오류가 발생했습니다.", e);
        }
    }

    // ── DB 조회 시: 암호문 → 평문 ──────────────────────────────────────────────

    @Override
    public String convertToEntityAttribute(String cipherText) {
        if (cipherText == null) {
            return null;
        }
        try {
            byte[] combined = Base64.getDecoder().decode(cipherText);
            byte[] iv        = extractIv(combined);
            byte[] encrypted = extractCipher(combined);
            byte[] decrypted = decrypt(encrypted, iv);
            return new String(decrypted, StandardCharsets.UTF_8);
        } catch (Exception e) {
            log.error("[AccountNumConverter] 복호화 실패 — 저장된 값이 올바른 암호문이 아닐 수 있습니다.", e);
            // 복호화 실패 시 원본 반환 (마이그레이션 전 평문 데이터 호환)
            return cipherText;
        }
    }

    // ── 내부 암/복호화 헬퍼 ────────────────────────────────────────────────────

    private byte[] encrypt(byte[] data, byte[] iv) throws Exception {
        Cipher cipher = Cipher.getInstance(ALGORITHM);
        cipher.init(Cipher.ENCRYPT_MODE, keySpec(), new IvParameterSpec(iv));
        return cipher.doFinal(data);
    }

    private byte[] decrypt(byte[] data, byte[] iv) throws Exception {
        Cipher cipher = Cipher.getInstance(ALGORITHM);
        cipher.init(Cipher.DECRYPT_MODE, keySpec(), new IvParameterSpec(iv));
        return cipher.doFinal(data);
    }

    private SecretKeySpec keySpec() {
        return new SecretKeySpec(AES_KEY, "AES");
    }

    private byte[] generateIv() {
        byte[] iv = new byte[IV_LENGTH];
        new SecureRandom().nextBytes(iv);
        return iv;
    }

    private byte[] combine(byte[] iv, byte[] encrypted) {
        byte[] result = new byte[IV_LENGTH + encrypted.length];
        System.arraycopy(iv,        0, result, 0,         IV_LENGTH);
        System.arraycopy(encrypted, 0, result, IV_LENGTH, encrypted.length);
        return result;
    }

    private byte[] extractIv(byte[] combined) {
        byte[] iv = new byte[IV_LENGTH];
        System.arraycopy(combined, 0, iv, 0, IV_LENGTH);
        return iv;
    }

    private byte[] extractCipher(byte[] combined) {
        byte[] cipher = new byte[combined.length - IV_LENGTH];
        System.arraycopy(combined, IV_LENGTH, cipher, 0, cipher.length);
        return cipher;
    }
}