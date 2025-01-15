import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Check, X } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface ToastProps {
  t: any;
  message: string;
  type?: 'success' | 'error';
}

export const CustomToast = ({ t, message, type = 'success' }: ToastProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      className={`${
        t.visible ? 'animate-enter' : 'animate-leave'
      } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
    >
      <div className="flex-1 w-0 p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0 pt-0.5">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20
              }}
              className={`${
                type === 'success' ? 'bg-green-100' : 'bg-red-100'
              } rounded-full p-2`}
            >
              {type === 'success' ? (
                <div className="flex items-center space-x-2">
                  <ShoppingCart className="h-6 w-6 text-green-600" />
                  <Check className="h-5 w-5 text-green-600" />
                </div>
              ) : (
                <X className="h-6 w-6 text-red-600" />
              )}
            </motion.div>
          </div>
          <div className="ml-3 flex-1">
            <motion.p
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className={`text-sm font-medium ${
                type === 'success' ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {type === 'success' ? 'Thành công!' : 'Lỗi!'}
            </motion.p>
            <motion.p
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-1 text-sm text-gray-500"
            >
              {message}
            </motion.p>
          </div>
        </div>
      </div>
      <div className="flex border-l border-gray-200">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => toast.dismiss(t.id)}
          className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-gray-600 hover:text-gray-500 focus:outline-none"
        >
          Đóng
        </motion.button>
      </div>
    </motion.div>
  );
};