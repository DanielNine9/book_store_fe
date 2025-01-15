import React from 'react';
import { motion } from 'framer-motion';
import { 
  Clock, 
  Package, 
  CreditCard, 
  ShoppingBag, 
  ChevronRight, 
  BookOpen,
  User,
  Tag,
  Calendar
} from 'lucide-react';

interface TransactionDetailsProps {
  transaction: any;
}

export function TransactionDetails({ transaction }: TransactionDetailsProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <ShoppingBag className="h-4 w-4" />
            <span>Đơn hàng</span>
            <ChevronRight className="h-4 w-4" />
            <span className="font-medium text-gray-900">{transaction.code}</span>
          </div>

          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Chi tiết đơn hàng #{transaction.code}
                  </h1>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(transaction.transaction_time)}
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Package className="h-4 w-4" />
                      {transaction.purchases.length} sản phẩm
                    </div>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(transaction.status)}`}>
                  {transaction.status === 'pending' ? 'Đang xử lý' : transaction.status}
                </span>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Sản phẩm</h2>
                  <div className="space-y-4">
                    {transaction.purchases.map((purchase: any) => (
                      <motion.div
                        key={purchase.ID}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gray-50 rounded-lg p-4"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-20 h-24 bg-gray-200 rounded-md overflow-hidden">
                            <img
                              src={purchase.book?.images?.[0]?.url || 'https://via.placeholder.com/150'}
                              alt={purchase.book?.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900 mb-1">
                              {purchase.book?.title}
                            </h3>
                            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <Tag className="h-4 w-4" />
                                Mã: {purchase.book?.code}
                              </div>
                              <div className="flex items-center gap-1">
                                <User className="h-4 w-4" />
                                {purchase.book?.author?.name || 'Chưa có tác giả'}
                              </div>
                            </div>
                            <div className="mt-2 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-gray-600">Số lượng:</span>
                                <span className="font-medium">{purchase.quantity}</span>
                              </div>
                              <div className="text-right">
                                <div className="text-sm text-gray-600">Đơn giá</div>
                                <div className="font-medium text-gray-900">
                                  {formatPrice(purchase.book_price)}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-1">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-gray-600" />
                      Thông tin thanh toán
                    </h2>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Tạm tính</span>
                        <span>{formatPrice(transaction.total_amount)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Phí vận chuyển</span>
                        <span>Miễn phí</span>
                      </div>
                      <div className="pt-3 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Tổng cộng</span>
                          <span className="text-xl font-bold text-indigo-600">
                            {formatPrice(transaction.total_amount)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <h3 className="text-sm font-medium text-gray-900 mb-3">Trạng thái đơn hàng</h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-sm">
                          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                            <Clock className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">Đặt hàng thành công</div>
                            <div className="text-gray-600">{formatDate(transaction.CreatedAt)}</div>
                          </div>
                        </div>
                        {/* Add more status steps as needed */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}