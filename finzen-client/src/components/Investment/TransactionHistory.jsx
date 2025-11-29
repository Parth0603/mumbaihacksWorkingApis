import React, { useEffect, useState } from 'react';
import apiClient from '../../utils/api';

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchData();
  }, [filter]);

  const fetchData = async () => {
    try {
      // Fetch transactions
      const txResponse = await apiClient.get(
        `/investments/transactions?type=${filter === 'all' ? '' : filter}`
      );
      setTransactions(txResponse.data.transactions);
      // Fetch summary
      const summaryResponse = await apiClient.get('/investments/transaction-summary');
      setSummary(summaryResponse.data);
    } catch (err) {
      console.error('Failed to fetch transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading history...</div>;

  return (
    <div>
      <h2>📊 Investment History</h2>
      {summary && (
        <div>
          <div>
            Total Transactions {summary.total_transactions}
          </div>
          <div>
            Total Invested ₹{summary.total_invested}
          </div>
          <div>
            Via Round-ups ₹{summary.total_round_ups}
          </div>
          <div>
            Average ₹{summary.average_transaction}
          </div>
        </div>
      )}
      <div>
        <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>
          All
        </button>
        <button
          className={filter === 'investment' ? 'active' : ''}
          onClick={() => setFilter('investment')}
        >
          Investments
        </button>
        <button
          className={filter === 'round_up' ? 'active' : ''}
          onClick={() => setFilter('round_up')}
        >
          Round-ups
        </button>
      </div>
      <table className="transactions-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Description</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx._id}>
              <td>{new Date(tx.transaction_date).toLocaleDateString()}</td>
              <td>
                {tx.type === 'investment' ? '💰' : '🔄'} {tx.type}
              </td>
              <td className="amount">₹{tx.amount}</td>
              <td>{tx.description}</td>
              <td>✅ {tx.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
