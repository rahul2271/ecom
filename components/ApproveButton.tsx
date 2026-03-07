'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ApproveButton({ withdrawalId }: { withdrawalId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleApprove = async () => {
    if (!confirm('Are you sure you want to approve this payout?')) return;
    
    setLoading(true);
    try {
      const res = await fetch('/api/admin/approve-withdrawal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ withdrawalId }),
      });

      if (res.ok) {
        alert('✅ Payout approved successfully!');
        router.refresh(); // This re-runs the Server Component to update the list
      } else {
        const data = await res.json();
        alert(`❌ Error: ${data.error || 'Failed to approve'}`);
      }
    } catch (err) {
      alert('❌ Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleApprove}
      disabled={loading}
      className="bg-blue-600 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-blue-700 active:scale-95 transition-all shadow-md shadow-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? 'Processing...' : 'Approve Payout'}
    </button>
  );
}