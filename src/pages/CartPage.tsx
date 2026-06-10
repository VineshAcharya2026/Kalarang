import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag, Plus, Minus, FileText, Send, ArrowLeft, CheckCircle2, PhoneCall } from 'lucide-react';
import { motion } from 'motion/react';
import { useCartStore } from '../store/cartStore';
import { useSettings } from '../hooks/useSettings';
import { useOrders } from '../hooks/useOrders';
import AnnouncementBar from '../components/layout/AnnouncementBar';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

export default function CartPage() {
  const { items, total, updateQty, removeItem, clearCart } = useCartStore();
  const { settings, loading: settingsLoading } = useSettings();
  const { addOrder } = useOrders();

  // Checkout Form State
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [notes, setNotes] = useState('');

  // UI state
  const [submitting, setSubmitting] = useState(false);
  const [successOrderId, setSuccessOrderId] = useState<string | null>(null);

  if (settingsLoading) {
    return (
      <div className="min-h-screen bg-[#FDF8F2] flex flex-col justify-between">
        <AnnouncementBar />
        <Navbar />
        <div className="flex-grow flex items-center justify-center p-8">
          <div className="text-center">
            <div className="w-10 h-10 border-4 border-[#B8860B] border-t-transparent rounded-full animate-spin mb-4 mx-auto" />
            <p className="font-serif italic text-base text-[#1C1008]">Assembling your shopping bag contents...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Calculate Shipping charges
  const freeThreshold = settings?.freeShippingThreshold || 5000;
  const shippingCharges = total >= freeThreshold ? 0 : 200;
  const grandTotal = total + shippingCharges;

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    if (!customerName || !phone || !address || !pincode) {
      alert('Please fill out all required fields to complete your saree enquiry order.');
      return;
    }

    if (phone.replace(/[^0-9]/g, '').length < 10) {
      alert('Please enter a valid 10-digit telephone contact number.');
      return;
    }

    setSubmitting(true);

    try {
      // 1. Compile order dataset matched strictly to schema
      const orderPayload = {
        customerName,
        phone,
        address,
        pincode,
        notes: notes || '',
        items: items.map(item => ({
          productId: item.productId,
          productName: item.productName,
          color: item.color,
          image: item.image || '',
          qty: item.qty,
          price: item.price,
        })),
        total: grandTotal,
      };

      // 2. Add into Firestore doc
      const orderId = await addOrder(orderPayload);
      
      if (orderId) {
        setSuccessOrderId(orderId);

        // 3. Compile beautiful WhatsApp receipt summary
        const cleanStoreNumber = settings.whatsappNumber.replace(/[^0-9]/g, '');
        const itemsSummary = items.map((itm, idx) => {
          return `${idx + 1}. ${itm.productName} (${itm.color}) x${itm.qty} - ₹${(itm.price * itm.qty).toLocaleString('en-IN')}`;
        }).join('\n');

        const messageText = `Hi KALARANG! 🌸\nI have placed a Saree Enquiry Order from your online boutique!\n\n🛍️ *ORDER ID:* ${orderId}\n👤 *Customer Name:* ${customerName}\n📞 *Phone:* ${phone}\n📍 *Delivery Address:* ${address}, Pincode: ${pincode}\n📝 *Notes:* ${notes || 'None'}\n\n*SAREES SELECTED:*\n${itemsSummary}\n\n*SUMMARY:*\nSubtotal: ₹${total.toLocaleString('en-IN')}\nShipping: ${shippingCharges === 0 ? 'FREE' : `₹${shippingCharges}`}\n*Estimated Grand Total: ₹${grandTotal.toLocaleString('en-IN')}*\n\nPlease confirm availability and details to trigger payment/shipment! 🙏`;

        // 4. Redirect on WA in popup tab
        window.open(`https://wa.me/${cleanStoreNumber}?text=${encodeURIComponent(messageText)}`, '_blank');

        // 5. Purge Zustand shopping cart
        clearCart();
      }
    } catch (err) {
      console.error('Order reservation failure:', err);
      alert('Encountered an order creation error. Please try again or contact us directly on WhatsApp.');
    } finally {
      setSubmitting(false);
    }
  };

  // SUCCESS COMPLETION receipt view
  if (successOrderId) {
    return (
      <div id="cart-checkout-success" className="min-h-screen bg-[#FDF8F2] flex flex-col justify-between">
        <AnnouncementBar />
        <Navbar />

        <div className="flex-grow flex items-center justify-center p-6 md:p-12">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#FDF8F2] border-2 border-[#B8860B] rounded-lg max-w-xl w-full p-8 text-center shadow-xl flex flex-col gap-5 items-center"
          >
            <CheckCircle2 className="h-16 w-16 text-green-700" />
            
            <div className="flex flex-col gap-1">
              <h2 className="font-serif text-2xl sm:text-3xl text-[#1C1008] font-bold tracking-wide uppercase">
                Enquiry Received!
              </h2>
              <span className="text-xs font-sans text-[#B8860B] tracking-widest font-semibold uppercase">
                Tradition In Process
              </span>
            </div>

            <p className="font-serif text-sm sm:text-base text-gray-600 italic max-w-md">
              "We appreciate your order. A designer has received your saree inquiry and will verify loom availability instantly."
            </p>

            <div className="bg-[#E8D5B0]/30 border border-[#B8860B]/10 w-full p-4 rounded text-left font-sans text-xs sm:text-sm flex flex-col gap-2 text-gray-700">
              <p>
                <strong>Order Reference ID:</strong> <code className="text-[#7A1C2E] uppercase select-all font-bold">{successOrderId}</code>
              </p>
              <p>
                <strong>Recipient Client:</strong> {customerName}
              </p>
              <p>
                <strong>Contact Number:</strong> {phone}
              </p>
              <p>
                <strong>Delivery Address:</strong> {address}, {pincode}
              </p>
            </div>

            <div className="w-full flex flex-col gap-3 mt-4">
              <button
                onClick={() => {
                  const cleanStoreNumber = settings.whatsappNumber.replace(/[^0-9]/g, '');
                  const quickMsg = `Hi KALARANG! I'm verifying the status for my Saree Order ID: ${successOrderId}. Thank you!`;
                  window.open(`https://wa.me/${cleanStoreNumber}?text=${encodeURIComponent(quickMsg)}`, '_blank');
                }}
                className="inline-flex items-center justify-center gap-2 bg-green-700 hover:bg-green-800 text-white rounded font-sans text-xs tracking-wider uppercase font-bold py-3 px-6 cursor-pointer"
              >
                <PhoneCall className="h-4 w-4" /> Ping Us Again On WhatsApp
              </button>

              <Link
                to="/collections/all"
                className="inline-flex items-center justify-center gap-2 bg-[#1C1008] text-[#FDF8F2] hover:bg-[#7A1C2E] rounded font-sans text-xs tracking-wider uppercase font-bold py-3 px-6 transition-all"
              >
                Continue Browsing Sarees
              </Link>
            </div>

          </motion.div>
        </div>

        <Footer />
      </div>
    );
  }

  return (
    <div id="shopping-cart-page" className="min-h-screen flex flex-col bg-[#FDF8F2]">
      <AnnouncementBar />
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 flex-grow w-full">
        <h1 className="font-serif text-3xl text-[#1C1008] uppercase tracking-wide font-bold mb-8">
          Your Shopping Bag
        </h1>

        {items.length === 0 ? (
          /* EMPTY CART VIEW */
          <div className="text-center py-24 border border-dashed border-[#B8860B]/20 rounded-md bg-[#FDF8F2]/40 max-w-lg mx-auto p-4 flex flex-col gap-4 items-center">
            <ShoppingBag className="h-12 w-12 text-[#B8860B] animate-bounce" />
            <div>
              <p className="font-serif text-lg text-[#1C1008] italic">
                Your shopping bag is currently empty.
              </p>
              <p className="font-sans text-xs text-gray-500 mt-1 max-w-xs">
                Explore our classical Banarasi, Russia Katan Silk, and Paper Silk collections to select your desired pieces.
              </p>
            </div>
            <Link
              to="/collections/all"
              className="mt-2 inline-flex Hero details bg-[#7A1C2E] hover:bg-[#1C1008] text-white py-3 px-7 rounded text-xs font-sans tracking-widest font-bold uppercase transition-all"
            >
              Explore Saree Collections
            </Link>
          </div>
        ) : (
          /* ACTIVE SHOPPING BAG & CHECKOUT FORM GRID */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Items Column (8 span) */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              <div className="bg-[#FDF8F2] border border-[#B8860B]/15 rounded-md divide-y divide-[#B8860B]/10 overflow-hidden shadow-sm">
                
                {items.map((item) => (
                  <div key={`${item.productId}-${item.color}`} className="p-4 flex gap-4 sm:gap-6 items-center flex-col sm:flex-row">
                    {/* Item Image */}
                    <div className="w-20 sm:w-24 aspect-[3/4] bg-[#E8D5B0]/30 overflow-hidden rounded border border-[#B8860B]/10 shrink-0">
                      <img
                        src={item.image || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=200&q=80'}
                        alt={item.productName}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Item parameters description */}
                    <div className="flex-grow flex flex-col gap-1 text-center sm:text-left w-full sm:w-auto">
                      <h3 className="font-serif text-base text-[#1C1008] font-bold leading-snug">
                        {item.productName}
                      </h3>
                      <p className="font-sans text-xs text-gray-500 flex items-center justify-center sm:justify-start gap-1">
                        Selected Color: <strong className="text-[#1C1008]">{item.color}</strong>
                      </p>
                      
                      {/* Pricing block */}
                      <p className="font-sans text-sm font-semibold text-[#7A1C2E] mt-1.5">
                        ₹{item.price.toLocaleString('en-IN')} <span className="text-xs text-gray-400 font-normal">per item</span>
                      </p>
                    </div>

                    {/* Steppers & Delete controls */}
                    <div className="flex items-center justify-between sm:justify-end gap-x-6 w-full sm:w-auto border-t sm:border-0 pt-3 sm:pt-0 border-gray-100">
                      {/* Stepper Buttons */}
                      <div className="flex items-center border border-[#B8860B]/25 rounded bg-[#FDF8F2]">
                        <button
                          onClick={() => updateQty(item.productId, item.color, item.qty - 1)}
                          className="px-2.5 py-1.5 text-gray-500 hover:text-[#7A1C2E]"
                          title="Reduce quantity"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="px-3 py-1 font-sans text-sm font-medium text-[#1C1008]">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => updateQty(item.productId, item.color, item.qty + 1)}
                          className="px-2.5 py-1.5 text-gray-500 hover:text-[#7A1C2E]"
                          title="Increase quantity"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      {/* Trash Delete symbol */}
                      <button
                        onClick={() => removeItem(item.productId, item.color)}
                        className="text-gray-400 hover:text-red-600 p-2 rounded hover:bg-red-50 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="h-4.5 w-4.5" />
                      </button>
                    </div>
                  </div>
                ))}

              </div>

              {/* Back to catalog button */}
              <div>
                <Link
                  to="/collections/all"
                  className="inline-flex items-center gap-1.5 text-xs font-sans font-bold tracking-wider text-[#7A1C2E] hover:text-[#B8860B] uppercase"
                >
                  <ArrowLeft className="h-4 w-4" /> &larr; Back to Saree Catalog
                </Link>
              </div>
            </div>

            {/* Right Summary & Address Form Column (5 span) */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              
              {/* Checkout Form Card */}
              <div className="bg-[#FDF8F2] border-2 border-[#B8860B]/35 rounded-md p-5 sm:p-6 shadow-md flex flex-col gap-4">
                <h2 className="font-serif text-lg font-bold text-[#1C1008] uppercase border-b border-[#B8860B]/10 pb-2 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-[#B8860B]" /> Delivery details
                </h2>

                <form onSubmit={handleCheckoutSubmit} className="flex flex-col gap-3.5 font-sans">
                  
                  {/* Customer name */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[#1C1008] uppercase tracking-wider">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Enter your full name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="bg-[#FDF8F2] border border-[#B8860B]/25 rounded px-3.5 py-2.5 text-sm text-[#1C1008] focus:border-[#7A1C2E] focus:outline-none"
                    />
                  </div>

                  {/* Customer phone contact */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[#1C1008] uppercase tracking-wider">
                      WhatsApp Contact Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="10-digit mobile number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="bg-[#FDF8F2] border border-[#B8860B]/25 rounded px-3.5 py-2.5 text-sm text-[#1C1008] focus:border-[#7A1C2E] focus:outline-none"
                    />
                    <span className="text-[10px] text-gray-500 mt-0.5">
                      Used to coordinate shipment updates on WhatsApp directly.
                    </span>
                  </div>

                  {/* Customer delivery address */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[#1C1008] uppercase tracking-wider">
                      Shipping Address <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Enter house, street, landmark, city, and state details"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="bg-[#FDF8F2] border border-[#B8860B]/25 rounded px-3.5 py-2.5 text-sm text-[#1C1008] focus:border-[#7A1C2E] focus:outline-none resize-none"
                    />
                  </div>

                  {/* ZIP code Pincode */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[#1C1008] uppercase tracking-wider">
                      Pincode <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="6-digit PIN code"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      className="bg-[#FDF8F2] border border-[#B8860B]/25 rounded px-3.5 py-2.5 text-sm text-[#1C1008] focus:border-[#7A1C2E] focus:outline-none"
                    />
                  </div>

                  {/* Optional notes */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[#1C1008] uppercase tracking-wider">
                      Special Loom Request Notes (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. customized gift wrapping"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="bg-[#FDF8F2] border border-[#B8860B]/25 rounded px-3.5 py-2.5 text-sm text-[#1C1008] focus:border-[#7A1C2E] focus:outline-none"
                    />
                  </div>

                  <hr className="border-[#B8860B]/10 my-1" />

                  {/* Calculations receipts summary layout */}
                  <div className="text-sm font-sans flex flex-col gap-2.5 text-gray-700 bg-[#E8D5B0]/20 p-4 border border-[#B8860B]/10 rounded mb-1">
                    <div className="flex justify-between">
                      <span>Items Subtotal:</span>
                      <span>₹{total.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Loom Shipping Fee:</span>
                      <span>
                        {shippingCharges === 0 ? (
                          <strong className="text-green-700 uppercase">Free</strong>
                        ) : (
                          `₹${shippingCharges}`
                        )}
                      </span>
                    </div>
                    {shippingCharges > 0 && (
                      <span className="text-[10px] text-[#B8860B] font-bold text-right -mt-1.5">
                        Add ₹{(freeThreshold - total).toLocaleString('en-IN')} more for free custom shipping!
                      </span>
                    )}
                    <hr className="border-dashed border-gray-300" />
                    <div className="flex justify-between text-base font-bold text-[#1C1008]">
                      <span>Grand Total:</span>
                      <span className="text-[#7A1C2E]">₹{grandTotal.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  {/* Submit CTA */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-[#7A1C2E] hover:bg-[#1C1008] text-white py-4 px-4 rounded text-xs tracking-wider uppercase font-extrabold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow shadow-lg hover:shadow-xl"
                  >
                    {submitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin shrink-0" />
                        Routing Studio Order...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 shrink-0" /> Place Order & Complete On WhatsApp
                      </>
                    )}
                  </button>

                  <p className="text-[10px] text-center text-gray-500 mt-1 leading-normal italic">
                    Submitting saves order safely to our catalog cloud, and launches WhatsApp text thread checkout immediately.
                  </p>

                </form>
              </div>

            </div>

          </div>
        )}

      </div>

      <Footer />
    </div>
  );
}
