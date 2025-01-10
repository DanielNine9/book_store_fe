import React from 'react';
import { X } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { formatPrice } from '../utils';

export function Cart({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { cartItems, removeFromCart, updateQuantity } = useCart();

  const total = cartItems.reduce((sum, item) => {
    return sum + (parseInt(item.price.replace(/\D/g, '')) * item.quantity);
  }, 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
      <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-lg">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Giỏ hàng ({cartItems.length})</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-4 space-y-4 h-[calc(100vh-200px)] overflow-y-auto">
          {cartItems.map((item) => (
            <div key={item.id} className="flex gap-4 border-b pb-4">
              <img src={item.image} alt={item.title} className="w-20 h-20 object-cover rounded" />
              <div className="flex-1">
                <h3 className="font-medium">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.author}</p>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center space-x-2">
                    <button 
                      className="px-2 py-1 border rounded"
                      onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button 
                      className="px-2 py-1 border rounded"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-indigo-600 font-medium mt-1">
                  {formatPrice(parseInt(item.price.replace(/\D/g, '')) * item.quantity)}đ
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="absolute bottom-0 left-0 right-0 border-t bg-white p-4">
          <div className="flex justify-between mb-4">
            <span className="font-medium">Tổng cộng:</span>
            <span className="font-bold text-indigo-600">{formatPrice(total)}đ</span>
          </div>
          <button className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700">
            Thanh toán
          </button>
        </div>
      </div>
    </div>
  );
}