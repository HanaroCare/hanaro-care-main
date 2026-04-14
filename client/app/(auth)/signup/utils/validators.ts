/**
 * validatePhone: '010'으로 시작하며 하이픈 없이 숫자만 정확히 11자리인지 체크
 */
export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^010\d{8}$/;
  return phoneRegex.test(phone);
};

/**
 * validatePassword: 영문자가 최소 1개 포함되어야 하며, 전체 길이는 6자 이상 8자 이하인지 체크
 */
export const validatePassword = (password: string): boolean => {
  const passwordRegex = /^(?=.*[A-Za-z]).{6,8}$/;
  return passwordRegex.test(password);
};

/**
 * validatePasswordMatch: 두 비밀번호 문자열이 일치하고, 비어있지 않은지 체크
 */
export const validatePasswordMatch = (password: string, confirmPassword: string): boolean => {
  return password !== "" && password === confirmPassword;
};
