'use client'

import { useState, useCallback, useEffect } from "react";

type CycleType = "quarterly" | "half-yearly" | "yearly";

interface Card {
  id: string;
  bank: string;
  last4: string;
}

interface Voucher {
  id: string;
  cardId: string;
  name: string;
  cycleType: CycleType;
}

type Data = {
  cards: Card[];
  vouchers: Voucher[];
  redemptions: Record<string, string[]>;
};

const STORAGE_KEY = "rupay-tracker-data";

const loadData = (): Data => {
  if (typeof window === "undefined") return { cards: [], vouchers: [], redemptions: {} };
  try {
    const json = localStorage.getItem(STORAGE_KEY);
    return json ? (JSON.parse(json) as Data) : { cards: [], vouchers: [], redemptions: {} };
  } catch {
    return { cards: [], vouchers: [], redemptions: {} };
  }
};

const saveData = (data: Data) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
};

const voucherPeriods: Record<CycleType, string[]> = {
  quarterly: ["q1", "q2", "q3", "q4"],
  "half-yearly": ["h1", "h2"],
  yearly: ["y"],
};

const allPeriods = ["q1", "q2", "q3", "q4", "h1", "h2", "y"] as const;
type Period = typeof allPeriods[number];

const formatCycleType = (cycle: CycleType): string => {
  return cycle.charAt(0).toUpperCase() + cycle.slice(1).replace("_", "-");
};

const getCardName = (cards: Card[], cardId: string): string => {
  const card = cards.find((c) => c.id === cardId);
  return card ? `${card.bank} ****${card.last4}` : "Unknown Card";
};

export default function Home() {
  const [data, setData] = useState<Data>({ cards: [], vouchers: [], redemptions: {} });
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [showAddVoucherModal, setShowAddVoucherModal] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState("");

  // Add Card form states
  const [bank, setBank] = useState("");
  const [last4, setLast4] = useState("");

  // Add Voucher form states
  const [voucherName, setVoucherName] = useState("");
  const [cycleType, setCycleType] = useState<CycleType>("quarterly");

  useEffect(() => {
    setData(loadData());
  }, []);

  const updateData = useCallback((updater: (current: Data) => Data) => {
    setData((prev) => {
      const newData = updater(prev);
      saveData(newData);
      return newData;
    });
  }, []);

  const addCard = () => {
    if (!bank.trim() || !last4.match(/^\d{4}$/)) {
      alert("Please enter valid bank name and 4-digit last4 digits.");
      return;
    }
    const id = crypto.randomUUID();
    const newCard: Card = { id, bank: bank.trim(), last4 };
    updateData((d) => ({
      ...d,
      cards: [...d.cards, newCard],
    }));
    setBank("");
    setLast4("");
    setShowAddCardModal(false);
  };

  const addVoucher = () => {
    if (!voucherName.trim() || !selectedCardId) {
      alert("Please enter voucher name and select a card.");
      return;
    }
    const id = crypto.randomUUID();
    const newVoucher: Voucher = {
      id,
      cardId: selectedCardId,
      name: voucherName.trim(),
      cycleType,
    };
    updateData((d) => ({
      ...d,
      vouchers: [...d.vouchers, newVoucher],
    }));
    setVoucherName("");
    setCycleType("quarterly");
    setSelectedCardId("");
    setShowAddVoucherModal(false);
  };

  const toggleRedemption = (voucherId: string, period: Period, checked: boolean) => {
    updateData((d) => {
      const reds = { ...d.redemptions };
      if (checked) {
        if (!reds[voucherId]) reds[voucherId] = [];
        if (!reds[voucherId].includes(period)) reds[voucherId].push(period);
      } else {
        if (reds[voucherId]) {
          reds[voucherId] = reds[voucherId].filter((p) => p !== period);
          if (reds[voucherId].length === 0) delete reds[voucherId];
        }
      }
      return { ...d, redemptions: reds };
    });
  };

  const vouchersWithCard = data.vouchers
    .map((v) => ({
      ...v,
      cardName: getCardName(data.cards, v.cardId),
    }))
    .sort((a, b) => a.cardName.localeCompare(b.cardName));

  const hasCards = data.cards.length > 0;
  const hasVouchers = data.vouchers.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 bg-clip-padding backdrop-blur-xl text-white rounded-3xl p-8 sm:p-12 lg:p-16 mb-12 shadow-2xl border border-white/20">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-4 bg-gradient-to-r from-white/90 to-blue-100/90 bg-clip-text text-transparent drop-shadow-2xl">
              💳 Rupay Select Tracker
            </h1>
            <p className="text-xl sm:text-2xl opacity-90 max-w-2xl mx-auto leading-relaxed">
              Effortlessly track your premium card vouchers and redemptions with elegant design.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
            <button
              onClick={() => setShowAddCardModal(true)}
              className="px-8 py-4 bg-white/20 backdrop-blur-sm text-white font-semibold text-lg rounded-2xl hover:bg-white/30 hover:shadow-2xl transition-all duration-300 shadow-xl flex items-center gap-2 mx-auto sm:mx-0"
            >
              ➕ Add New Card
            </button>
          </div>
        </div>

        {/* Cards List */}
        {hasCards && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-3">
              📋 Your Cards
            </h2>
            <div className="flex flex-wrap gap-3">
              {data.cards.map((card) => (
                <div
                  key={card.id}
                  className="group px-6 py-3 bg-gradient-to-r from-indigo-100 via-blue-100 to-purple-100 text-indigo-800 font-semibold rounded-2xl shadow-md hover:shadow-2xl hover:scale-105 transition-all duration-300 border border-white/50 flex items-center gap-3 cursor-pointer min-w-[200px]"
                >
                  <span>{card.bank} ****{card.last4}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCardId(card.id);
                      setShowAddVoucherModal(true);
                    }}
                    className="text-sm bg-white/60 group-hover:bg-white px-3 py-1 rounded-xl hover:shadow-md transition-all ml-auto"
                    title="Add Voucher"
                  >
                    ➕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-12 border border-white/50">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 flex items-center gap-3">
              <span>📊</span> All Vouchers
            </h2>
          </div>

          {(!hasCards || !hasVouchers) ? (
            <div className="text-center py-20">
              <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-r from-indigo-200/80 to-purple-200/80 rounded-3xl flex items-center justify-center shadow-2xl backdrop-blur-sm border border-white/50">
                <span className="text-5xl">💳</span>
              </div>
              <h3 className="text-2xl lg:text-3xl font-bold mb-4 text-gray-700">
                {hasCards ? "No Vouchers Yet" : "No Cards Added"}
              </h3>
              <p className="text-xl text-gray-500 mb-8 max-w-md mx-auto leading-relaxed">
                {hasCards
                  ? "Add vouchers to your cards to start tracking redemptions."
                  : "Add your first Rupay Select card to get started."}
              </p>
              <button
                onClick={() => setShowAddCardModal(true)}
                className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold text-lg rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                ➕ {hasCards ? "Add Voucher" : "Add First Card"}
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-gray-50 to-indigo-50/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Card</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Voucher</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Cycle</th>
                    {allPeriods.map((period) => (
                      <th key={period} className="px-4 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                        {period.toUpperCase()}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {vouchersWithCard.map((voucher) => (
                    <tr key={voucher.id} className="hover:bg-indigo-50/50 transition-colors">
                      <td className="px-6 py-5 whitespace-nowrap font-semibold text-gray-900">
                        {voucher.cardName}
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-gray-900">{voucher.name}</td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-800 text-sm font-medium rounded-full">
                          {formatCycleType(voucher.cycleType)}
                        </span>
                      </td>
                      {allPeriods.map((period) => (
                        <td key={period} className="px-3 py-5 text-center">
                          {voucherPeriods[voucher.cycleType].includes(period) ? (
                            <input
                              type="checkbox"
                              id={`cb-${voucher.id}-${period}`}
                              checked={!!data.redemptions[voucher.id]?.includes(period)}
                              onChange={(e) => toggleRedemption(voucher.id, period, e.target.checked)}
                              className="h-6 w-6 rounded-lg accent-indigo-500 hover:accent-purple-600 focus:ring-2 ring-indigo-500/50 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
                            />
                          ) : (
                            <span className="text-gray-300 font-mono text-xs">—</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add Card Modal */}
      {showAddCardModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowAddCardModal(false);
          }}
        >
          <div className="bg-gradient-to-b from-white to-slate-50/80 backdrop-blur-xl p-8 rounded-3xl shadow-3xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-white/50">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">➕ Add New Card</h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Bank Name</label>
                <input
                  type="text"
                  value={bank}
                  onChange={(e) => setBank(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 ring-indigo-200 shadow-sm transition-all duration-200 text-lg"
                  placeholder="e.g., HDFC, SBI"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Last 4 Digits</label>
                <input
                  type="text"
                  value={last4}
                  onChange={(e) => setLast4(e.target.value.replace(/\D/g, "").slice(0,4))}
                  maxLength={4}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 ring-indigo-200 shadow-sm transition-all duration-200 text-lg text-center font-mono tracking-wider"
                  placeholder="1234"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-8 pt-6 border-t border-gray-100">
              <button
                onClick={() => setShowAddCardModal(false)}
                className="flex-1 px-6 py-3 text-gray-700 font-semibold rounded-2xl border border-gray-200 hover:bg-gray-50 hover:shadow-md transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={addCard}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-200"
              >
                Add Card
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Voucher Modal */}
      {showAddVoucherModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowAddVoucherModal(false);
          }}
        >
          <div className="bg-gradient-to-b from-white to-slate-50/80 backdrop-blur-xl p-8 rounded-3xl shadow-3xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-white/50">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">➕ Add Voucher</h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Select Card</label>
                <select
                  value={selectedCardId}
                  onChange={(e) => setSelectedCardId(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 ring-indigo-200 shadow-sm transition-all duration-200 text-lg"
                >
                  <option value="">Choose a card...</option>
                  {data.cards.map((card) => (
                    <option key={card.id} value={card.id}>
                      {card.bank} ****{card.last4}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Voucher Name</label>
                <input
                  type="text"
                  value={voucherName}
                  onChange={(e) => setVoucherName(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 ring-indigo-200 shadow-sm transition-all duration-200 text-lg"
                  placeholder="e.g., Cult.fit 3mo"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Cycle Type</label>
                <select
                  value={cycleType}
                  onChange={(e) => setCycleType(e.target.value as CycleType)}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 ring-indigo-200 shadow-sm transition-all duration-200 text-lg"
                >
                  <option value="quarterly">Quarterly (Q1-Q4)</option>
                  <option value="half-yearly">Half-Yearly (H1-H2)</option>
                  <option value="yearly">Yearly (Y)</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-8 pt-6 border-t border-gray-100">
              <button
                onClick={() => setShowAddVoucherModal(false)}
                className="flex-1 px-6 py-3 text-gray-700 font-semibold rounded-2xl border border-gray-200 hover:bg-gray-50 hover:shadow-md transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={addVoucher}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-200"
              >
                Add Voucher
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
