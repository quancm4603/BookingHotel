import { create } from "zustand";
import { auth } from "@/firebaseConfig";
import { signOut, User } from "firebase/auth";

// Định nghĩa interface cho trạng thái của AuthStore
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  // Hàm để lưu thông tin người dùng sau khi đăng nhập thành công
  setUser: (user: User | null) =>
    set({ user, isAuthenticated: !!user }),

  // Hàm để xóa thông tin người dùng khi đăng xuất
  logout: async () => {
    await signOut(auth);
    set({ user: null, isAuthenticated: false });
  },
}));

export default useAuthStore;
