import React, { useState, useEffect } from 'react';
import { Trash2, Minus, Plus, ShoppingBag, CreditCard, Truck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import axiosInstance from '../../utils/axiosConfig';
import { CustomToast } from '../../components/Toast';

export function CartPage() {
  const [purchases, setPurchases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('bank');
  const [processingCheckout, setProcessingCheckout] = useState(false);
  const [deletingItems, setDeletingItems] = useState<number[]>([]);

  const fetchPurchases = async () => {
    try {
      const response = await axiosInstance.get('/purchases/', {
        params: {
          page: 1,
          limit: 1000,
          search: 'admin',
          search_fields: '',
          search_operator: 'OR',
        },
      });

      if (response.data?.purchases) {
        setPurchases(response.data.purchases);
      } else {
        setError('No purchases found');
      }
    } catch (err) {
      setError('Failed to fetch purchases');
      console.error('Error fetching purchases:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

  const handleQuantityChange = async (purchaseId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    try {
      await axiosInstance.put(`/purchases/${purchaseId}`, {
        quantity: newQuantity
      });
      
      setPurchases(purchases.map(purchase => 
        purchase.id === purchaseId 
          ? { ...purchase, quantity: newQuantity }
          : purchase
      ));

      toast.custom((t) => (
        <CustomToast
          t={t}
          message="Số lượng đã được cập nhật"
          type="success"
        />
      ));
    } catch (err) {
      toast.custom((t) => (
        <CustomToast
          t={t}
          message="Không thể cập nhật số lượng. Vui lòng thử lại!"
          type="error"
        />
      ));
      console.error('Error updating quantity:', err);
    }
  };

  const handleDelete = async (purchaseId: number) => {
    try {
      setDeletingItems([...deletingItems, purchaseId]);
      await axiosInstance.delete(`/purchases/${purchaseId}`);
      
      setPurchases(purchases.filter(p => p.id !== purchaseId));
      setSelectedItems(selectedItems.filter(id => id !== purchaseId));
      
      toast.custom((t) => (
        <CustomToast
          t={t}
          message="Sản phẩm đã được xóa khỏi giỏ hàng"
          type="success"
        />
      ));
    } catch (err) {
      toast.custom((t) => (
        <CustomToast
          t={t}
          message="Không thể xóa sản phẩm. Vui lòng thử lại!"
          type="error"
        />
      ));
      console.error('Error deleting item:', err);
    } finally {
      setDeletingItems(deletingItems.filter(id => id !== purchaseId));
    }
  };

  const handleCheckout = async () => {
    if (selectedItems.length === 0) {
      toast.custom((t) => (
        <CustomToast
          t={t}
          message="Vui lòng chọn sản phẩm để thanh toán"
          type="error"
        />
      ));
      return;
    }

    setProcessingCheckout(true);
    try {
      await axiosInstance.post('/transactions/', {
        purchase_ids: selectedItems,
        shipping_method: shippingMethod,
        payment_method: paymentMethod
      });
      
      await fetchPurchases();
      setShowCheckout(false);
      setSelectedItems([]);
      
      toast.custom((t) => (
        <CustomToast
          t={t}
          message="Đặt hàng thành công!"
          type="success"
        />
      ));
    } catch (err) {
      toast.custom((t) => (
        <CustomToast
          t={t}
          message="Không thể xử lý đơn hàng. Vui lòng thử lại!"
          type="error"
        />
      ));
      console.error('Error during checkout:', err);
    } finally {
      setProcessingCheckout(false);
    }
  };

  const calculateSelectedTotal = () => {
    return purchases
      .filter(purchase => selectedItems.includes(purchase.id))
      .reduce((total, purchase) => {
        return total + (purchase.book?.price || 0) * purchase.quantity;
      }, 0);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <ShoppingBag className="h-8 w-8 text-indigo-600" />
            Giỏ hàng của bạn
          </h1>
          <span className="text-gray-600 bg-gray-100 px-4 py-2 rounded-full">
            {purchases.length} sản phẩm
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <AnimatePresence>
              {purchases.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white rounded-lg shadow p-8 text-center"
                >
                  <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 mb-2">Giỏ hàng trống</h3>
                  <p className="text-gray-500">Hãy thêm sản phẩm vào giỏ hàng của bạn!</p>
                </motion.div>
              ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  {purchases.map((purchase, index) => (
                    <motion.div
                      key={purchase.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      className={`p-6 ${index !== purchases.length - 1 ? 'border-b border-gray-200' : ''}`}
                    >
                      <div className="flex items-center space-x-6">
                        <div className="flex-shrink-0">
                          <input
                            type="checkbox"
                            checked={selectedItems.includes(purchase.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedItems([...selectedItems, purchase.id]);
                              } else {
                                setSelectedItems(selectedItems.filter(id => id !== purchase.id));
                              }
                            }}
                            className="h-5 w-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                          />
                        </div>
                        <div className="flex-shrink-0 w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src={purchase.book?.images?.[0]?.url || 'https://via.placeholder.com/150'}
                            alt={purchase.book?.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <div>
                              <h3 className="text-lg font-medium text-gray-900 hover:text-indigo-600 transition-colors">
                                {purchase.book?.title}
                              </h3>
                              <p className="mt-1 text-sm text-gray-500">
                                Mã: {purchase.book?.code}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-medium text-gray-900">
                                {formatPrice(purchase.book?.price || 0)}
                              </p>
                              <div className="mt-2 flex items-center justify-end space-x-3">
                                <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                                  <button 
                                    onClick={() => handleQuantityChange(purchase.id, purchase.quantity - 1)}
                                    className="p-1 hover:bg-gray-200 rounded-md transition-colors"
                                  >
                                    <Minus className="h-4 w-4" />
                                  </button>
                                  <span className="text-gray-800 w-8 text-center">{purchase.quantity}</span>
                                  <button 
                                    onClick={() => handleQuantityChange(purchase.id, purchase.quantity + 1)}
                                    className="p-1 hover:bg-gray-200 rounded-md transition-colors"
                                  >
                                    <Plus className="h-4 w-4" />
                                  </button>
                                </div>
                                <button
                                  onClick={() => handleDelete(purchase.id)}
                                  disabled={deletingItems.includes(purchase.id)}
                                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                  {deletingItems.includes(purchase.id) ? (
                                    <div className="animate-spin h-5 w-5 border-2 border-red-500 rounded-full border-t-transparent" />
                                  ) : (
                                    <Trash2 className="h-5 w-5" />
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </div>

          <div className="lg:col-span-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-indigo-600" />
                Thanh toán
              </h2>
              
              {!showCheckout ? (
                <div className="space-y-6">
                  <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
                    <span className="text-gray-600">Đã chọn</span>
                    <span className="text-gray-900 font-medium">{selectedItems.length} sản phẩm</span>
                  </div>
                  <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
                    <span className="text-gray-600">Tạm tính</span>
                    <span className="text-gray-900 font-medium">{formatPrice(calculateSelectedTotal())}</span>
                  </div>
                  <button
                    onClick={() => setShowCheckout(true)}
                    disabled={selectedItems.length === 0}
                    className={`w-full py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2
                      ${selectedItems.length === 0 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-xl'}`}
                  >
                    <CreditCard className="h-5 w-5" />
                    Tiến hành thanh toán
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
                      <Truck className="h-4 w-4" />
                      Phương thức vận chuyển
                    </h3>
                    <select
                      value={shippingMethod}
                      onChange={(e) => setShippingMethod(e.target.value)}
                      className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="standard">Giao hàng tiêu chuẩn (Miễn phí)</option>
                      <option value="express">Giao hàng nhanh (+50.000₫)</option>
                    </select>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Phương thức thanh toán
                    </h3>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="bank">Chuyển khoản ngân hàng</option>
                      <option value="cod">Thanh toán khi nhận hàng</option>
                    </select>
                  </div>

                  <div className="border-t border-gray-200 pt-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Tạm tính</span>
                      <span>{formatPrice(calculateSelectedTotal())}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Phí vận chuyển</span>
                      <span>{shippingMethod === 'express' ? '50.000₫' : 'Miễn phí'}</span>
                    </div>
                    <div className="flex justify-between items-center text-lg font-medium">
                      <span>Tổng cộng</span>
                      <span className="text-indigo-600">
                        {formatPrice(calculateSelectedTotal() + (shippingMethod === 'express' ? 50000 : 0))}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={handleCheckout}
                      disabled={processingCheckout}
                      className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 
                               transition-all duration-200 shadow-lg hover:shadow-xl disabled:bg-gray-400 
                               disabled:shadow-none flex items-center justify-center gap-2"
                    >
                      {processingCheckout ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                          Đang xử lý...
                        </>
                      ) : (
                        <>
                          <CreditCard className="h-5 w-5" />
                          Hoàn tất đặt hàng
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => setShowCheckout(false)}
                      className="w-full bg-gray-100 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-200 
                               transition-colors duration-200 flex items-center justify-center gap-2"
                    >
                      <ShoppingBag className="h-5 w-5" />
                      Quay lại giỏ hàng
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}