export const validatePhone = (phone: string): boolean => {
  return /^010\d{8}$/.test(phone);
};

export const validatePassword = (password: string): boolean => {
  return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,16}$/.test(password);
};

export const validatePasswordMatch = (password: string, confirmPassword: string): boolean => {
  return password !== "" && password === confirmPassword;
};

export const validateUsername = (username: string): boolean => {
  return /^[a-z][a-z0-9]{3,11}$/.test(username);
};
