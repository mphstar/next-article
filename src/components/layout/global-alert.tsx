'use client'

import { useAlertModal } from "@/store/alert-context";
import { AlertModal } from "../modal/alert-modal";

export default function GlobalAlertModal() {
  const { modalState, closeModal } = useAlertModal();

  return (
    <AlertModal
      isOpen={modalState.isOpen}
      onClose={closeModal}
      onConfirm={() => {
        if (modalState.onConfirm) {
          modalState.onConfirm();
        }
      }}
      loading={modalState.loading || false}
    />
  );
}
