import React, {
  createContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
  useLayoutEffect,
} from 'react';
import { useLocation } from 'react-router';

interface UIContextProps {
  isLoginOverlayOpen: boolean;
  showLoginOverlay: () => void;
  hideLoginOverlay: () => void;
  isCartOverlayOpen: boolean;
  toggleCartOverlay: () => void;
  hideCartOverlay: () => void;
  isProfileOverlayOpen: boolean;
  toggleProfileOverlay: () => void;
  hideProfileOverlay: () => void;
  activeTab: 'login'
    | 'signup'
    | 'forgotPassword'
    | 'verifyOtp'
    | 'forgot-verify'
    | 'new-password';
  setActiveTab: (activeTab: 'login'
    | 'signup'
    | 'forgotPassword'
    | 'verifyOtp'
    | 'forgot-verify'
    | 'new-password') => void;
}

export const UIContext = createContext<UIContextProps>({
  isLoginOverlayOpen: false,
  showLoginOverlay: () => {
  },
  hideLoginOverlay: () => {
  },
  isCartOverlayOpen: false,
  toggleCartOverlay: () => {
  },
  hideCartOverlay: () => {
  },
  isProfileOverlayOpen: false,
  toggleProfileOverlay: () => {
  },
  hideProfileOverlay: () => {
  },
  activeTab: 'login',
  setActiveTab: () => 'login',
});

interface UIProviderProps {
  children: ReactNode;
}

export const UIProvider: React.FC<UIProviderProps> = ({ children }) => {
  const [isLoginOverlayOpen, setIsLoginOverlayOpen] = useState<boolean>(false);
  const [isCartOverlayOpen, setIsCartOverlayOpen] = useState<boolean>(false);
  const [isProfileOverlayOpen, setIsProfileOverlayOpen] =
    useState<boolean>(false);

  const [activeTab, setActiveTab] = useState<
    | 'login'
    | 'signup'
    | 'forgotPassword'
    | 'verifyOtp'
    | 'forgot-verify'
    | 'new-password'
  >('login');

  const location = useLocation();

  const showLoginOverlay = useCallback(() => {
    hideAllOverlays();
    setIsLoginOverlayOpen(true);
  }, []);

  const hideLoginOverlay = useCallback(() => {
    setIsLoginOverlayOpen(false);
  }, []);

  const toggleCartOverlay = useCallback(() => {
    hideAllOverlays();
    if (location.pathname !== '/cart') {
      setIsCartOverlayOpen(!isCartOverlayOpen);
    }
  }, [isCartOverlayOpen, location]);

  const hideCartOverlay = useCallback(() => {
    setIsCartOverlayOpen(false);
  }, []);

  const toggleProfileOverlay = useCallback(() => {
    hideAllOverlays();
    setIsProfileOverlayOpen(!isProfileOverlayOpen);
  }, [isProfileOverlayOpen]);

  const hideProfileOverlay = useCallback(() => {
    setIsProfileOverlayOpen(false);
  }, []);

  const hideAllOverlays = useCallback(() => {
    setIsLoginOverlayOpen(false);
    setIsCartOverlayOpen(false);
    setIsProfileOverlayOpen(false);
  }, []);

  useLayoutEffect(() => {
    if (isLoginOverlayOpen || isCartOverlayOpen || isProfileOverlayOpen) {
      document.body.classList.add('no-scroll');
      document.body.classList.add('no-scroll-padding');
    } else {
      document.body.classList.remove('no-scroll');
      document.body.classList.remove('no-scroll-padding');
    }

    return () => {
      document.body.classList.remove('no-scroll');
      document.body.classList.remove('no-scroll-padding');
    };
  }, [isLoginOverlayOpen, isCartOverlayOpen, isProfileOverlayOpen]);

  useEffect(() => {
    const handlePopState = () => {
      hideAllOverlays();
    };
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [hideAllOverlays]);

  return (
    <UIContext.Provider
      value={{
        isLoginOverlayOpen,
        showLoginOverlay,
        hideLoginOverlay,
        isCartOverlayOpen,
        toggleCartOverlay,
        hideCartOverlay,
        isProfileOverlayOpen,
        toggleProfileOverlay,
        hideProfileOverlay,
        activeTab,
        setActiveTab,
      }}
    >
      {children}
    </UIContext.Provider>
  );
};
