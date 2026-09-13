import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Order, OrderStatus } from '../types';
import {
  Package,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  Box,
  CreditCard,
  MapPin,
  ChevronRight,
  Printer,
  ShoppingBag,
  RotateCcw,
  XCircle,
  ExternalLink,
  ShieldCheck,
  Eye,
  X,
  FileCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; color: string; bgColor: string; icon: React.ComponentType<{ className?: string }>; stepIndex: number }
> = {
  payment_pending: {
    label: '1. Ödəniş gözlənilir',
    color: 'text-amber-600',
    bgColor: 'bg-amber-100 border-amber-300',
    icon: Clock,
    stepIndex: 1
  },
  payment_verifying: {
    label: '2. Ödəniş yoxlanılır',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100 border-blue-300',
    icon: CreditCard,
    stepIndex: 2
  },
  payment_confirmed: {
    label: '3. Ödəniş təsdiqləndi',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100 border-emerald-300',
    icon: CheckCircle2,
    stepIndex: 3
  },
  preparing: {
    label: '4. Hazırlanır',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100 border-indigo-300',
    icon: Box,
    stepIndex: 4
  },
  handed_to_courier: {
    label: '5. Kuryerə verildi',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100 border-purple-300',
    icon: Truck,
    stepIndex: 5
  },
  on_the_way: {
    label: '6. Yoldadır',
    color: 'text-orange-600',
    bgColor: 'bg-orange-100 border-orange-300',
    icon: Truck,
    stepIndex: 6
  },
  delivered: {
    label: '7. Çatdırıldı',
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-200 border-emerald-400',
    icon: CheckCircle2,
    stepIndex: 7
  },
  payment_rejected: {
    label: 'Ödəniş rədd edildi',
    color: 'text-rose-700',
    bgColor: 'bg-rose-100 border-rose-300',
    icon: XCircle,
    stepIndex: 0
  },
  cancelled: {
    label: '8. Ləğv edildi',
    color: 'text-red-600',
    bgColor: 'bg-red-100 border-red-300',
    icon: XCircle,
    stepIndex: 0
  }
};

export const OrdersView: React.FC = () => {
  const { orders, setActiveTab, setSelectedOrderId, selectedOrderId, getOrderById } = useStore();
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const selectedOrder = selectedOrderId ? getOrderById(selectedOrderId) : null;

  const filteredOrders = orders.filter((order) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'active') {
      return ['payment_pending', 'payment_verifying', 'payment_confirmed', 'preparing', 'handed_to_courier', 'on_the_way'].includes(order.status);
    }
    if (activeFilter === 'delivered') return order.status === 'delivered';
    if (activeFilter === 'cancelled') return order.status === 'cancelled' || order.status === 'payment_rejected';
    return order.status === activeFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-slate-900">
            Sifarişlərim
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Bütün aktiv və tamamlanmış sifarişlərinizin canlı izlənməsi
          </p>
        </div>
        <button
          onClick={() => setActiveTab('home')}
          className="self-start sm:self-auto px-4 py-2 bg-orange-50 hover:bg-orange-100 text-orange-600 font-bold text-xs rounded-xl border border-orange-200 transition-colors cursor-pointer"
        >
          + Yeni Məhsul Al
        </button>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-6">
        {[
          { id: 'all', label: 'Bütün Sifarişlər' },
          { id: 'active', label: '⚡ Aktiv Sifarişlər' },
          { id: 'payment_verifying', label: '💳 Ödəniş Yoxlanılır' },
          { id: 'on_the_way', label: '🚚 Yoldadır' },
          { id: 'delivered', label: '✓ Çatdırıldı' },
          { id: 'cancelled', label: '✕ Ləğv Edilmiş' }
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setActiveFilter(f.id)}
            className={`px-4 py-2 rounded-xl font-bold text-xs whitespace-nowrap transition-all cursor-pointer ${
              activeFilter === f.id
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 max-w-lg mx-auto">
          <Package className="w-16 h-16 text-slate-300 mx-auto mb-3" />
          <h3 className="font-heading font-black text-lg text-slate-900 mb-1">
            Sifariş tapılmadı
          </h3>
          <p className="text-xs text-slate-500 mb-6">
            Seçilmiş filtr üzrə heç bir sifariş mövcud deyil.
          </p>
          <button
            onClick={() => setActiveTab('home')}
            className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl cursor-pointer"
          >
            Məhsulları Kəşf Et
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const statusConfig = STATUS_CONFIG[order.status] || STATUS_CONFIG.payment_pending;
            const StatusIcon = statusConfig.icon;

            return (
              <div
                key={order.id}
                onClick={() => setSelectedOrderId(order.id)}
                className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group"
              >
                {/* Top header of order card */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center flex-shrink-0">
                      <Package className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-heading font-black text-base text-slate-900">
                          #{order.orderNumber}
                        </span>
                        <span className="text-[11px] text-slate-400">&bull; {order.createdAt}</span>
                      </div>
                      <p className="text-xs text-slate-500">
                        {order.items?.length || 0} növ məhsul &bull; Toplam:{' '}
                        <strong className="text-slate-900">{(order.total ?? 0).toFixed(2)} AZN</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black border ${statusConfig.bgColor} ${statusConfig.color}`}
                    >
                      <StatusIcon className="w-3.5 h-3.5" />
                      {statusConfig.label}
                    </span>
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-orange-600 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>

                {/* Progress Visualizer (7 active steps) */}
                {order.status !== 'cancelled' && order.status !== 'payment_rejected' && (
                  <div className="py-4">
                    <div className="relative flex items-center justify-between max-w-2xl mx-auto">
                      <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-100 -translate-y-1/2 -z-0" />
                      <div
                        className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-orange-500 to-amber-400 -translate-y-1/2 -z-0 transition-all duration-700"
                        style={{
                          width: `${Math.min(100, ((statusConfig.stepIndex - 1) / 6) * 100)}%`
                        }}
                      />

                      {[
                        { label: 'Ödəniş', step: 1 },
                        { label: 'Yoxlama', step: 2 },
                        { label: 'Təsdiq', step: 3 },
                        { label: 'Hazırlanır', step: 4 },
                        { label: 'Kuryerdə', step: 5 },
                        { label: 'Yoldadır', step: 6 },
                        { label: 'Çatdırıldı', step: 7 }
                      ].map((st) => {
                        const isDone = statusConfig.stepIndex >= st.step;
                        const isCurrent = statusConfig.stepIndex === st.step;
                        return (
                          <div key={st.step} className="flex flex-col items-center relative z-10">
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black transition-all ${
                                isCurrent
                                  ? 'bg-orange-600 text-white ring-4 ring-orange-100 scale-110'
                                  : isDone
                                  ? 'bg-emerald-500 text-white'
                                  : 'bg-slate-200 text-slate-400'
                              }`}
                            >
                              {isDone ? '✓' : st.step}
                            </div>
                            <span className="text-[10px] font-bold text-slate-500 mt-1 hidden sm:block">
                              {st.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Items preview thumbnails */}
                <div className="flex items-center gap-2 pt-3 overflow-x-auto no-scrollbar">
                  {order.items.map((it, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100 flex-shrink-0"
                    >
                      <img
                        src={it.product?.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80'}
                        alt={it.product?.title || 'Məhsul'}
                        className="w-8 h-8 rounded-lg object-cover"
                      />
                      <div className="max-w-[140px]">
                        <p className="text-[11px] font-bold text-slate-800 truncate">
                          {it.product?.title || 'Məhsul'}
                        </p>
                        <p className="text-[10px] text-slate-500">
                          {it.quantity} ədəd &bull; {it.selectedColor || ''}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrderId(null)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export const OrderDetailModal: React.FC<{ order: Order; onClose: () => void }> = ({
  order,
  onClose
}) => {
  const { updateOrderStatus, showToast } = useStore();
  const [showReceiptZoom, setShowReceiptZoom] = useState(false);
  const statusConfig = STATUS_CONFIG[order.status] || STATUS_CONFIG.payment_pending;
  const StatusIcon = statusConfig.icon;

  const handlePrint = () => {
    window.print();
    showToast('Qəbz çap üçün hazırlandı', 'info');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-slate-900 text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-orange-400" />
              <h2 className="font-heading font-black text-lg sm:text-xl">
                Sifariş #{order.orderNumber}
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">Tarix: {order.createdAt}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors cursor-pointer"
              title="Qəbzi Çap Et"
            >
              <Printer className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Bağla ✕
            </button>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {/* Current Status Badge */}
          <div className={`p-4 rounded-2xl border flex items-center justify-between ${statusConfig.bgColor}`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/80 flex items-center justify-center flex-shrink-0">
                <StatusIcon className={`w-5 h-5 ${statusConfig.color}`} />
              </div>
              <div>
                <span className="text-xs text-slate-600 font-semibold uppercase">Cari Status</span>
                <h3 className={`font-heading font-black text-base ${statusConfig.color}`}>
                  {statusConfig.label}
                </h3>
              </div>
            </div>
          </div>

          {/* Payment Receipt Box if available */}
          {order.receiptImage && (
            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-blue-900 font-bold text-xs sm:text-sm">
                  <FileCheck className="w-4 h-4 text-blue-600" />
                  <span>Əlavə Edilmiş Ödəniş Çeki</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowReceiptZoom(true)}
                  className="px-3 py-1 bg-white hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-lg border border-blue-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Çekə Tam Ölçüdə Bax
                </button>
              </div>

              <div
                onClick={() => setShowReceiptZoom(true)}
                className="relative group w-32 h-24 rounded-xl overflow-hidden bg-slate-900 border border-blue-200 cursor-pointer"
              >
                <img
                  src={order.receiptImage}
                  alt="Ödəniş çeki"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform opacity-90 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold">
                  Böyüt 🔍
                </div>
              </div>
            </div>
          )}

          {/* Tracking History Timeline */}
          <div>
            <h4 className="font-heading font-black text-sm text-slate-900 mb-3 flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-orange-600" /> Canlı Çatdırılma Hadisələri
            </h4>
            <div className="space-y-4 border-l-2 border-orange-300 ml-4 pl-4">
              {order.trackingEvents.map((ev, i) => (
                <div key={i} className="relative">
                  <div className="absolute -left-[23px] top-1 w-3.5 h-3.5 rounded-full bg-orange-600 ring-4 ring-orange-100" />
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-bold text-slate-900">{ev.title}</h5>
                    <span className="text-[10px] text-slate-400 font-mono">{ev.time}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">{ev.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Ordered Products Table */}
          <div>
            <h4 className="font-heading font-black text-sm text-slate-900 mb-3 flex items-center gap-1.5">
              <ShoppingBag className="w-4 h-4 text-orange-600" /> Məhsul Detalları
            </h4>
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 divide-y divide-slate-200">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.product?.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80'}
                      alt={item.product?.title || 'Məhsul'}
                      className="w-14 h-14 rounded-xl object-cover bg-white"
                    />
                    <div>
                      <h5 className="text-xs font-bold text-slate-900 line-clamp-1">
                        {item.product?.title || 'Məhsul'}
                      </h5>
                      <p className="text-[11px] text-slate-500">
                        {item.selectedColor ? `Rəng: ${item.selectedColor}` : ''}{' '}
                        {item.selectedSize ? `• Ölçü: ${item.selectedSize}` : ''}
                      </p>
                      <span className="text-xs text-slate-600">
                        {item.quantity} ədəd &times; {(item.product?.price ?? 0).toFixed(2)} AZN
                      </span>
                    </div>
                  </div>
                  <span className="font-heading font-black text-sm text-slate-900">
                    {(((item.product?.price ?? 0) * (item.quantity ?? 1))).toFixed(2)} AZN
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery & Customer Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1 text-xs">
              <h5 className="font-bold text-slate-900 flex items-center gap-1 mb-2">
                <MapPin className="w-4 h-4 text-orange-600" /> Çatdırılma Məlumatları
              </h5>
              <p>
                <strong className="text-slate-700">Müştəri:</strong> {order.customerInfo.fullName}
              </p>
              <p>
                <strong className="text-slate-700">Telefon:</strong> {order.customerInfo.phone}
              </p>
              <p>
                <strong className="text-slate-700">Ünvan:</strong> {order.customerInfo.city}, {order.customerInfo.address}
              </p>
              {order.customerInfo.notes && (
                <p>
                  <strong className="text-slate-700">Qeyd:</strong> {order.customerInfo.notes}
                </p>
              )}
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5 text-xs">
              <h5 className="font-bold text-slate-900 flex items-center gap-1 mb-2">
                <CreditCard className="w-4 h-4 text-orange-600" /> Ödəniş və Hesab
              </h5>
              <div className="flex justify-between text-slate-600">
                <span>Cəmi:</span>
                <span>{(order.subtotal ?? 0).toFixed(2)} AZN</span>
              </div>
              {(order.discount ?? 0) > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Endirim:</span>
                  <span>-{(order.discount ?? 0).toFixed(2)} AZN</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Çatdırılma:</span>
                <span>{order.deliveryFee === 0 ? 'PULSUZ' : `${(order.deliveryFee ?? 0).toFixed(2)} AZN`}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline font-heading font-black text-base text-slate-900">
                <span>Yekun Ödəniş:</span>
                <span className="text-orange-600">{(order.total ?? 0).toFixed(2)} AZN</span>
              </div>
            </div>
          </div>
        </div>

        {/* Receipt Fullscreen Zoom Modal */}
        {showReceiptZoom && order.receiptImage && (
          <div className="fixed inset-0 z-60 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-5 shadow-2xl space-y-3 max-h-[90vh] flex flex-col">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h4 className="font-heading font-black text-sm text-slate-900">
                  Ödəniş Çeki: #{order.orderNumber}
                </h4>
                <button
                  onClick={() => setShowReceiptZoom(false)}
                  className="p-1.5 hover:bg-slate-100 text-slate-600 rounded-xl transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-auto flex items-center justify-center bg-slate-900 rounded-2xl p-2 min-h-[300px]">
                <img
                  src={order.receiptImage}
                  alt="Ödəniş çeki böyüdülmüş"
                  className="max-h-[65vh] w-auto max-w-full object-contain rounded-lg"
                />
              </div>
              <div className="flex justify-end pt-1">
                <button
                  onClick={() => setShowReceiptZoom(false)}
                  className="px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl cursor-pointer"
                >
                  Bağla
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
