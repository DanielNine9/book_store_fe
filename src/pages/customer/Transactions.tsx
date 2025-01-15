import React, { useEffect, useState } from 'react';
import { fetchTransactions } from '../../services/TransactionService';
import { Table } from '../../components/Table';
import { TransactionDetails } from './components/TransactionDetails';

const TransactionList: React.FC = () => {
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedTransaction, setSelectedTransaction] = useState<any | null>(null); // State để lưu giao dịch được chọn
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // State để điều khiển việc mở modal

    useEffect(() => {
        async function loadTransactions() {
            try {
                const data = await fetchTransactions(10);
                setTransactions(data.transactions); // Giả sử data.transactions chứa danh sách giao dịch
                setLoading(false);
            } catch (err) {
                setError("Không thể tải dữ liệu.");
                setLoading(false);
            }
        }

        loadTransactions();
    }, []);

    // Định nghĩa các cột của bảng
    const columns = [
        { label: 'Transaction ID', field: 'ID' },
        { label: 'Status', field: 'status' },
        {
            label: 'Total Amount',
            field: 'total_amount',
            render: (data: any) => `${data.total_amount.toLocaleString()} VND`, // Format tiền tệ
        },
        {
            label: 'Transaction Time',
            field: 'transaction_time',
            render: (data: any) => new Date(data.transaction_time).toLocaleString(), // Chuyển đổi thời gian
        },
        {
            label: 'Purchased Items',
            field: 'purchases',
            render: (data: any) => (
                <ul>
                    {data.purchases.map((purchase: any, index: number) => (
                        <li key={index}>
                            {purchase.book.title} (x{purchase.quantity})
                        </li>
                    ))}
                </ul>
            ),
        },
        {
            label: 'Action',
            field: 'action',
            render: (data: any) => (
                <button
                    onClick={() => openModal(data)}  // Mở modal và truyền dữ liệu giao dịch vào
                    className="text-indigo-600 hover:text-indigo-800"
                >
                    View Details
                </button>
            ),
        }
    ];

    // Mở modal và thiết lập giao dịch đã chọn
    const openModal = (transaction: any) => {
        setSelectedTransaction(transaction);
        setIsModalOpen(true);
    };

    // Đóng modal
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedTransaction(null);
    };

    return (
        <div className="container mx-auto px-4 py-6">
            <h2 className="text-3xl font-semibold mb-6 text-gray-800">Danh sách Giao Dịch</h2>
            <Table data={transactions} columns={columns} loading={loading} error={error} />

            {/* Modal hiển thị chi tiết giao dịch */}
            {isModalOpen && selectedTransaction && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                    {/* Modal nội dung */}
                    <div className="bg-white rounded-xl shadow-lg p-6 w-[70%] h-auto max-h-[90%] overflow-y-auto relative">
                        {/* Nút đóng */}
                        <button onClick={closeModal} className="absolute top-2 right-2 text-gray-500 text-2xl">
                            ×
                        </button>
                        <TransactionDetails transaction={selectedTransaction} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default TransactionList;
