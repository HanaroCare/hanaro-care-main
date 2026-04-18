export const validatePhone = (phone: string): boolean => {
  return /^010\d{8}$/.test(phone);
};

export const validatePassword = (password: string): boolean => {
  return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,16}$/.test(password);
};

export const validatePasswordMatch = (password: string, confirmPassword: string): boolean => {
  const trimmedPw = password.trim();
  const trimmedConfirm = confirmPassword.trim();
  return trimmedPw !== "" && trimmedPw === trimmedConfirm;
};

export const validateUsername = (username: string): boolean => {
  return /^[a-z][a-z0-9]{3,11}$/.test(username);
};

export const validateName = (name: string): boolean => {
  const trimmed = name.trim();
  return trimmed.length >= 2 && trimmed.length <= 20;
};
