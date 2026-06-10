import React, { useState, useEffect } from 'react';
import { useOrders } from '../../hooks/useOrders';
import { useSettings } from '../../hooks/useSettings';
import { Order } from '../../types';
import { ShoppingBag, PhoneCall, Check, Clock, Truck, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function AdminOrders() {
  const { subscribeToOrders, updateOrderStatus } = useOrders();
  const { settings } = useSettings();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Subscribe to raw collection updates in real-time
  useEffect(() => {
    const unsubscribe = subscribeToOrders(
      (data) => {
        setOrders(data);
        setLoading(false);
      },
      (err) => {
        console.error('Enquiry real-time load error:', err);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleStatusChange = async (id: string, newStatus: "pending" | "confirmed" | "shipped" | "delivered") => {
    try {
      await updateOrderStatus(id, newStatus);
    } catch (err) {
      console.error('Order status write failure:', err);
      alert('Failed to update status codes. Confirm privilege values.');
    }
  };

  const handleWhatsAppOrderCall = (order: Order) => {
    const cleanNumber = order.phone.replace(/[^0-9]/g, '');
    const itemsSummary = order.items.map((itm) => `${itm.productName} (${itm.color}) x${itm.qty}`).join(', ');
    const quickMsg = `Hi ${order.customerName}! 🌸\nCalling from KALARANG Silks & Studio regarding your Saree Order ID: ${order.id}.\n\nItems chosen: ${itemsSummary}\nTotal: ₹${order.total.toLocaleString('en-IN')}\n\nWe'd love to confirm your design requirements and process shipping! Let us know how we should proceed. 🙏`;
    window.open(`https://wa.me/${cleanNumber}?text=${encodeURIComponent(quickMsg)}`, '_blank');
  };

  return (
    <div id="admin-purchase-orders" className="flex flex-col gap-6 font-sans text-xs sm:text-sm">
      
      {/* Header operations area */}
      <div className="border-b border-[#B8860B]/15 pb-4">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1008] uppercase">
          Administrative Orders Tracker
        </h1>
        <p className="text-gray-500 text-xs sm:text-sm mt-0.5">
          Real-time, zero-latency streaming of customer purchase inquiry queues. Coordinate payment directly.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-500">
          <div className="w-10 h-10 border-4 border-[#B8860B] border-t-transparent rounded-full animate-spin mb-4 mx-auto" />
          <p className="font-serif italic text-[#1C1008]">Synchronizing with purchase ledger collection...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-[#FDF8F2] border border-[#B8860B]/15 rounded p-12 text-center max-w-xl mx-auto flex flex-col gap-3 items-center">
          <ShoppingBag className="h-10 w-10 text-gray-400" />
          <p className="font-serif italic text-base text-gray-500">
            No shopper queries received yet.
          </p>
          <p className="text-xs text-gray-400 max-w-sm">
            Once a consumer submits their order form from the shopping bag page, details populate in this ledger instantly.
          </p>
        </div>
      ) : (
        /* Orders list grid */
        <div className="flex flex-col gap-5">
          {orders.map((order) => {
            const dateStr = order.createdAt?.seconds 
              ? new Date(order.createdAt.seconds * 1000).toLocaleString('en-IN') 
              : 'Recent Order';

            return (
              <div 
                key={order.id} 
                className="bg-[#FDF8F2] border-2 border-[#B8860B]/15 rounded-md p-4 sm:p-5 shadow-sm hover:shadow transition-shadow flex flex-col gap-4 text-[#1C1008]"
              >
                {/* Order header row */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-gray-100 pb-3">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-mono text-gray-400 uppercase leading-none">Record Reference:</span>
                    <strong className="text-xs font-mono font-bold text-[#7A1C2E] uppercase select-all">
                      {order.id}
                    </strong>
                    <span className="text-[11px] text-gray-500 font-sans mt-0.5">
                      Placed At: {dateStr}
                    </span>
                  </div>

                  {/* Operational controls status */}
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Status:</span>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value as any)}
                      className="bg-[#FDF8F2] border border-[#B8860B]/25 rounded px-2.5 py-1.5 focus:outline-none focus:border-[#7A1C2E] text-xs font-bold uppercase tracking-wider text-[#1C1008]"
                    >
                      <option value="pending">⏳ Pending Verification</option>
                      <option value="confirmed">✅ Confirmed Enquiry</option>
                      <option value="shipped">🚚 Shipped / Transiting</option>
                      <option value="delivered">🌸 Delivered Order</option>
                    </select>
                  </div>
                </div>

                {/* Saree Items list column and delivery details */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start text-xs sm:text-sm">
                  
                  {/* Delivery specifications (5 span) */}
                  <div className="md:col-span-5 flex flex-col gap-2.5 bg-[#E8D5B0]/20 p-4 border border-[#B8860B]/10 rounded">
                    <h4 className="font-serif text-sm font-bold text-[#1C1008] uppercase border-b border-[#B8860B]/10 pb-1">
                      Recipient client details
                    </h4>
                    <p>
                      <strong className="text-gray-500 uppercase text-[10px] block font-semibold">Client Name</strong>
                      <span className="font-medium text-gray-900">{order.customerName}</span>
                    </p>
                    <p>
                      <strong className="text-gray-500 uppercase text-[10px] block font-semibold">Contact Phone</strong>
                      <span className="font-semibold font-mono text-[#7A1C2E] block">{order.phone}</span>
                    </p>
                    <p>
                      <strong className="text-gray-500 uppercase text-[10px] block font-semibold">Shipping Address</strong>
                      <span className="text-gray-700 leading-normal block">{order.address}</span>
                      <span className="text-[11px] bg-[#B8860B]/15 px-1.5 py-0.5 uppercase tracking-wide text-[#B8860B] font-extrabold rounded inline-block mt-1 font-sans">
                        Pincode: {order.pincode}
                      </span>
                    </p>
                    {order.notes && (
                      <p className="bg-white/50 border border-yellow-200 p-2.5 rounded text-gray-650 italic mt-1 leading-normal">
                        <strong>Custom request:</strong> "{order.notes}"
                      </p>
                    )}
                  </div>

                  {/* Saree details index specs (7 span) */}
                  <div className="md:col-span-7 flex flex-col gap-3 justify-between h-full">
                    <div>
                      <h4 className="font-serif text-sm font-bold text-[#1C1008] uppercase border-b border-[#B8860B]/10 pb-1 mb-2.5">
                        Sarees Selected Inventory List
                      </h4>
                      <div className="flex flex-col gap-2 divide-y divide-gray-100">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="py-2 flex justify-between items-center text-xs">
                            <div className="flex flex-col">
                              <span className="font-semibold text-[#1C1008]">{item.productName}</span>
                              <span className="text-[10px] text-gray-500">Color Variant: <strong className="text-gray-700">{item.color}</strong></span>
                            </div>
                            <span className="font-medium text-gray-600 block">
                              Qty {item.qty} &times; ₹{item.price.toLocaleString('en-IN')}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-[#B8860B]/10 pt-4 mt-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-gray-500 uppercase font-semibold leading-none">Grand Total value:</span>
                        <span className="text-lg font-bold font-sans text-[#7A1C2E]">
                          ₹{order.total.toLocaleString('en-IN')}
                        </span>
                      </div>

                      {/* WhatsApp trigger button */}
                      <button
                        onClick={() => handleWhatsAppOrderCall(order)}
                        className="inline-flex items-center gap-2 bg-green-700 hover:bg-green-850 text-white rounded font-sans text-xs tracking-wider uppercase font-bold py-2.5 px-4 cursor-pointer transition-colors"
                      >
                        <PhoneCall className="h-4 w-4 shrink-0 animate-pulse-subtle" />
                        Coordinate on WhatsApp
                      </button>
                    </div>

                  </div>

                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
