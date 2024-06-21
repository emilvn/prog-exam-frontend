import { PropsWithChildren } from "react";

function Modal({ children }: PropsWithChildren) {
  return (
    <div className="fixed inset-0 flex items-center justify-center mt-20">
      <div className="bg-white p-8 rounded-md z-10 max-h-screen overscroll-none min-w-96 shadow-2xl border">
        {children}
      </div>
    </div>
  );
}

export default Modal;
