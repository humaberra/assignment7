// Simulated server call. This is NOT real authentication.
export const DEMO_USERNAME = "230408056@st.biruni.edu.tr"; // student email
export const DEMO_PASSWORD = "demo123456";

export function login(username, password) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (username.trim() === DEMO_USERNAME && password === DEMO_PASSWORD) {
        resolve({ username: username.trim() });
      } else {
        reject(new Error("Invalid credentials"));
      }
    }, 500);
  });
}