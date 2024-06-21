import Modal from "../wrappers/Modal.tsx";

interface DeleteConfirmationModalProps {
  onClose: () => void;
  onDelete: () => void;
  title: string;
}

function DeleteConfirmationModal({ onClose, onDelete, title }: DeleteConfirmationModalProps) {
  return (
    <Modal>
      <h1 className={"text-xl font-semibold mb-8"}>{title}</h1>
      <div className={"flex justify-end items-center gap-2"}>
        <button
          className={
            "border rounded-lg bg-gray-500 hover:bg-gray-300 text-white px-4 py-2 font-semibold"
          }
          type="button"
          onClick={() => onClose()}
        >
          Nej
        </button>
        <button
          className={
            "border rounded-lg bg-red-500 hover:bg-red-300 text-white px-4 py-2 font-semibold"
          }
          type="button"
          onClick={() => onDelete()}
        >
          Ja
        </button>
      </div>
    </Modal>
  );
}

export default DeleteConfirmationModal;
