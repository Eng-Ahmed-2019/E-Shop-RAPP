import { jwtDecode } from "jwt-decode";

export const getCurrentUser = () => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) return null;

    const decoded = jwtDecode(token);
    console.log("Decoded token:", decoded);
    return decoded;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

export const isAdmin = () => {
  const user = getCurrentUser();

  const roleClaim = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";

  return user && user[roleClaim] === "Admin";
};