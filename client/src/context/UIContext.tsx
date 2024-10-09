import React, {
  createContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from 'react';

interface UIContextProps {
  isLoginOverlayOpen: boolean;
  activeTab: string;
  setActiveTab: (tab: 'login' | 'signup') => void;
  showLoginOverlay: () => void;
  hideLoginOverlay: () => void;
}

export const UIContext = createContext<UIContextProps>({
  isLoginOverlayOpen: false,
  activeTab: 'signup',
  setActiveTab: () => {},
  showLoginOverlay: () => {},
  hideLoginOverlay: () => {},
});

interface UIProviderProps {
  children: ReactNode;
}

export const UIProvider: React.FC<UIProviderProps> = ({ children }) => {
  const [isLoginOverlayOpen, setIsLoginOverlayOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');

  const showLoginOverlay = useCallback(() => {
    setIsLoginOverlayOpen(true);
  }, []);

  const hideLoginOverlay = useCallback(() => {
    setIsLoginOverlayOpen(false);
  }, []);

  useEffect(() => {
    if (isLoginOverlayOpen) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }

    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, [isLoginOverlayOpen]);

  return (
    <UIContext.Provider
      value={{
        isLoginOverlayOpen,
        activeTab,
        showLoginOverlay,
        hideLoginOverlay,
        setActiveTab,
      }}
    >
      {children}
    </UIContext.Provider>
  );
};
