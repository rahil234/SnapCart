import React, {
  createContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from 'react';

interface UIContextProps {
  isLoginOverlayOpen: boolean;
  showLoginOverlay: () => void;
  hideLoginOverlay: () => void;
  isCartOverlayOpen: boolean;
  showCartOverlay: () => void;
  hideCartOverlay: () => void;
}

export const UIContext = createContext<UIContextProps>({
  isLoginOverlayOpen: false,
  showLoginOverlay: () => {},
  hideLoginOverlay: () => {},
  isCartOverlayOpen: false,
  showCartOverlay: () => {},
  hideCartOverlay: () => {},
});

interface UIProviderProps {
  children: ReactNode;
}

export const UIProvider: React.FC<UIProviderProps> = ({ children }) => {
  const [isLoginOverlayOpen, setIsLoginOverlayOpen] = useState<boolean>(false);
  const [isCartOverlayOpen, setIsCartOverlayOpen] = useState<boolean>(false);


  const showLoginOverlay = useCallback(() => {
    setIsLoginOverlayOpen(true);
  }, []);

  const hideLoginOverlay = useCallback(() => {
    setIsLoginOverlayOpen(false);
  }, []);
  
  const showCartOverlay = useCallback(() => {
    setIsCartOverlayOpen(true);
  }, []);

  const hideCartOverlay = useCallback(() => {
    setIsCartOverlayOpen(false);
  }, []);

  useEffect(() => {
    if (isLoginOverlayOpen || isCartOverlayOpen) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }

    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, [isLoginOverlayOpen, isCartOverlayOpen]);

  return (
    <UIContext.Provider
      value={{
        isLoginOverlayOpen,
        showLoginOverlay,
        hideLoginOverlay,
        isCartOverlayOpen,
        showCartOverlay,
        hideCartOverlay,
      }}
    >
      {children}
    </UIContext.Provider>
  );
};
