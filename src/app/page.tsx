"use client";

import { useState, useMemo, useEffect } from "react";
import { Transaction } from "@/types/finance";

export default function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [amount, setAmount] = useState("");
  const [desc, setDesc] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("zen-finance-data");
    if (saved) {
      try {
        setTransactions(JSON.parse(saved));
      } catch (e) {
        console.error("Ошибка парсинга данных:", e);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("zen-finance-data", JSON.stringify(transactions));
    }
  }, [transactions, isLoaded]);

  const balance = useMemo(() => {
    return transactions.reduce((acc, t) => 
      t.type === 'income' ? acc + t.amount : acc - t.amount, 12450
    );
  }, [transactions]);

  const addTransaction = (type: 'income' | 'expense') => {
    if (!amount || !desc) return;
    
    const newTx: Transaction = {
      id: Math.random().toString(36).substring(2, 9),
      amount: parseFloat(amount),
      description: desc,
      type: type,
      category: 'Tech',
      date: new Date().toLocaleDateString('ru-RU')
    };

    setTransactions([newTx, ...transactions]);
    setAmount("");
    setDesc("");
  };

  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  if (!isLoaded) return <div className="min-h-screen bg-slate-950" />;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 p-6 font-sans">
      <header className="max-w-6xl mx-auto flex justify-between items-center mb-10">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            ZenFinance AI
          </h1>
          <p className="text-slate-400 text-sm">Твой финансовый дзен</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl min-w-[160px] shadow-xl">
          <span className="text-slate-400 text-xs uppercase block mb-1">Текущий баланс</span>
          <span className={`text-2xl font-mono tracking-tighter ${balance < 5000 ? 'text-orange-400' : 'text-emerald-400'}`}>
            ${balance.toLocaleString()}
          </span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          
          <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-inner">
            <h3 className="text-slate-400 mb-4 font-medium">Новая операция</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <input 
                type="number" 
                placeholder="Сумма" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-slate-800 border-none rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-white"
              />
              <input 
                type="text" 
                placeholder="Описание" 
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                className="bg-slate-800 border-none rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-white"
              />
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => addTransaction('income')}
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 py-3 rounded-xl font-bold transition-all active:scale-95"
              >
                Доход +
              </button>
              <button 
                onClick={() => addTransaction('expense')}
                className="flex-1 bg-slate-100 text-slate-950 hover:bg-white py-3 rounded-xl font-bold transition-all active:scale-95"
              >
                Расход -
              </button>
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="text-slate-500 text-sm font-bold uppercase tracking-widest px-2">Последние действия</h3>
            {transactions.length === 0 && (
              <p className="text-slate-600 italic px-2">Список пуст...</p>
            )}
            {transactions.map(t => (
              <div key={t.id} className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl flex justify-between items-center group hover:border-slate-700 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-2 h-2 rounded-full ${t.type === 'income' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                  <div>
                    <p className="font-medium">{t.description}</p>
                    <p className="text-[10px] text-slate-500 uppercase">{t.date}</p>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end gap-1">
                  <span className={`font-mono font-bold ${t.type === 'income' ? 'text-emerald-400' : 'text-red-400'}`}>
                    {t.type === 'income' ? '+' : '-'}${t.amount.toLocaleString()}
                  </span>
                  <button 
                    onClick={() => deleteTransaction(t.id)}
                    className="text-[10px] text-slate-600 hover:text-red-400 uppercase font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Удалить
                  </button>
                </div>
              </div>
            ))}
          </section>
        </div>

        <aside className="bg-gradient-to-br from-blue-600/20 via-slate-900 to-slate-900 border border-blue-500/20 rounded-3xl p-6 h-fit sticky top-6 shadow-2xl">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
            <h3 className="font-bold text-blue-400 uppercase text-xs tracking-widest">AI Insights</h3>
          </div>
          <p className="text-sm leading-relaxed text-slate-300 antialiased">
            {transactions.length === 0 
              ? "Привет! Я твой финансовый ИИ. Добавь данные о расходах, и я помогу оптимизировать твой бюджет." 
              : balance < 10000 
                ? "Внимание: твой баланс снизился. ИИ рекомендует проанализировать категорию необязательных трат."
                : "Отличная работа! Твой финансовый дзен в порядке. Рекомендую отложить 10% в резервный фонд."
            }
          </p>
          {transactions.length > 3 && (
            <div className="mt-6 pt-6 border-t border-slate-800">
              <p className="text-[10px] text-slate-500 font-bold uppercase mb-2">Статус анализа</p>
              <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full w-2/3 animate-pulse" />
              </div>
            </div>
          )}
        </aside>
      </main>
    </div>
  );
}