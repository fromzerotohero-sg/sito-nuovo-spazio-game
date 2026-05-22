import PageLayout from '../components/PageLayout';
import SiteImage from '../components/SiteImage';
import { Wrench, Cpu, Monitor, Phone, Settings, Check, Clock, Shield } from 'lucide-react';

export default function AssistenzaPage() {
  const services = [
    {
      icon: <Wrench size={28} />,
      title: 'Riparazione Schede',
      subtitle: 'SCHEDE',
      desc: 'Riparazione e manutenzione di schede e apparecchi da intrattenimento. Interventi rapidi e professionali per minimizzare i tempi di fermo macchina.',
      features: [
        'Diagnosi tecnica avanzata',
        'Riparazione componenti elettronici',
        'Sostituzione parti danneggiate',
        'Test funzionale completo',
      ],
    },
    {
      icon: <Monitor size={28} />,
      title: 'Ricambi e Periferiche',
      subtitle: 'RICAMBI',
      desc: 'Fornitura di monitor, pulsanti, hopper, lettori di banconote, schede CPU e tutti i ricambi originali per il tuo parco macchine.',
      features: [
        'Monitor LCD e LED',
        'Pulsanti e comandi',
        'Hopper e gettoniere',
        'Lettori di banconote',
        'Schede CPU',
      ],
    },
    {
      icon: <Settings size={28} />,
      title: 'Supporto Tecnico',
      subtitle: 'SUPPORTO',
      desc: 'Supporto tecnico personalizzato per esigenze specifiche dei noleggiatori. Consulenza dedicata per risolvere ogni problematica.',
      features: [
        'Assistenza telefonica',
        'Intervento in loco',
        'Manutenzione programmata',
        'Formazione operatore',
      ],
    },
    {
      icon: <Cpu size={28} />,
      title: 'Consulenza Hardware',
      subtitle: 'CONSULENZA',
      desc: 'Consulenza sulla compatibilità e aggiornamenti hardware. Ti aiutiamo a scegliere le soluzioni migliori per il tuo parco macchine.',
      features: [
        'Analisi parco macchine',
        'Consigli aggiornamento',
        'Verifica compatibilità',
        'Pianificazione investimenti',
      ],
    },
  ];

  return (
    <PageLayout title="Assistenza">
      {/* Intro */}
      <section className="px-4 sm:px-6 lg:px-12 pb-16">
        <div className="max-w-6xl mx-auto">
          <p className="text-white/60 text-lg leading-relaxed max-w-3xl">
            Il nostro centro assistenza offre supporto professionale per noleggiatori e concessionari.
            Riparazione schede, fornitura ricambi, assistenza tecnica e consulenza hardware:
            un servizio completo per garantire il massimo uptime delle tue macchine.
          </p>
        </div>
      </section>

      {/* Services */}
      <section className="px-4 sm:px-6 lg:px-12 py-16 border-t border-white/10">
        <div className="max-w-6xl mx-auto space-y-12">
          {services.map((service, index) => (
            <div
              key={service.title}
              className={`grid lg:grid-cols-2 gap-8 items-start p-8 bg-white/5 rounded-lg border border-white/10 ${
                index === 0 ? 'lg:grid-cols-2' : ''
              }`}
            >
              <div className={index % 2 === 1 ? 'order-2 lg:order-1' : ''}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-neon-cyan/10 rounded-lg text-neon-cyan">
                    {service.icon}
                  </div>
                  <div>
                    <span className="text-neon-cyan text-xs tracking-[0.2em] uppercase">{service.subtitle}</span>
                    <h3 className="text-2xl font-display text-white uppercase tracking-tight">
                      {service.title}
                    </h3>
                  </div>
                </div>
                <p className="text-white/60 text-sm leading-relaxed mb-6">{service.desc}</p>
                <ul className="space-y-2">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-white/50 text-sm">
                      <Check size={14} className="text-neon-cyan shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className={`flex items-center justify-center ${index % 2 === 1 ? 'order-1 lg:order-2' : ''}`}>
                <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-void-dark">
                  <SiteImage
                    assetKey="page.assistenza.hero"
                    fallback="/assistenza-tech.jpg"
                    alt={service.title}
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-void-black/80 via-void-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 flex items-center gap-2">
                    <Shield size={14} className="text-neon-cyan" />
                    <span className="text-white/80 text-xs">Servizio professionale</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="px-4 sm:px-6 lg:px-12 py-16 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl font-display text-white uppercase tracking-tight mb-12 text-center">
            Perché Scegliere la Nostra Assistenza
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <Clock size={24} />,
                title: 'Interventi Rapidi',
                desc: 'Tempi di intervento ridotti al minimo per garantire la continuità del tuo business.',
              },
              {
                icon: <Shield size={24} />,
                title: 'Tecnici Qualificati',
                desc: 'Team di tecnici specializzati con anni di esperienza nel settore del gaming.',
              },
              {
                icon: <Phone size={24} />,
                title: 'Supporto Diretto',
                desc: 'Linea diretta con il nostro centro assistenza per ogni esigenza.',
              },
            ].map((item) => (
              <div key={item.title} className="p-6 bg-white/5 rounded-lg border border-white/10 text-center">
                <div className="inline-flex p-3 bg-neon-cyan/10 rounded-lg text-neon-cyan mb-4">
                  {item.icon}
                </div>
                <h4 className="text-white font-medium mb-2">{item.title}</h4>
                <p className="text-white/50 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Banner */}
      <section className="px-4 sm:px-6 lg:px-12 py-16 border-t border-white/10">
        <div className="max-w-4xl mx-auto p-8 bg-gradient-to-r from-neon-cyan/10 to-transparent rounded-lg border border-neon-cyan/20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h4 className="text-white font-display text-xl uppercase tracking-tight mb-2">
                Centro Assistenza SpazioGame
              </h4>
              <p className="text-white/60 text-sm">
                Tel: +39 0374 871615 | Email: info@spaziogame.net
              </p>
            </div>
            <a
              href="tel:+390374871615"
              className="shrink-0 flex items-center gap-3 px-6 py-3 bg-neon-cyan text-void-black font-medium text-sm tracking-[0.1em] uppercase rounded-full hover:bg-white transition-colors"
            >
              <Phone size={16} />
              Chiama Ora
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 sm:px-6 lg:px-12 py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-display text-white uppercase tracking-tight mb-6">
            Serve assistenza?
          </h2>
          <p className="text-white/60 text-lg mb-8 max-w-2xl mx-auto">
            Contattaci subito per ricevere supporto tecnico professionale.
            Siamo a tua disposizione per ogni esigenza.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+390374871615"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-neon-cyan text-void-black font-medium text-sm tracking-[0.1em] uppercase rounded-full hover:bg-white transition-colors"
            >
              <Phone size={16} />
              Chiama Ora
            </a>
            <a
              href="mailto:info@spaziogame.net"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white/10 text-white font-medium text-sm tracking-[0.1em] uppercase rounded-full hover:bg-white/20 transition-colors"
            >
              Scrivici
            </a>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
