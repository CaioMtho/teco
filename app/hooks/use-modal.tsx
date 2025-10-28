'use client'
import { useState, useCallback } from 'react';
import { ModalType } from '../components/modal';

interface ModalState {
  isOpen: boolean;
  title: string;
  message: string;
  type: ModalType;
  confirmText: string;
  cancelText: string;
  showCancel: boolean;
  onConfirm?: () => void;
}

export const useModal = () => {
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
    confirmText: 'OK',
    cancelText: 'Cancelar',
    showCancel: false,
  });

  const closeModal = useCallback(() => {
    setModalState(prev => ({ ...prev, isOpen: false }));
  }, []);

  const openModal = useCallback((config: {
    title: string;
    message: string;
    type?: ModalType;
    confirmText?: string;
    cancelText?: string;
    showCancel?: boolean;
    onConfirm?: () => void;
  }) => {
    setModalState({
      isOpen: true,
      title: config.title,
      message: config.message,
      type: config.type || 'info',
      confirmText: config.confirmText || 'OK',
      cancelText: config.cancelText || 'Cancelar',
      showCancel: config.showCancel || false,
      onConfirm: config.onConfirm,
    });
  }, []);

  const showInfo = useCallback((title: string, message: string) => {
    openModal({ title, message, type: 'info' });
  }, [openModal]);

  const showSuccess = useCallback((title: string, message: string) => {
    openModal({ title, message, type: 'success' });
  }, [openModal]);

  const showWarning = useCallback((title: string, message: string) => {
    openModal({ title, message, type: 'warning' });
  }, [openModal]);

  const showError = useCallback((title: string, message: string) => {
    openModal({ title, message, type: 'error' });
  }, [openModal]);

  const showConfirm = useCallback((
    title: string, 
    message: string, 
    onConfirm: () => void,
    confirmText: string = 'Confirmar',
    cancelText: string = 'Cancelar'
  ) => {
    openModal({ 
      title, 
      message, 
      type: 'confirm', 
      showCancel: true,
      confirmText,
      cancelText,
      onConfirm 
    });
  }, [openModal]);

  return {
    modalState,
    closeModal,
    openModal,
    showInfo,
    showSuccess,
    showWarning,
    showError,
    showConfirm,
  };
};