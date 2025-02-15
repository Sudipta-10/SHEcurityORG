export const AUTH_CONFIG = {
  tokenExpiry: "24h",
  minPasswordLength: 8,
  maxLoginAttempts: 3,
  lockoutDuration: 15, // minutes
  passwordRegex:
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
};

class AuthService {
  constructor() {
    this.users = JSON.parse(localStorage.getItem("users")) || [];
    this.loginAttempts = {};
  }

  register(email, password, username) {
    if (this.users.find((user) => user.email === email)) {
      throw new Error("Email already registered");
    }

    if (!AUTH_CONFIG.passwordRegex.test(password)) {
      throw new Error(
        "Password must contain at least 8 characters, one letter, one number and one special character"
      );
    }

    const hashedPassword = this.hashPassword(password);
    const user = {
      id: Date.now(),
      email,
      password: hashedPassword,
      username,
      createdAt: new Date().toISOString(),
    };

    this.users.push(user);
    this.saveUsers();
    return this.generateToken(user);
  }

  login(email, password) {
    const user = this.users.find((u) => u.email === email);

    if (!user) {
      throw new Error("Invalid email or password");
    }

    if (this.isAccountLocked(email)) {
      throw new Error("Account temporarily locked. Please try again later.");
    }

    if (!this.verifyPassword(password, user.password)) {
      this.handleFailedLogin(email);
      throw new Error("Invalid email or password");
    }

    this.resetLoginAttempts(email);
    return this.generateToken(user);
  }

  hashPassword(password) {
    // In a real application, use a proper hashing library like bcrypt
    return btoa(password);
  }

  verifyPassword(password, hashedPassword) {
    return btoa(password) === hashedPassword;
  }

  generateToken(user) {
    // In a real application, use JWT or similar
    return btoa(
      JSON.stringify({
        userId: user.id,
        email: user.email,
        exp: Date.now() + 24 * 60 * 60 * 1000,
      })
    );
  }

  handleFailedLogin(email) {
    if (!this.loginAttempts[email]) {
      this.loginAttempts[email] = {
        count: 0,
        lastAttempt: Date.now(),
      };
    }

    this.loginAttempts[email].count++;
    this.loginAttempts[email].lastAttempt = Date.now();
  }

  isAccountLocked(email) {
    const attempts = this.loginAttempts[email];
    if (!attempts) return false;

    if (attempts.count >= AUTH_CONFIG.maxLoginAttempts) {
      const lockoutEnd =
        attempts.lastAttempt + AUTH_CONFIG.lockoutDuration * 60 * 1000;
      if (Date.now() < lockoutEnd) {
        return true;
      }
      this.resetLoginAttempts(email);
    }
    return false;
  }

  resetLoginAttempts(email) {
    delete this.loginAttempts[email];
  }

  saveUsers() {
    localStorage.setItem("users", JSON.stringify(this.users));
  }
}

const authService = new AuthService();
export default authService;
