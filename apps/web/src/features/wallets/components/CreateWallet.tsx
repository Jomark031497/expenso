import { Modal } from "@/components/ui/Modal";

interface CreateWalletProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateWallet = ({ isOpen, onClose }: CreateWalletProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <p>Yes?</p>
    </Modal>
  );
};
