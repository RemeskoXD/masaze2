import React, { useState, useEffect } from 'react';
import { SERVICES_LIST } from '../constants';
import { ReservationStatus, Service } from '../types';
import { Settings, Calendar, LogOut, Check, X, Clock, DollarSign, Loader2, RefreshCw, CheckCircle, ShieldAlert, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const AdminPanel: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [adminToken, setAdminToken] = useState(''); 
  const [loginError, setLoginError] = useState('');
  
  const [reservations, setReservations] = useState<any[]>([]);
  const [services, setServices] = useState<Service[]>(SERVICES_LIST); 
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'reservations' | 'settings' | 'prices'>('reservations');
  const [clientSectionEnabled, setClientSectionEnabled] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError('');
    
    try {
        const response = await fetch('/api/admin/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password })
        });
        
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            const result = await response.json();
            if (result.success) {
                setAdminToken(result.token);
                setIsAuthenticated(true);
                fetchData(result.token);
                fetchSettings();
            } else {
                setLoginError("Nesprávné heslo");
            }
        } else {
            console.error("API Error: Server nevrátil JSON. Status:", response.status);
            setLoginError("Chyba připojení k serveru (API není dostupné). Pokud jste na Coolify, ujistěte se, že typ nasazení je 'Node.js' (Nixpacks/Dockerfile), nikoliv 'Static Site', a startovací příkaz je 'npm run start'. Jinak se spustí jen frontend bez backendu!");
        }
    } catch (error) {
        console.error("Login error:", error);
        setLoginError("Chyba připojení k serveru (Síťová chyba nebo backend neběží).");
    } finally {
        setIsLoading(false);
    }
  };

  const fetchSettings = async () => {
      try {
          const res = await fetch('/api/settings');
          const data = await res.json();
          setClientSectionEnabled(data.clientSectionEnabled || false);
      } catch (e) {
          console.error(e);
      }
  };

  const updateSetting = async (key: string, value: any) => {
      if (key === 'clientSectionEnabled') setClientSectionEnabled(value);
      try {
          await fetch('/api/admin/settings', {
              method: 'POST',
              headers: { 
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${adminToken}`
              },
              body: JSON.stringify({ [key]: value })
          });
      } catch (e) {
          console.error(e);
      }
  };

  const fetchData = async (token: string = adminToken) => {
    setIsLoading(true);
    try {
        const resResp = await fetch('/api/admin/reservations', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (resResp.ok) {
            const resData = await resResp.json();
            if (resData.success) {
                setReservations(resData.reservations);
            }
        }
    } catch (e) {
        console.error("Failed to fetch data", e);
    } finally {
        setIsLoading(false);
    }
  };

  const updateStatus = async (id: number, status: string) => {
    const previousReservations = [...reservations];
    setReservations(reservations.map(res => res.id === id ? { ...res, status } : res));

    try {
        const response = await fetch(`/api/admin/reservation/${id}/status`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${adminToken}`
            },
            body: JSON.stringify({ status })
        });
        
        if (!response.ok) throw new Error("Server error");
        alert('Stav upraven a e-mail byl odeslán (pokud byl nastaven).');
    } catch (e) {
        alert("Chyba při ukládání stavu na server.");
        setReservations(previousReservations); 
    }
  };

  const sendThankYouEmail = async (id: number) => {
    if (!confirm('Opravdu chcete ručně odeslat e-mail s poděkováním tomuto klientovi?')) return;
    try {
        const response = await fetch(`/api/admin/reservation/${id}/thankyou`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        if (response.ok) {
            alert('E-mail s poděkováním byl úspěšně odeslán.');
        } else {
            alert('Nastala chyba při odesílání.');
        }
    } catch (e) {
         alert('Nastala chyba při odesílání (Server error).');
    }
  };

  const updatePrice = async (id: number, newPrice: string) => {
    setServices(services.map(s => s.id === id ? { ...s, price: newPrice } : s));
  };

  const savePrice = async (id: number, price: string) => {
    alert("Ceník je aktuálně z dema, ukládání zatím není implementováno globálně.");
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
              className="bg-[#0f3d26] p-10 rounded-lg border border-gold/30 shadow-2xl relative overflow-hidden"
            >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold-dark via-gold to-gold-dark"></div>
            <h2 className="text-gold text-3xl mb-2 font-serif text-center tracking-wider">ADMINISTRACE</h2>
            <p className="text-gray-400 text-center text-sm mb-8 flex items-center justify-center gap-2">
                <ShieldAlert size={14} className="text-gold" /> Zabezpečený přístup
            </p>
            
            {loginError && (
                <div className="mb-6 p-3 bg-red-900/50 border border-red-500/50 rounded text-red-200 text-sm text-center">
                    {loginError}
                </div>
            )}

            <div className="mb-6">
                <label className="block text-gray-400 text-sm mb-2">Přístupové heslo</label>
                <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 bg-[#0a2f1c] border border-gray-600 text-white rounded focus:border-gold outline-none transition"
                    placeholder="••••••••"
                    required
                />
            </div>
            <button 
                type="submit" 
                disabled={isLoading}
                className={`w-full bg-gold text-deep-green font-bold py-3 rounded hover:bg-white transition-colors flex justify-center items-center gap-2 ${isLoading ? 'opacity-70 cursor-wait' : ''}`}
            >
                {isLoading ? <Loader2 size={20} className="animate-spin" /> : 'Vstoupit'}
            </button>
            </motion.form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-deep-green text-gray-200 font-sans">
      <div className="bg-[#0f3d26] border-b border-gold/20 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex justify-between items-center">
            <h1 className="text-2xl text-gold font-serif tracking-wide">Tereza Rozkošná <span className="text-gray-500 text-sm font-sans ml-2">/ Admin Panel</span></h1>
            <div className="flex items-center gap-4">
                <button onClick={() => fetchData()} className="p-2 bg-[#0a2f1c] rounded-full hover:bg-gold hover:text-deep-green transition" title="Obnovit data">
                    <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
                </button>
                <button onClick={() => setIsAuthenticated(false)} className="flex items-center gap-2 text-red-400 hover:text-red-300 transition">
                    <LogOut size={18} /> Odhlásit
                </button>
            </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
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
                <Settings size={18} /> Nastavení
            </button>
        </div>

        <AnimatePresence mode="wait">
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
                                  <th className="p-4 border-b border-gold/10">Poznámka</th>
                                  <th className="p-4 border-b border-gold/10">Stav</th>
                                  <th className="p-4 border-b border-gold/10 max-w-[200px]">Akce</th>
                              </tr>
                          </thead>
                          <motion.tbody 
                              className="divide-y divide-gray-700"
                              variants={{
                                  hidden: { opacity: 0 },
                                  show: { opacity: 1, transition: { staggerChildren: 0.05 } }
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
                                          <div className="text-xs text-gold/70 mt-1">{res.serviceId}</div>
                                      </td>
                                      <td className="p-4">
                                          <div className="font-medium text-white">{res.customerName}</div>
                                          <div className="text-xs text-gray-400">{res.phone}</div>
                                          <div className="text-xs text-gray-500">{res.email}</div>
                                      </td>
                                      <td className="p-4 text-xs text-gray-500 italic max-w-xs truncate" title={res.note}>
                                          {res.note || '-'}
                                      </td>
                                      <td className="p-4">
                                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                              res.status === 'confirmed' ? 'bg-blue-900 text-blue-200 border border-blue-700' :
                                              res.status === 'paid' ? 'bg-green-900 text-green-200 border border-green-700' :
                                              res.status === 'cancelled' ? 'bg-red-900 text-red-200 border border-red-700' :
                                              'bg-yellow-900 text-yellow-200 border border-yellow-700'
                                          }`}>
                                              {res.status === 'pending' ? 'Nová žádost' : res.status === 'confirmed' ? 'Potvrzeno' : res.status === 'paid' ? 'Zaplaceno' : 'Zrušeno'}
                                          </span>
                                      </td>
                                      <td className="p-4 space-y-2">
                                          {res.status === 'pending' && (
                                              <div className="flex gap-2">
                                                  <button onClick={() => updateStatus(res.id, 'confirmed')} className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded shadow-sm transition flex-1 text-center text-xs" title="Potvrdit termín (pošle instrukce)">Potvrdit (e-mail)</button>
                                                  <button onClick={() => updateStatus(res.id, 'cancelled')} className="bg-red-600 hover:bg-red-500 text-white p-2 rounded shadow-sm transition" title="Zamítnout"><X size={16}/></button>
                                              </div>
                                          )}
                                          {res.status === 'confirmed' && (
                                              <div className="flex gap-2">
                                                  <button onClick={() => updateStatus(res.id, 'paid')} className="bg-green-600 hover:bg-green-500 text-white p-2 rounded shadow-sm transition flex-1 text-center text-xs" title="Označit jako zaplaceno (pošle potvrzení)">Zaplaceno (e-mail)</button>
                                                  <button onClick={() => updateStatus(res.id, 'cancelled')} className="text-red-400 hover:text-red-300 text-xs underline p-2">Zrušit</button>
                                              </div>
                                          )}
                                          
                                          <button 
                                            onClick={() => sendThankYouEmail(res.id)} 
                                            className="w-full text-xs mt-1 bg-[#1a4a33] hover:bg-gold hover:text-deep-green border border-gold/30 text-white px-2 py-1 rounded transition flex items-center justify-center gap-1"
                                          >
                                            <Mail size={12} /> Poslat poděkování po masáži
                                          </button>
                                      </td>
                                  </motion.tr>
                              ))}
                          </motion.tbody>
                      </table>
                      )}
                  </div>
               </motion.div>
          )}

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
                          show: { opacity: 1, transition: { staggerChildren: 0.05 } }
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

          {activeTab === 'settings' && (
              <motion.div 
                  key="settings"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="bg-[#0f3d26] p-8 rounded-lg border border-gold/10 shadow-xl space-y-8"
              >
                  <div>
                      <h3 className="text-xl text-white mb-6 border-b border-gray-700 pb-2">Funkce na webu</h3>
                      <div className="bg-[#0a2f1c] p-6 rounded border border-gray-600 flex justify-between items-center">
                          <div>
                              <h4 className="font-bold text-gold">Klientská sekce (MediHub)</h4>
                              <p className="text-sm text-gray-400">Pokud je zapnuto, zobrazí se na hlavní stránce tlačítko a sekce.</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                              <input 
                                type="checkbox" 
                                className="sr-only peer" 
                                checked={clientSectionEnabled}
                                onChange={(e) => updateSetting('clientSectionEnabled', e.target.checked)}
                              />
                              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold"></div>
                          </label>
                      </div>
                  </div>

                  <div>
                      <h3 className="text-xl text-white mb-6 border-b border-gray-700 pb-2">Otevírací doba (Kalendář)</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {['Pondělí', 'Úterý', 'Středa', 'Čtvrtek', 'Pátek'].map((day) => (
                              <div key={day} className="bg-[#0a2f1c] p-4 rounded border border-gray-600 flex justify-between items-center">
                                  <span className="font-bold text-gray-300">{day}</span>
                                  <div className="flex items-center gap-2 text-sm text-gray-400">
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
                  </div>

                  <div className="pt-6 border-t border-gray-700">
                      <h3 className="text-xl text-white mb-4">Stav serveru</h3>
                       <div className="flex items-center gap-2 text-green-400 text-sm">
                          <CheckCircle size={16} />
                          <span>Interní lokální API spuštěno na portu 3000.</span>
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