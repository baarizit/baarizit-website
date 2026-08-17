import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { PaymentMethod } from '../../types';
import {
  ShieldCheck,
  CheckCircle2,
  Truck,
  CreditCard,
  Building,
  Smartphone,
  Banknote,
  Printer,
  ShoppingBag,
  ArrowLeft,
  Lock,
  Tag,
  Copy,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const CheckoutView: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    cartTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    createOrder,
    setActivePage,
    addToast,
    settings,
  } = useStore();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [city, setCity] = useState('Savar, Dhaka');
  const [postalCode, setPostalCode] = useState('1340');
  const [orderNotes, setOrderNotes] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<'savar_pickup' | 'home_delivery'>('home_delivery');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [transactionId, setTransactionId] = useState('');
  const [senderNumber, setSenderNumber] = useState('');
  const [couponCodeInput, setCouponCodeInput] = useState('');

  // Order Success Screen State
  const [confirmedOrderId, setConfirmedOrderId] = useState<string | null>(null);

  if (cart.length === 0 && !confirmedOrderId) {
    return (
      <div className="py-24 text-center text-zinc-400 max-w-md mx-auto px-4">
        <ShoppingBag className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-zinc-100 font-tech">Your Cart is Empty</h2>
        <p className="text-xs text-zinc-400 mt-2">Add components or laptops from our catalog before checking out.</p>
        <button
          onClick={() => setActivePage('shop')}
          className="mt-6 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs shadow-md transition-colors"
        >
          Browse Products
        </button>
      </div>
    );
  }

  // Invoice Receipt Screen
  if (confirmedOrderId) {
    return (
      <div className="py-12 bg-zinc-950 min-h-screen">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="p-8 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-2xl printable-receipt">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20 mb-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Order Placed Successfully</span>
                </div>
                <h1 className="text-2xl font-black text-white font-tech">
                  BAARIZ <span className="text-emerald-400">IT</span> Invoice
                </h1>
                <p className="text-xs text-zinc-400 mt-0.5">Order Reference: #{confirmedOrderId}</p>
              </div>

              <div className="text-right text-xs text-zinc-400">
                <p className="font-semibold text-zinc-200">Shop A/23, 3rd Floor</p>
                <p>National Blind Welfare Complex, Savar</p>
                <p className="text-emerald-400 font-bold">Hotline: {settings.phone}</p>
              </div>
            </div>

            {/* Customer & Shipping Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-6 border-b border-zinc-800 text-xs">
              <div>
                <span className="font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                  Billed To:
                </span>
                <p className="text-zinc-100 font-semibold">{customerName}</p>
                <p className="text-zinc-400">{customerPhone}</p>
                {customerEmail && <p className="text-zinc-400">{customerEmail}</p>}
              </div>

              <div>
                <span className="font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                  Delivery Details:
                </span>
                <p className="text-zinc-300">
                  {deliveryMethod === 'savar_pickup'
                    ? 'In-Store Pickup (Shop A/23, 3rd Floor, Savar)'
                    : shippingAddress}
                </p>
                <p className="text-zinc-400">{city} - {postalCode}</p>
                <p className="text-emerald-400 font-medium capitalize">
                  Payment: {paymentMethod.toUpperCase()} {transactionId ? `(Trx: ${transactionId})` : ''}
                </p>
              </div>
            </div>

            {/* Items Summary Table */}
            <div className="py-6 border-b border-zinc-800">
              <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-wider mb-3">
                Purchased Items & Warranty
              </h3>
              <div className="space-y-3">
                {cart.map((item) => {
                  const effPrice = item.product.discountPrice || item.product.regularPrice;
                  return (
                    <div
                      key={item.product.id}
                      className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-emerald-400 font-bold">{item.quantity}x</span>
                        <div>
                          <p className="font-semibold text-zinc-200">{item.product.name}</p>
                          <p className="text-[10px] text-zinc-500 font-mono">
                            SKU: {item.product.sku} | Warranty: {item.product.warranty}
                          </p>
                        </div>
                      </div>
                      <span className="font-tech font-bold text-zinc-100">
                        ৳{(effPrice * item.quantity).toLocaleString('en-BD')}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Total Calculation */}
            <div className="py-6 border-b border-zinc-800 space-y-2 text-xs text-zinc-300">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-mono">৳{cartSubtotal.toLocaleString('en-BD')}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-emerald-400">
                  <span>Coupon Discount ({appliedCoupon.code}):</span>
                  <span className="font-mono">
                    -৳
                    {(appliedCoupon.type === 'fixed'
                      ? appliedCoupon.discountValue
                      : (cartSubtotal * appliedCoupon.discountValue) / 100
                    ).toLocaleString('en-BD')}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery Charge:</span>
                <span className="text-emerald-400 font-medium">Free / Included</span>
              </div>
              <div className="flex justify-between text-base font-bold text-emerald-400 pt-2 border-t border-zinc-800">
                <span>Total Amount Paid / Due:</span>
                <span className="font-tech text-xl">৳{cartTotal.toLocaleString('en-BD')}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-wrap gap-4 justify-between items-center no-print">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-semibold text-xs border border-zinc-700 transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4 text-emerald-400" />
                <span>Print Invoice Receipt</span>
              </button>

              <button
                onClick={() => {
                  setConfirmedOrderId(null);
                  setActivePage('home');
                }}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs shadow-md transition-colors cursor-pointer"
              >
                <span>Continue Shopping</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;
    const ok = applyCoupon(couponCodeInput.trim());
    if (ok) setCouponCodeInput('');
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) {
      addToast('warning', 'Missing Details', 'Please provide your full name and phone number.');
      return;
    }

    if (deliveryMethod === 'home_delivery' && !shippingAddress.trim()) {
      addToast('warning', 'Address Required', 'Please enter your shipping address.');
      return;
    }

    if ((paymentMethod === 'bkash' || paymentMethod === 'nagad') && !transactionId.trim()) {
      addToast('warning', 'Transaction ID Required', `Please enter the ${paymentMethod.toUpperCase()} TrxID.`);
      return;
    }

    const newOrder = createOrder({
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerEmail: customerEmail.trim() || undefined,
      shippingAddress:
        deliveryMethod === 'savar_pickup'
          ? 'In-Store Pickup (Shop A/23, 3rd Floor, Savar Shopping Complex)'
          : shippingAddress.trim(),
      city: city.trim(),
      postalCode: postalCode.trim(),
      paymentMethod,
      transactionId: transactionId.trim() || undefined,
      notes: orderNotes.trim() || undefined,
    });

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });

    setConfirmedOrderId(newOrder.id);
  };

  return (
    <section className="py-12 bg-zinc-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-zinc-800 mb-8">
          <div>
            <button
              onClick={() => setActivePage('shop')}
              className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-emerald-400 mb-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Store</span>
            </button>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-100 font-tech">
              Secure Checkout
            </h1>
          </div>
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold bg-emerald-950/30 border border-emerald-500/20 px-3 py-1.5 rounded-full">
            <Lock className="w-3.5 h-3.5" />
            <span>256-Bit Encrypted Order</span>
          </div>
        </div>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Form: Customer & Delivery Details + Payment Method (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            {/* Step 1: Customer Information */}
            <div className="p-6 rounded-3xl bg-zinc-900/60 border border-zinc-800 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-zinc-800 text-sm font-bold text-zinc-100 font-tech">
                <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs">
                  1
                </span>
                <span>Customer & Contact Information</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Shakil Mahmud"
                    className="w-full bg-zinc-950 text-xs text-zinc-100 rounded-xl px-3.5 py-2.5 border border-zinc-800 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Mobile Phone (BD) *</label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="e.g. 017XXXXXXXX"
                    className="w-full bg-zinc-950 text-xs text-zinc-100 rounded-xl px-3.5 py-2.5 border border-zinc-800 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Email (Optional)</label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="For invoice copy..."
                  className="w-full bg-zinc-950 text-xs text-zinc-100 rounded-xl px-3.5 py-2.5 border border-zinc-800 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Step 2: Shipping & Delivery Choice */}
            <div className="p-6 rounded-3xl bg-zinc-900/60 border border-zinc-800 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-zinc-800 text-sm font-bold text-zinc-100 font-tech">
                <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs">
                  2
                </span>
                <span>Delivery Option & Address</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  onClick={() => setDeliveryMethod('home_delivery')}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    deliveryMethod === 'home_delivery'
                      ? 'bg-emerald-950/20 border-emerald-500 text-emerald-300'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-xs text-zinc-100">
                    <Truck className="w-4 h-4 text-emerald-400" />
                    <span>Home / Office Delivery</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-1">
                    Delivered via express courier across Savar & Bangladesh.
                  </p>
                </div>

                <div
                  onClick={() => setDeliveryMethod('savar_pickup')}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    deliveryMethod === 'savar_pickup'
                      ? 'bg-emerald-950/20 border-emerald-500 text-emerald-300'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-xs text-zinc-100">
                    <Building className="w-4 h-4 text-emerald-400" />
                    <span>Direct Store Pickup</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-1">
                    Pick up from Shop A/23, 3rd Floor, Savar Bus Stand.
                  </p>
                </div>
              </div>

              {deliveryMethod === 'home_delivery' && (
                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">Full Shipping Address *</label>
                    <textarea
                      rows={2}
                      required
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      placeholder="e.g. House 14, Road 3, Block B, Savar, Dhaka"
                      className="w-full bg-zinc-950 text-xs text-zinc-100 rounded-xl p-3 border border-zinc-800 focus:border-emerald-500 focus:outline-none resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">City / District</label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full bg-zinc-950 text-xs text-zinc-100 rounded-xl px-3 py-2 border border-zinc-800"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">Postal Code</label>
                      <input
                        type="text"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        className="w-full bg-zinc-950 text-xs text-zinc-100 rounded-xl px-3 py-2 border border-zinc-800"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Order Notes (Optional)</label>
                <input
                  type="text"
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  placeholder="e.g. Please install Windows 11 on SSD or call before delivery"
                  className="w-full bg-zinc-950 text-xs text-zinc-100 rounded-xl px-3.5 py-2.5 border border-zinc-800 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Step 3: Payment Method Selection */}
            <div className="p-6 rounded-3xl bg-zinc-900/60 border border-zinc-800 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-zinc-800 text-sm font-bold text-zinc-100 font-tech">
                <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs">
                  3
                </span>
                <span>Choose Payment Method</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Cash on Delivery */}
                <div
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'cod'
                      ? 'bg-emerald-950/30 border-emerald-500 text-emerald-300 shadow-md'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-300'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-xs">
                    <Banknote className="w-4 h-4 text-emerald-400" />
                    <span>Cash on Delivery (COD)</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-1">
                    Pay in cash when you receive and inspect hardware.
                  </p>
                </div>

                {/* bKash */}
                <div
                  onClick={() => setPaymentMethod('bkash')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'bkash'
                      ? 'bg-pink-950/30 border-pink-500 text-pink-300 shadow-md'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-300'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-xs">
                    <Smartphone className="w-4 h-4 text-pink-400" />
                    <span>bKash Payment / Send Money</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-1">
                    Instant wallet transfer to 01622615188.
                  </p>
                </div>

                {/* Nagad */}
                <div
                  onClick={() => setPaymentMethod('nagad')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'nagad'
                      ? 'bg-amber-950/30 border-amber-500 text-amber-300 shadow-md'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-300'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-xs">
                    <Smartphone className="w-4 h-4 text-amber-400" />
                    <span>Nagad Payment</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-1">
                    Send Money / Payment to 01622615188.
                  </p>
                </div>

                {/* Bank Transfer */}
                <div
                  onClick={() => setPaymentMethod('bank_transfer')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'bank_transfer'
                      ? 'bg-cyan-950/30 border-cyan-500 text-cyan-300 shadow-md'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-300'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-xs">
                    <Building className="w-4 h-4 text-cyan-400" />
                    <span>Bank Transfer / RTGS</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-1">
                    Direct account deposit (Bank Asia / City Bank).
                  </p>
                </div>
              </div>

              {/* bKash / Nagad payment instructions */}
              {(paymentMethod === 'bkash' || paymentMethod === 'nagad') && (
                <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
                  <div className="text-xs text-zinc-300 leading-relaxed">
                    <strong className="text-emerald-400 font-mono">Step 1:</strong> Send ৳
                    {cartTotal.toLocaleString('en-BD')} to BAARIZ IT official {paymentMethod.toUpperCase()}{' '}
                    number: <strong className="text-white font-mono">01622615188</strong> (Personal/Merchant).
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">
                        Your {paymentMethod.toUpperCase()} Number
                      </label>
                      <input
                        type="tel"
                        value={senderNumber}
                        onChange={(e) => setSenderNumber(e.target.value)}
                        placeholder="e.g. 017XXXXXXXX"
                        className="w-full bg-zinc-900 text-xs text-zinc-100 rounded-xl px-3 py-2 border border-zinc-800"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">
                        Transaction ID (TrxID) *
                      </label>
                      <input
                        type="text"
                        required
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                        placeholder="e.g. 9J56K7LP8"
                        className="w-full bg-zinc-900 text-xs text-zinc-100 rounded-xl px-3 py-2 border border-zinc-800 uppercase font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Bank Transfer Instructions */}
              {paymentMethod === 'bank_transfer' && (
                <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 space-y-1">
                  <p><strong className="text-zinc-100">Bank Name:</strong> Bank Asia Limited</p>
                  <p><strong className="text-zinc-100">Account Name:</strong> BAARIZ IT</p>
                  <p><strong className="text-zinc-100">Account Number:</strong> 038340029184</p>
                  <p><strong className="text-zinc-100">Branch:</strong> Savar Branch, Dhaka</p>
                  <div className="mt-3">
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                      Bank Deposit / Transfer Reference *
                    </label>
                    <input
                      type="text"
                      required
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      placeholder="e.g. Deposit Slip No / BEFTN Ref"
                      className="w-full bg-zinc-900 text-xs text-zinc-100 rounded-xl px-3 py-2 border border-zinc-800"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Summary: Order Items, Coupons & Place Order (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-3xl bg-zinc-900/80 border border-zinc-800 shadow-xl space-y-5">
              <h3 className="text-sm font-bold text-zinc-100 font-tech uppercase tracking-wide border-b border-zinc-800 pb-3">
                Order Items ({cart.length})
              </h3>

              {/* Items List */}
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {cart.map((item) => {
                  const effPrice = item.product.discountPrice || item.product.regularPrice;
                  return (
                    <div key={item.product.id} className="flex items-center justify-between text-xs gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={item.product.mainImage}
                          alt={item.product.name}
                          className="w-10 h-10 rounded-lg object-cover bg-zinc-950 border border-zinc-800 shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-semibold text-zinc-200 truncate">{item.product.name}</p>
                          <span className="text-[10px] text-zinc-500 font-mono">Qty: {item.quantity}</span>
                        </div>
                      </div>
                      <span className="font-bold text-emerald-400 font-tech shrink-0">
                        ৳{(effPrice * item.quantity).toLocaleString('en-BD')}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Coupon Code Section */}
              <div className="pt-3 border-t border-zinc-800">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCodeInput}
                    onChange={(e) => setCouponCodeInput(e.target.value)}
                    placeholder="Coupon (e.g. BAARIZ1000)"
                    className="flex-1 bg-zinc-950 text-xs text-zinc-100 rounded-xl px-3 py-2 border border-zinc-800 uppercase font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold"
                  >
                    Apply
                  </button>
                </div>
              </div>

              {/* Price Calculation Table */}
              <div className="space-y-2 text-xs text-zinc-300 pt-3 border-t border-zinc-800">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-mono">৳{cartSubtotal.toLocaleString('en-BD')}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Coupon ({appliedCoupon.code}):</span>
                    <span className="font-mono">
                      -৳
                      {(appliedCoupon.type === 'fixed'
                        ? appliedCoupon.discountValue
                        : (cartSubtotal * appliedCoupon.discountValue) / 100
                      ).toLocaleString('en-BD')}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery Charge:</span>
                  <span className="text-emerald-400 font-medium">Free</span>
                </div>
                <div className="flex justify-between text-base font-bold text-emerald-400 pt-2 border-t border-zinc-800">
                  <span>Grand Total:</span>
                  <span className="font-tech text-xl">৳{cartTotal.toLocaleString('en-BD')}</span>
                </div>
              </div>

              {/* Place Order CTA Button */}
              <button
                id="place-order-submit-btn"
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-sm shadow-lg shadow-emerald-950/60 transition-all cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm & Place Order</span>
              </button>

              <div className="text-[10px] text-center text-zinc-500">
                Official shop warranty applies to all items. Our Savar support center is available at 01622615188.
              </div>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};
