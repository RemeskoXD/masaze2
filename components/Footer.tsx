import React from 'react';
import { CONTACT_INFO } from '../constants';
import { Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { motion } from 'motion/react';
import QRCode from 'react-qr-code';

const Footer: React.FC = () => {
  return (
    <footer id="contact" className="bg-beige-dark border-t border-gold/20 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          
          {/* Contact Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-2xl font-serif text-gold-dark mb-6">Kontakt</h3>
            <div className="space-y-4 text-text-muted">
              <div>
                 <p className="font-bold text-lg text-text-dark">{CONTACT_INFO.name}</p>
                 {CONTACT_INFO.subtitle && (
                    <p className="text-gold-dark text-sm">{CONTACT_INFO.subtitle}</p>
                 )}
              </div>
              <div className="flex items-start gap-3 pt-2">
                <MapPin size={20} className="text-gold mt-1 shrink-0" />
                <div>
                  <p>{CONTACT_INFO.address}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 hover:text-gold transition">
                <Phone size={20} className="text-gold shrink-0" />
                <a href={`tel:${CONTACT_INFO.phone}`}>{CONTACT_INFO.phone}</a>
              </div>
              <div className="flex items-center gap-3 hover:text-gold transition">
                <Mail size={20} className="text-gold shrink-0" />
                <a href={`mailto:${CONTACT_INFO.email}`}>{CONTACT_INFO.email}</a>
              </div>
              <div className="flex items-center gap-3 hover:text-gold transition">
                <Instagram size={20} className="text-gold shrink-0" />
                <a href={`https://instagram.com/${CONTACT_INFO.ig}`} target="_blank" rel="noreferrer">@{CONTACT_INFO.ig}</a>
              </div>
              <div className="mt-4 text-xs text-text-muted/70 leading-relaxed">
                 <p>IČO: {CONTACT_INFO.ico}</p>
                 <p className="italic text-[11px] mt-0.5">Fyzická osoba zapsaná v živnostenském rejstříku.</p>
              </div>
            </div>
          </motion.div>

          {/* Links */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-center md:text-left"
          >
             <h3 className="text-2xl font-serif text-gold-dark mb-6">Platební údaje</h3>
             <div className="text-text-muted text-sm space-y-2">
                <p>Platbu můžete provést online převodem:</p>
                <div className="mt-3 p-4 bg-white/50 border border-gold/20 rounded-xl flex flex-col xs:flex-row items-center gap-4 text-center xs:text-left">
                  <div className="bg-white p-1.5 border border-gold/10 rounded overflow-hidden flex-shrink-0">
                     <QRCode value={`SPD*1.0*ACC:${CONTACT_INFO.iban.replace(/\s/g, '')}*CC:CZK*MSG:Masaz`} size={80} level="L" />
                  </div>
                  <div className="font-mono text-xs space-y-1 break-words w-full overflow-hidden">
                    <p className="font-sans font-medium text-text-dark mb-1">{CONTACT_INFO.bankName}</p>
                    <p>Účet: <strong className="break-all">{CONTACT_INFO.bankAccount}</strong></p>
                    <p className="break-all">IBAN: {CONTACT_INFO.iban}</p>
                    <p>SWIFT: {CONTACT_INFO.swift}</p>
                  </div>
                </div>
             </div>
          </motion.div>

          {/* Map Placeholder */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="h-64 bg-white rounded-lg overflow-hidden border border-gold/20 relative group"
          >
            {/* Interactive map would go here. Using a placeholder image or iframe. */}
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2586.417277329528!2d14.9048!3d49.6083!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x470c650800000001%3A0x0!2zWsOhbWVrIE5hxI1lcmFkZWM!5e0!3m2!1scs!2scz!4v1700000000000!5m2!1scs!2scz" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              className="opacity-70 group-hover:opacity-100 transition-opacity duration-500 grayscale group-hover:grayscale-0"
            ></iframe>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="border-t border-gold/10 mt-12 pt-8 text-center text-sm text-text-muted"
        >
          <p>&copy; {new Date().getFullYear()} Tereza Rozkošná. Všechna práva vyhrazena.</p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;