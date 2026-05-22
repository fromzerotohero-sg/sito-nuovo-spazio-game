import PageLayout from '../components/PageLayout';
import SiteImage from '../components/SiteImage';
import { Monitor, Check } from 'lucide-react';

export default function MonitorPage() {
  const monitors = [
    {
      size: '17"',
      ratio: '4:3',
      type: 'LCD',
      desc: 'Monitor LCD 17 pollici con rapporto 4:3, ideale per installazioni compatte.',
      features: ['Risoluzione ottimale per giochi comma 6a', 'Compatibile con tutte le schede', 'Durata elevata', 'Consumo ridotto'],
    },
    {
      size: '19"',
      ratio: '4:3',
      type: 'LCD',
      desc: 'Monitor LCD 19 pollici con rapporto 4:3, standard del settore per sale giochi.',
      features: ['Display luminoso e nitido', 'Angolo di visione ampio', 'Montaggio semplificato', 'Progettato per uso continuativo'],
    },
    {
      size: '19"',
      ratio: '4:3',
      type: 'LED',
      desc: 'Monitor LED 19 pollici con retroilluminazione LED, massima luminosità e risparmio energetico.',
      features: ['Retroilluminazione LED', 'Consumo energetico ridotto', 'Colori brillanti e saturi', 'Durata superiore ai LCD tradizionali'],
    },
  ];

  return (
    <PageLayout title="Monitor">
      {/* Intro */}
      <section className="px-4 sm:px-6 lg:px-12 pb-16">
        <div className="max-w-6xl mx-auto">
          <p className="text-white/60 text-lg leading-relaxed max-w-3xl">
            Spazio Game offre monitor open-frame da 17&quot;, 19&quot; LCD e 19&quot; LED in formato 4:3,
            progettati specificatamente per l&apos;installazione in cabinet da gioco. Monitor affidabili,
            luminosi e compatibili con tutte le schede comma 6a.
          </p>
        </div>
      </section>

      {/* Monitor Types */}
      <section className="px-4 sm:px-6 lg:px-12 py-16 border-t border-white/10">
        <div className="max-w-6xl mx-auto space-y-16">
          {monitors.map((mon, index) => (
            <div key={`${mon.size}-${mon.type}`} className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
              {/* Image side */}
              <div className={index % 2 === 1 ? 'order-1 lg:order-2' : ''}>
                <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-void-dark flex items-center justify-center">
                  <SiteImage
                    assetKey="page.monitor.hero"
                    fallback="/monitor-open.jpg"
                    alt={`Monitor ${mon.size} ${mon.type}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-void-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6">
                    <span className="text-neon-cyan text-xs tracking-[0.2em] uppercase">Open-Frame</span>
                    <h3 className="text-white text-3xl font-display mt-1">{mon.size} {mon.type}</h3>
                  </div>
                </div>
              </div>

              {/* Content side */}
              <div className={index % 2 === 1 ? 'order-2 lg:order-1' : ''}>
                <div className="flex items-center gap-3 mb-4">
                  <Monitor size={20} className="text-neon-cyan" />
                  <span className="text-neon-cyan text-xs tracking-[0.2em] uppercase">{mon.type}</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-display text-white uppercase tracking-tight mb-4">
                  {mon.size}
                </h2>
                <p className="text-white/40 text-sm mb-6">Rapporto {mon.ratio}</p>
                <p className="text-white/60 text-sm leading-relaxed mb-6">{mon.desc}</p>

                <h4 className="text-white/80 text-xs tracking-[0.2em] uppercase mb-4">Caratteristiche</h4>
                <ul className="space-y-2">
                  {mon.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-white/60 text-sm">
                      <Check size={14} className="text-neon-cyan shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Specs Table */}
      <section className="px-4 sm:px-6 lg:px-12 py-16 border-t border-white/10">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-display text-white uppercase tracking-tight mb-8 text-center">
                Confronto Modelli
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left py-4 px-4 text-white/60 text-xs tracking-[0.2em] uppercase">Modello</th>
                  <th className="text-center py-4 px-4 text-white/60 text-xs tracking-[0.2em] uppercase">Dimensione</th>
                  <th className="text-center py-4 px-4 text-white/60 text-xs tracking-[0.2em] uppercase">Tipo</th>
                  <th className="text-center py-4 px-4 text-white/60 text-xs tracking-[0.2em] uppercase">Rapporto</th>
                  <th className="text-center py-4 px-4 text-white/60 text-xs tracking-[0.2em] uppercase">Ideale per</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-white/5">
                  <td className="py-4 px-4 text-white text-sm">LCD 17&quot;</td>
                  <td className="py-4 px-4 text-white/60 text-sm text-center">17 pollici</td>
                  <td className="py-4 px-4 text-neon-cyan text-sm text-center">LCD</td>
                  <td className="py-4 px-4 text-white/60 text-sm text-center">4:3</td>
                  <td className="py-4 px-4 text-white/60 text-sm text-center">Installazioni compatte</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-4 px-4 text-white text-sm">LCD 19&quot;</td>
                  <td className="py-4 px-4 text-white/60 text-sm text-center">19 pollici</td>
                  <td className="py-4 px-4 text-neon-cyan text-sm text-center">LCD</td>
                  <td className="py-4 px-4 text-white/60 text-sm text-center">4:3</td>
                  <td className="py-4 px-4 text-white/60 text-sm text-center">Standard sala giochi</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 text-white text-sm">LED 19&quot;</td>
                  <td className="py-4 px-4 text-white/60 text-sm text-center">19 pollici</td>
                  <td className="py-4 px-4 text-neon-cyan text-sm text-center">LED</td>
                  <td className="py-4 px-4 text-white/60 text-sm text-center">4:3</td>
                  <td className="py-4 px-4 text-white/60 text-sm text-center">Massima luminosità</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 sm:px-6 lg:px-12 py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-display text-white uppercase tracking-tight mb-6">
            Scegli il monitor perfetto
          </h2>
          <p className="text-white/60 text-lg mb-8 max-w-2xl mx-auto">
            Contattaci per ricevere informazioni dettagliate sui nostri monitor open-frame
            e trovare la soluzione ideale per i tuoi cabinet.
          </p>
          <a
            href="mailto:info@spaziogame.net"
            className="inline-flex items-center gap-3 px-8 py-4 bg-neon-cyan text-void-black font-medium text-sm tracking-[0.1em] uppercase rounded-full hover:bg-white transition-colors"
          >
            Richiedi Informazioni
          </a>
        </div>
      </section>
    </PageLayout>
  );
}
