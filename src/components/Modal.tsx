import { PropsWithChildren } from "react";

function Modal({ children }: PropsWithChildren) {
    return (
        <div className="fixed inset-0 flex items-center justify-center mt-20">
            <div className="bg-black bg-opacity-50 absolute inset-0 backdrop-blur-md"></div>
            <div className="bg-white p-8 rounded-md relative z-10 max-h-[800px] overflow-y-auto overscroll-none min-w-96">
                {children}
            </div>
        </div>
    );
}

export default Modal;
