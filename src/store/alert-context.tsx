"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  startTransition,
} from "react";

type ConfirmCallback = () => void;

interface AlertModalState {
  isOpen: boolean;
  onConfirm?: ConfirmCallback;
  title?: string;
  description?: string;
  loading?: boolean;
}

interface AlertModalContextProps {
  showModal: (params: {
    title?: string;
    description?: string;
    onConfirm: ConfirmCallback;
  }) => void;
  closeModal: () => void;
  modalState: AlertModalState;
  setLoading: (loading: boolean) => void;
}

const AlertModalContext = createContext<AlertModalContextProps | undefined>(
  undefined
);

export const AlertModalProvider = ({ children }: { children: ReactNode }) => {
  const [modalState, setModalState] = useState<AlertModalState>({
    isOpen: false,
  });

  const showModal = ({
    title,
    description,
    onConfirm,
  }: Omit<AlertModalState, "isOpen">) => {
    setModalState({ isOpen: true, title, description, onConfirm });
  };

  const closeModal = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  };

  const setLoading = (loading: boolean) => {
    setModalState((prev) => ({ ...prev, loading }));
  };

  return (
    <AlertModalContext.Provider
      value={{ showModal, closeModal, modalState, setLoading }}
    >
      {children}
    </AlertModalContext.Provider>
  );
};

export const useAlertModal = () => {
  const context = useContext(AlertModalContext);
  if (!context) {
    throw new Error("useAlertModal must be used within an AlertModalProvider");
  }
  return context;
};
