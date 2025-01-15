import React from 'react';

interface TransactionProps {
    transaction: {
        ID: number;
        status: string;
        total_amount: number;
        transaction_time: string;
        purchases: { book: { title: string; price: number; }; quantity: number; }[];
    };
}

const Transaction: React.FC<TransactionProps> = ({ transaction }) => {
    return (
        <div className="transaction">
            <h2>Transaction ID: {transaction.ID}</h2>
            <p><strong>Status:</strong> {transaction.status}</p>
            <p><strong>Total Amount:</strong> {transaction.total_amount.toLocaleString()} VND</p>
            <p><strong>Transaction Date:</strong> {new Date(transaction.transaction_time).toLocaleString()}</p>

            <div className="purchase-list">
                <h3>Purchased Items</h3>
                <ul>
                    {transaction.purchases.map((purchase, index) => (
                        <li key={index}>
                            <div className="item">
                                <h4>{purchase.book.title}</h4>
                                <p>Quantity: {purchase.quantity}</p>
                                <p><strong>Price:</strong> {purchase.book.price.toLocaleString()} VND each</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Transaction;
