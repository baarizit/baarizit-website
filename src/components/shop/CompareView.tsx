import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Scale, Trash2, ShoppingCart, ArrowLeft, Star, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const CompareView: React.FC = () => {
  const {
    compareList,
    removeFromCompare,
    clearCompare,
    addToCart,
    openProductDetail,
    setActivePage,
  } = useStore();

  if (compareList.length === 0) {
    return (
      <section className="py-20 bg-zinc-950 min-h-[70vh] flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto mb-4 text-cyan-400">
            <Scale className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-zinc-100 font-tech">No Products to Compare</h2>
          <p className="text-xs text-zinc-400 mt-2">
            Click the compare button on any product card to compare technical specs and pricing side-by-side.
          </p>
          <button
            onClick={() => setActivePage('shop')}
            className="mt-6 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs shadow-md transition-colors"
          >
            Browse Products
          </button>
        </div>
      </section>
    );
  }

  // Extract all specification keys
  const allSpecKeys: string[] = Array.from(
    new Set(compareList.flatMap((p) => Object.keys(p.specifications || {})))
  );

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
              Product Comparison ({compareList.length}/4)
            </h1>
          </div>

          <button
            onClick={clearCompare}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-rose-400 border border-rose-500/30 text-xs font-semibold"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear Comparison</span>
          </button>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto rounded-3xl border border-zinc-800 bg-zinc-900/60 shadow-2xl">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-950/80">
                <th className="p-4 w-48 text-zinc-400 font-semibold uppercase tracking-wider">
                  Specifications
                </th>
                {compareList.map((prod) => (
                  <th key={prod.id} className="p-4 min-w-[240px] align-top">
                    <div className="relative">
                      <button
                        onClick={() => removeFromCompare(prod.id)}
                        className="absolute -top-2 -right-2 p-1 rounded-full bg-zinc-800 hover:bg-rose-600 text-zinc-400 hover:text-white transition-colors"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <img
                        src={prod.mainImage}
                        alt={prod.name}
                        className="w-full h-36 object-cover rounded-xl bg-zinc-950 border border-zinc-800 mb-3"
                      />

                      <span className="text-[10px] uppercase font-bold text-emerald-400">
                        {prod.brand}
                      </span>
                      <h4
                        onClick={() => openProductDetail(prod)}
                        className="text-xs font-bold text-zinc-100 hover:text-emerald-300 transition-colors line-clamp-2 cursor-pointer"
                      >
                        {prod.name}
                      </h4>

                      <div className="mt-2 text-base font-bold font-tech text-emerald-400">
                        ৳{(prod.discountPrice || prod.regularPrice).toLocaleString('en-BD')}
                      </div>

                      <button
                        onClick={() => addToCart(prod, 1, true)}
                        className="w-full mt-3 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs transition-colors"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span>Add to Cart</span>
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-zinc-800/80 text-zinc-300">
              {/* Category */}
              <tr>
                <td className="p-4 font-semibold text-zinc-400 bg-zinc-950/40">Category</td>
                {compareList.map((p) => (
                  <td key={p.id} className="p-4">
                    {p.categoryName}
                  </td>
                ))}
              </tr>

              {/* SKU */}
              <tr>
                <td className="p-4 font-semibold text-zinc-400 bg-zinc-950/40">SKU / Model</td>
                {compareList.map((p) => (
                  <td key={p.id} className="p-4 font-mono text-zinc-400">
                    {p.sku}
                  </td>
                ))}
              </tr>

              {/* Warranty */}
              <tr>
                <td className="p-4 font-semibold text-zinc-400 bg-zinc-950/40">Warranty</td>
                {compareList.map((p) => (
                  <td key={p.id} className="p-4 text-emerald-400 font-medium">
                    {p.warranty}
                  </td>
                ))}
              </tr>

              {/* Stock */}
              <tr>
                <td className="p-4 font-semibold text-zinc-400 bg-zinc-950/40">Stock Status</td>
                {compareList.map((p) => (
                  <td key={p.id} className="p-4">
                    <span
                      className={`inline-flex items-center gap-1 font-semibold ${
                        p.stockStatus === 'in_stock' ? 'text-emerald-400' : 'text-amber-400'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {p.stockStatus === 'in_stock' ? 'In Stock (Savar)' : 'Limited Stock'}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Dynamic Specs */}
              {allSpecKeys.map((key) => (
                <tr key={key}>
                  <td className="p-4 font-semibold text-zinc-400 bg-zinc-950/40 capitalize">
                    {key}
                  </td>
                  {compareList.map((p) => (
                    <td key={p.id} className="p-4 font-mono text-zinc-200">
                      {p.specifications?.[key] || '—'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
