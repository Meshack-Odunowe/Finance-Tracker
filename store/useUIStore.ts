import { create } from 'zustand';

interface UIState {
    isSidebarCollapsed: boolean;
    isMobileMenuOpen: boolean;
    toggleSidebar: () => void;
    toggleMobileMenu: () => void;
    closeMobileMenu: () => void;
}

export const useUIStore = create<UIState>((set) => ({
    isSidebarCollapsed: false,
    isMobileMenuOpen: false,
    toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
    toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
    closeMobileMenu: () => set({ isMobileMenuOpen: false }),
}));
