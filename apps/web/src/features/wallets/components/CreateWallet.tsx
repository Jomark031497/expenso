import { Dialog } from "@/components/ui/Dialog";

interface CreateWalletProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateWallet = ({ isOpen, onClose }: CreateWalletProps) => {
  return (
    <Dialog isOpen={isOpen} close={onClose} title="Create Wallet">
      <p>Yes?</p>
    </Dialog>
  );
};
