import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosConfig';

export function CartPage() {
  const [purchases, setPurchases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('bank');
  const [processingCheckout, setProcessingCheckout] = useState(false);

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
    try {
      await axiosInstance.put(`/purchases/${purchaseId}`, {
        quantity: newQuantity
      });
      
      // Update local state
      setPurchases(purchases.map(purchase => 
        purchase.id === purchaseId 
          ? { ...purchase, quantity: newQuantity }
          : purchase
      ));
    } catch (err) {
      console.error('Error updating quantity:', err);
    }
  };

  const handleCheckout = async () => {
    if (selectedItems.length === 0) {
      alert('Please select items to checkout');
      return;
    }

    setProcessingCheckout(true);
    try {
      await axiosInstance.post('/transactions/', {
        purchase_ids: selectedItems
      });
      
      await fetchPurchases();
      setShowCheckout(false);
      setSelectedItems([]);
      alert('Checkout completed successfully!');
    } catch (err) {
      console.error('Error during checkout:', err);
      alert('Failed to process checkout. Please try again.');
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
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <span className="text-gray-600">{purchases.length} items</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            {purchases.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <h3 className="text-xl font-medium text-gray-900 mb-2">Your cart is empty</h3>
                <p className="text-gray-500">Start adding some items to your cart!</p>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                {purchases.map((purchase, index) => (
                  <div key={purchase.id} className={`p-6 ${index !== purchases.length - 1 ? 'border-b border-gray-200' : ''}`}>
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
                          className="h-4 w-4 text-indigo-600 rounded"
                        />
                      </div>
                      <div className="flex-shrink-0 w-24 h-24 bg-gray-200 rounded-md overflow-hidden">
                        <img
                          src={purchase.book?.images?.[0]?.url || 'https://via.placeholder.com/150'}
                          alt={purchase.book?.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">
                              {purchase.book?.title}
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                              Code: {purchase.book?.code}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-medium text-gray-900">
                              {formatPrice(purchase.book?.price || 0)}
                            </p>
                            <div className="mt-1 flex items-center space-x-2">
                              <button 
                                onClick={() => handleQuantityChange(purchase.id, Math.max(1, purchase.quantity - 1))}
                                className="text-gray-500 hover:text-gray-700"
                              >
                                -
                              </button>
                              <span className="text-gray-600">{purchase.quantity}</span>
                              <button 
                                onClick={() => handleQuantityChange(purchase.id, purchase.quantity + 1)}
                                className="text-gray-500 hover:text-gray-700"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-4">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
              {!showCheckout ? (
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Selected Items</span>
                    <span className="text-gray-900 font-medium">{selectedItems.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900 font-medium">{formatPrice(calculateSelectedTotal())}</span>
                  </div>
                  <button
                    onClick={() => setShowCheckout(true)}
                    disabled={selectedItems.length === 0}
                    className={`w-full py-3 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 
                      ${selectedItems.length === 0 
                        ? 'bg-gray-300 cursor-not-allowed' 
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}
                  >
                    Proceed to Checkout
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Shipping Method</h3>
                    <select
                      value={shippingMethod}
                      onChange={(e) => setShippingMethod(e.target.value)}
                      className="w-full border-gray-300 rounded-md shadow-sm"
                    >
                      <option value="standard">Standard Shipping (Free)</option>
                      <option value="express">Express Shipping (+50,000₫)</option>
                    </select>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Payment Method</h3>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full border-gray-300 rounded-md shadow-sm"
                    >
                      <option value="bank">Bank Transfer</option>
                      <option value="cod">Cash on Delivery</option>
                    </select>
                  </div>

                  <div className="border-t border-gray-200 pt-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span>{formatPrice(calculateSelectedTotal())}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span>{shippingMethod === 'express' ? '50,000₫' : 'Free'}</span>
                    </div>
                    <div className="flex justify-between text-lg font-medium">
                      <span>Total</span>
                      <span>{formatPrice(calculateSelectedTotal() + (shippingMethod === 'express' ? 50000 : 0))}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={handleCheckout}
                      disabled={processingCheckout}
                      className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-gray-400"
                    >
                      {processingCheckout ? 'Processing...' : 'Complete Purchase'}
                    </button>
                    <button
                      onClick={() => setShowCheckout(false)}
                      className="w-full bg-gray-100 text-gray-800 py-3 px-4 rounded-md hover:bg-gray-200 transition-colors duration-200"
                    >
                      Back to Cart
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}