import React, { useState, useEffect } from 'react';
import { useProducts } from '../../hooks/useProducts';
import { useCollections } from '../../hooks/useCollections';
import { useOrders } from '../../hooks/useOrders';
import { Order } from '../../types';
import { 
  ShoppingBag, 
  Sparkles, 
  AlertCircle, 
  FolderHeart, 
  TrendingUp, 
  ExternalLink 
} from 'lucide-react';

export default function AdminDashboard() {
  const { products } = useProducts();
  const { collections } = useCollections();
  const { subscribeToOrders } = useOrders();
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  // Subscribe to Orders in real-time as mandated
  useEffect(() => {
    const unsubscribe = subscribeToOrders(
      (data) => {
        setOrders(data);
        setOrdersLoading(false);
      },
      (err) => {
        console.error('Snapshot orders read error:', err);
        setOrdersLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  // Compute states
  const totalProductsCount = products.filter((p) => !p.isDeleted).length;
  const totalCollectionsCount = collections.length;
  const totalOrdersCount = orders.length;
  
  const pendingOrders = orders.filter((o) => o.status === 'pending');
  const pendingCount = pendingOrders.length;

  const totalSalesRevenue = orders
    .filter((o) => o.status !== 'pending') // Only completed/confirmed orders contribute to definitive sales indicators
    .reduce((sum, o) => sum + o.total, 0);

  const statsList = [
    {
      name: 'Active Sarees',
      value: totalProductsCount,
      icon: Sparkles,
      color: 'bg-yellow-500/10 text-yellow-800 border-yellow-500/20'
    },
    {
      name: 'Loom Segments',
      value: totalCollectionsCount,
      icon: FolderHeart,
      color: 'bg-pink-500/10 text-pink-800 border-pink-500/20'
    },
    {
      name: 'Total Orders',
      value: totalOrdersCount,
      icon: ShoppingBag,
      color: 'bg-[#7A1C2E]/10 text-[#7A1C2E] border-[#7A1C2E]/20'
    },
    {
      name: 'Pending Enquiries',
      value: pendingCount,
      icon: AlertCircle,
      color: 'bg-blue-500/10 text-blue-800 border-blue-500/20'
    }
  ];

  return (
    <div id="admin-home-dashboard" className="flex flex-col gap-8 font-sans">
      
      {/* Header Panel */}
      <div>
        <h1 className="font-serif text-3xl font-bold text-[#1C1008] uppercase">
          Studio Overview
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Real-time status of KALARANG design catalogs and customer purchase enquiries.
        </p>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statsList.map((stat) => {
          const IconComponent = stat.icon;
          return (
            <div 
              key={stat.name}
              className={`p-6 bg-[#FDF8F2] border rounded-md shadow-sm flex items-center justify-between ${stat.color}`}
            >
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  {stat.name}
                </span>
                <span className="text-3xl font-extrabold tracking-tight font-serif text-[#1C1008]">
                  {stat.value}
                </span>
              </div>
              <div className="p-3 bg-white/50 rounded-full shrink-0">
                <IconComponent className="h-6 w-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Recent Transactions & Quick Guides */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Orders table - span 2 */}
        <div className="lg:col-span-2 bg-[#FDF8F2] border border-[#B8860B]/15 rounded-md p-5 sm:p-6 shadow-sm flex flex-col gap-4">
          <div className="flex justify-between items-center border-b border-gray-100 pb-3">
            <h2 className="font-serif text-lg font-bold text-[#1C1008] uppercase">
              Recent Purchase Enquiries
            </h2>
            <span className="text-[10px] bg-[#B8860B]/15 text-[#B8860B] font-bold px-2.5 py-1 rounded uppercase tracking-wider">
              Enquiries Ticker
            </span>
          </div>

          {ordersLoading ? (
            <div className="text-center py-12 text-sm text-gray-500">Listening to recent orders...</div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12 text-sm text-gray-400 font-serif italic bg-[#FDF8F2]/50 rounded border border-dashed border-gray-200">
              No customer orders placed yet in the system.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-[#B8860B]/10 text-gray-500 font-semibold uppercase text-[10px] tracking-wider">
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Client</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Items</th>
                    <th className="py-2.5 px-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-[#1C1008]">
                  {orders.slice(0, 8).map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="py-3 px-3 whitespace-nowrap text-gray-500">
                        {order.createdAt?.seconds 
                          ? new Date(order.createdAt.seconds * 1000).toLocaleDateString('en-IN') 
                          : 'Recent'}
                      </td>
                      <td className="py-3 px-3 font-medium">
                        {order.customerName}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                          order.status === 'pending'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : order.status === 'confirmed'
                            ? 'bg-yellow-50 text-yellow-700 border-yellow-250'
                            : order.status === 'shipped'
                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                            : 'bg-green-50 text-green-700 border-green-200'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-gray-500 truncate max-w-[140px]">
                        {order.items.map((it) => `${it.productName} (${it.color})`).join(', ')}
                      </td>
                      <td className="py-3 px-3 font-bold text-right text-[#7A1C2E]">
                        ₹{order.total.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Operations Guide panel - span 1 */}
        <div className="bg-[#E8D5B0]/30 border border-[#B8860B]/15 rounded-md p-5 sm:p-6 shadow-sm flex flex-col gap-4">
          <h2 className="font-serif text-lg font-bold text-[#1C1008] uppercase border-b border-[#B8860B]/10 pb-2">
            Admin Instructions
          </h2>
          <div className="flex flex-col gap-3.5 text-xs text-gray-600 leading-relaxed font-sans">
            <p>
              Welcome to the **KALARANG Silks & Studio Controller Suite**. Here, you have total authority over front-facing banners, active weaver categories, product inventory items, and client transactions.
            </p>
            <div className="flex flex-col gap-2 bg-[#FDF8F2] p-4 border border-[#B8860B]/10 rounded select-none">
              <strong className="text-[#1C1008] font-serif uppercase tracking-wide flex items-center gap-1.5 mb-1 text-sm bg-gold">
                <TrendingUp className="h-4 w-4 text-[#B8860B]" /> Control Guide:
              </strong>
              <p>1. **Add Saree:** Head to Product module tab and hit "Add Saree". Put the MRP, fabric details, and high-fidelity photos.</p>
              <p className="mt-1">2. **Update Status:** Mark orders as `confirmed` or `shipped` inline once you finalize details with the buyer on WhatsApp.</p>
            </div>
            <p className="text-[10px] italic text-[#7A1C2E] font-medium">
              Reminder: To trigger real-world payment, coordinate with customers directly using their provided WhatsApp number.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
