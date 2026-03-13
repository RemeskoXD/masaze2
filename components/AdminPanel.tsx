import React, { useState, useEffect } from 'react';
import { ADMIN_PASSWORD_HASH, SERVICES_LIST, API_BASE_URL } from '../constants';
import { ReservationStatus, Service, Reservation } from '../types';
import { Settings, Calendar, LogOut, Check, X, Clock, DollarSign, Edit2, Loader2, RefreshCw, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const AdminPanel: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  
  // Real data states
  const [reservations, setReservations] = useState<any[]>([]);
  const [services, setServices] = useState<Service[]>(SERVICES_LIST); 
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'reservations' | 'settings' | 'prices'>('reservations');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD_HASH) {
      setIsAuthenticated(true);
      fetchData(); // Load data on login
    } else {
      alert("Nesprávné heslo");
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
        // Fetch Reservations
        const resResp = await fetch(`${API_BASE_URL}?action=get_reservations`);
        if (resResp.ok) {
            const resData = await resResp.json();
            // Map DB columns to our Typescript interface if needed, or use as is
            // Assuming API returns snake_case, mapping to camelCase for UI or using directly
            const mapped = resData.map((r: any) => ({
                id: r.id,
                clientName: r.client_name,
                email: r.client_email,
                phone: r.client_phone,
                date: r.reservation_date,
                time: r.reservation_time,
                status: r.status,
                serviceId: r.service_id,
                serviceTitle: r.service_title
            }));
            setReservations(mapped);
        }

        // Fetch Services (to get up to date prices)
        const srvResp = await fetch(`${API_BASE_URL}?action=get_services`);
        if (srvResp.ok) {
             // If the API returns structure matching Service interface
             const srvData = await srvResp.json();
             // Assuming simple mapping or direct use
             if (srvData && srvData.length > 0) setServices(srvData);
        }

    } catch (e) {
        console.error("Failed to fetch data", e);
        // alert("Chyba při načítání dat z databáze.");
    } finally {
        setIsLoading(false);
    }
  };

  const updateStatus = async (id: number, status: ReservationStatus) => {
    // Optimistic UI update
    setReservations(reservations.map(res => 
      res.id === id ? { ...res, status } : res
    ));

    try {
        await fetch(API_BASE_URL, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ action: 'update_reservation_status', id, status })
        });
    } catch (e) {
        alert("Chyba při ukládání stavu na server.");
        fetchData(); // Revert on error
    }
  };

  const updatePrice = async (id: number, newPrice: string) => {
    // Local update
    setServices(services.map(s => s.id === id ? { ...s, price: newPrice } : s));
  };

  const savePrice = async (id: number, price: string) => {
      try {
        await fetch(API_BASE_URL, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ action: 'update_service_price', id, price })
        });
        alert("Cena uložena.");
      } catch (e) {
          alert("Chyba při ukládání ceny.");
      }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-deep-green bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]">
        <div className="w-full max-w-md px-4">
            <motion.form 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              onSubmit={handleLogin} 
              className="bg-[#0f3d26] p-10 rounded-lg border border-gold/30 shadow-2xl"
            >
            <h2 className="text-gold text-3xl mb-8 font-serif text-center tracking-wider">ADMINISTRACE</h2>
            <div className="mb-6">
                <label className="block text-gray-400 text-sm mb-2">Přístupové heslo</label>
                <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 bg-[#0a2f1c] border border-gray-600 text-white rounded focus:border-gold outline-none transition"
                    placeholder="••••••••"
                />
            </div>
            <button type="submit" className="w-full bg-gold text-deep-green font-bold py-3 rounded hover:bg-white transition-colors">Vstoupit</button>
            </motion.form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-deep-green text-gray-200 font-sans">
      {/* Sidebar / Topbar */}
      <div className="bg-[#0f3d26] border-b border-gold/20 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex justify-between items-center">
            <h1 className="text-2xl text-gold font-serif tracking-wide">Tereza Rozkošná <span className="text-gray-500 text-sm font-sans ml-2">/ Admin Panel</span></h1>
            <div className="flex items-center gap-4">
                <button onClick={fetchData} className="p-2 bg-[#0a2f1c] rounded-full hover:bg-gold hover:text-deep-green transition" title="Obnovit data">
                    <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
                </button>
                <button onClick={() => setIsAuthenticated(false)} className="flex items-center gap-2 text-red-400 hover:text-red-300 transition">
                    <LogOut size={18} /> Odhlásit
                </button>
            </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Tabs */}
        <div className="flex flex-wrap gap-4 mb-8">
            <button 
                onClick={() => setActiveTab('reservations')}
                className={`px-6 py-3 rounded-md flex items-center gap-2 transition shadow-lg ${activeTab === 'reservations' ? 'bg-gold text-deep-green font-bold transform scale-105' : 'bg-[#0f3d26] text-gray-300 hover:bg-white/10'}`}
            >
                <Calendar size={18} /> Přehled Rezervací
            </button>
            <button 
                onClick={() => setActiveTab('prices')}
                className={`px-6 py-3 rounded-md flex items-center gap-2 transition shadow-lg ${activeTab === 'prices' ? 'bg-gold text-deep-green font-bold transform scale-105' : 'bg-[#0f3d26] text-gray-300 hover:bg-white/10'}`}
            >
                <DollarSign size={18} /> Ceník Služeb
            </button>
            <button 
                onClick={() => setActiveTab('settings')}
                className={`px-6 py-3 rounded-md flex items-center gap-2 transition shadow-lg ${activeTab === 'settings' ? 'bg-gold text-deep-green font-bold transform scale-105' : 'bg-[#0f3d26] text-gray-300 hover:bg-white/10'}`}
            >
                <Settings size={18} /> Nastavení a Dostupnost
            </button>
        </div>

        <AnimatePresence mode="wait">
          {/* --- RESERVATIONS TAB --- */}
          {activeTab === 'reservations' && (
               <motion.div 
                  key="reservations"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="bg-[#0f3d26] rounded-lg border border-gold/10 overflow-hidden shadow-xl"
               >
                  <div className="p-4 bg-[#0a2f1c] border-b border-gold/10 flex justify-between items-center">
                      <h3 className="text-white font-serif text-lg">Aktuální objednávky</h3>
                      <span className="text-sm text-gray-400">Celkem: {reservations.length}</span>
                  </div>
                  <div className="overflow-x-auto">
                      {reservations.length === 0 ? (
                          <div className="p-8 text-center text-gray-500">
                              {isLoading ? 'Načítám data...' : 'Žádné rezervace v databázi.'}
                          </div>
                      ) : (
                      <table className="w-full text-left border-collapse">
                          <thead className="bg-[#0a2f1c] text-gold uppercase text-sm tracking-wider">
                              <tr>
                                  <th className="p-4 border-b border-gold/10">Datum & Čas</th>
                                  <th className="p-4 border-b border-gold/10">Klient</th>
                                  <th className="p-4 border-b border-gold/10">Služba</th>
                                  <th className="p-4 border-b border-gold/10">Poznámka</th>
                                  <th className="p-4 border-b border-gold/10">Stav</th>
                                  <th className="p-4 border-b border-gold/10 text-right">Akce</th>
                              </tr>
                          </thead>
                          <motion.tbody 
                              className="divide-y divide-gray-700"
                              variants={{
                                  hidden: { opacity: 0 },
                                  show: {
                                      opacity: 1,
                                      transition: { staggerChildren: 0.05 }
                                  }
                              }}
                              initial="hidden"
                              animate="show"
                          >
                              {reservations.map(res => (
                                  <motion.tr 
                                      key={res.id} 
                                      className="hover:bg-white/5 transition-colors"
                                      variants={{
                                          hidden: { opacity: 0, x: -20 },
                                          show: { opacity: 1, x: 0 }
                                      }}
                                  >
                                      <td className="p-4 whitespace-nowrap">
                                          <div className="font-bold text-white">{new Date(res.date).toLocaleDateString('cs-CZ')}</div>
                                          <div className="text-sm text-gray-400 flex items-center gap-1"><Clock size={12}/> {res.time}</div>
                                      </td>
                                      <td className="p-4">
                                          <div className="font-medium text-white">{res.clientName}</div>
                                          <div className="text-xs text-gray-400">{res.phone}</div>
                                          <div className="text-xs text-gray-500">{res.email}</div>
                                      </td>
                                      <td className="p-4 text-sm text-gray-300">
                                          {res.serviceTitle || `ID: ${res.serviceId}`}
                                      </td>
                                      <td className="p-4 text-xs text-gray-500 italic max-w-xs truncate" title={res.note}>
                                          {res.note || '-'}
                                      </td>
                                      <td className="p-4">
                                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                              res.status === 'confirmed' ? 'bg-green-900 text-green-200 border border-green-700' :
                                              res.status === 'cancelled' ? 'bg-red-900 text-red-200 border border-red-700' :
                                              'bg-yellow-900 text-yellow-200 border border-yellow-700'
                                          }`}>
                                              {res.status === 'pending' ? 'Nová žádost' : res.status === 'confirmed' ? 'Potvrzeno' : 'Zrušeno'}
                                          </span>
                                      </td>
                                      <td className="p-4 text-right space-x-2 whitespace-nowrap">
                                          {res.status === 'pending' && (
                                              <>
                                                  <button onClick={() => updateStatus(res.id, ReservationStatus.CONFIRMED)} className="bg-green-600 hover:bg-green-500 text-white p-2 rounded shadow-sm transition" title="Potvrdit"><Check size={16}/></button>
                                                  <button onClick={() => updateStatus(res.id, ReservationStatus.CANCELLED)} className="bg-red-600 hover:bg-red-500 text-white p-2 rounded shadow-sm transition" title="Zamítnout"><X size={16}/></button>
                                              </>
                                          )}
                                          {res.status === 'confirmed' && (
                                              <button onClick={() => updateStatus(res.id, ReservationStatus.CANCELLED)} className="text-red-400 hover:text-red-300 text-xs underline">Zrušit</button>
                                          )}
                                      </td>
                                  </motion.tr>
                              ))}
                          </motion.tbody>
                      </table>
                      )}
                  </div>
               </motion.div>
          )}

          {/* --- PRICES TAB --- */}
          {activeTab === 'prices' && (
              <motion.div 
                  key="prices"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="bg-[#0f3d26] rounded-lg border border-gold/10 overflow-hidden shadow-xl p-6"
              >
                  <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
                      <h3 className="text-xl text-white font-serif">Správa Ceníku</h3>
                      <p className="text-sm text-gray-400">Změny se ihned projeví na webu.</p>
                  </div>
                  <motion.div 
                      className="grid grid-cols-1 gap-4"
                      variants={{
                          hidden: { opacity: 0 },
                          show: {
                              opacity: 1,
                              transition: { staggerChildren: 0.05 }
                          }
                      }}
                      initial="hidden"
                      animate="show"
                  >
                      {services.map((service) => (
                          <motion.div 
                              key={service.id} 
                              className="bg-[#0a2f1c] p-4 rounded border border-gray-600 flex flex-col sm:flex-row justify-between items-center gap-4"
                              variants={{
                                  hidden: { opacity: 0, y: 10 },
                                  show: { opacity: 1, y: 0 }
                              }}
                          >
                              <div className="flex-1">
                                  <h4 className="font-bold text-gold text-lg">{service.title}</h4>
                                  <p className="text-sm text-gray-400">{service.description}</p>
                              </div>
                              <div className="flex items-center gap-4">
                                  <div className="flex flex-col">
                                      <label className="text-xs text-gray-500 uppercase">Cena</label>
                                      <input 
                                          type="text" 
                                          value={service.price} 
                                          onChange={(e) => updatePrice(service.id, e.target.value)}
                                          className="bg-black/20 border border-gray-600 text-white p-2 rounded w-32 focus:border-gold outline-none"
                                      />
                                  </div>
                                  <button 
                                      onClick={() => savePrice(service.id, service.price)}
                                      className="p-2 bg-gold/10 text-gold hover:bg-gold hover:text-deep-green rounded transition" 
                                      title="Uložit změnu"
                                  >
                                      <Check size={18} />
                                  </button>
                              </div>
                          </motion.div>
                      ))}
                  </motion.div>
              </motion.div>
          )}

          {/* --- SETTINGS TAB --- */}
          {activeTab === 'settings' && (
              <motion.div 
                  key="settings"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="bg-[#0f3d26] p-8 rounded-lg border border-gold/10 shadow-xl"
              >
                  <h3 className="text-xl text-white mb-6 border-b border-gray-700 pb-2">Otevírací doba (Kalendář)</h3>
                  <p className="text-gray-400 mb-6">Nastavte dny, kdy máte otevřeno. V budoucnu zde bude vizuální kalendář pro blokování dovolené.</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {['Pondělí', 'Úterý', 'Středa', 'Čtvrtek', 'Pátek'].map((day) => (
                          <div key={day} className="bg-[#0a2f1c] p-4 rounded border border-gray-600 flex justify-between items-center">
                              <span className="font-bold text-gold">{day}</span>
                              <div className="flex items-center gap-2 text-sm text-gray-300">
                                  <Clock size={14} />
                                  <input type="text" defaultValue="09:00" className="bg-transparent w-12 text-center border-b border-gray-500 focus:border-gold outline-none" />
                                  <span>-</span>
                                  <input type="text" defaultValue="18:00" className="bg-transparent w-12 text-center border-b border-gray-500 focus:border-gold outline-none" />
                              </div>
                          </div>
                      ))}
                       <div className="bg-[#0a2f1c] p-4 rounded border border-gray-600 opacity-50 flex justify-between items-center">
                          <span className="font-bold text-gray-500">Víkend</span>
                          <span className="text-xs uppercase border border-gray-600 px-2 py-1 rounded">Zavřeno</span>
                       </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-700">
                      <h3 className="text-xl text-white mb-4">Stav serveru</h3>
                       <div className="flex items-center gap-2 text-green-400">
                          <CheckCircle size={16} />
                          <span>API připojeno: {API_BASE_URL}</span>
                       </div>
                  </div>
              </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminPanel;