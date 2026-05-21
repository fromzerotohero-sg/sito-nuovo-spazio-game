import PageLayout from '../components/PageLayout';
import { Check, Shield, Lightbulb, Box } from 'lucide-react';

export default function CabinetPage() {
  return (
    <PageLayout title="Cabinet">
      {/* Intro */}
      <section className="px-6 lg:px-12 pb-16">
        <div className="max-w-6xl mx-auto">
          <p className="text-white/60 text-lg leading-relaxed max-w-3xl">
            Il cabinet Earth di Spazio Game è progettato per valorizzare qualsiasi sala da gioco.
            Pratico, facile da trasportare e compatibile con tutte le schede presenti sul mercato.
            Disponibile anche in versione blindata.
          </p>
        </div>
      </section>

      {/* Main Showcase */}
      <section className="px-6 lg:px-12 py-16 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Image */}
            <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-void-dark">
              <img
                src="/cabinet-earth.jpg"
                alt="Cabinet Earth"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-void-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6">
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-neon-cyan/20 text-neon-cyan text-xs tracking-[0.2em] uppercase rounded-full border border-neon-cyan/30">
                  <Shield size={12} />
                  Disponibile versione blindata
                </span>
              </div>
            </div>

            {/* Details */}
            <div>
              <h2 className="text-4xl md:text-5xl font-display text-white uppercase tracking-tight mb-2">
                Earth
              </h2>
              <p className="text-white/40 text-sm tracking-[0.2em] uppercase mb-8">Cabinet Mobile</p>

              {/* Design */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb size={16} className="text-neon-cyan" />
                  <h4 className="text-white/80 text-xs tracking-[0.2em] uppercase">Design</h4>
                </div>
                <p className="text-white/60 text-sm leading-relaxed pl-6">
                  Il mobile &quot;Earth&quot; valorizza la propria sala da gioco, adatto a qualsiasi ambiente,
                  pratico e facile da trasportare, compatibile con tutte le schede presenti sul mercato.
                </p>
              </div>

              {/* Dati Tecnici */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <Box size={16} className="text-neon-cyan" />
                  <h4 className="text-white/80 text-xs tracking-[0.2em] uppercase">Dati Tecnici</h4>
                </div>
                <ul className="space-y-2 pl-6">
                  {[
                    'Hopper cctalk: (Azkoyen - Alberici)',
                    'Gettoniera cctalk: (Azkoyen - Alberici)',
                    'Separatore cctalk: (Azkoyen - Alberici)',
                    'Monitor 19"'
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-white/60 text-sm">
                      <Check size={14} className="text-neon-cyan shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Accessori */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <Box size={16} className="text-neon-cyan" />
                  <h4 className="text-white/80 text-xs tracking-[0.2em] uppercase">Accessori</h4>
                </div>
                <ul className="space-y-2 pl-6">
                  {[
                    'Hopper con carrello estraibile',
                    'Testatina luminosa personalizzabile',
                    'Porta documenti',
                    'Porta minuterie'
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-white/60 text-sm">
                      <Check size={14} className="text-neon-cyan shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Blindato */}
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <Shield size={16} className="text-neon-cyan" />
                  <h4 className="text-white/80 text-xs tracking-[0.2em] uppercase">Blindato</h4>
                </div>
                <p className="text-white/60 text-sm pl-6">
                  Disponibile in versione blindata per maggiore sicurezza.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-6 lg:px-12 py-16 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl font-display text-white uppercase tracking-tight mb-8 text-center">
            Caratteristiche Principali
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: 'Compatibile', desc: 'Compatibile con tutte le schede presenti sul mercato, inclusi Master 5 e Super 7.' },
              { title: 'Trasportabile', desc: 'Design pratico e facile da trasportare, ideale per qualsiasi ambiente.' },
              { title: 'Personalizzabile', desc: 'Testatina luminosa personalizzabile per valorizzare la tua sala.' },
            ].map((feature) => (
              <div key={feature.title} className="p-6 bg-white/5 rounded-lg border border-white/10">
                <h4 className="text-white font-medium mb-2">{feature.title}</h4>
                <p className="text-white/50 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 lg:px-12 py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-display text-white uppercase tracking-tight mb-6">
            Valuta il tuo nuovo cabinet
          </h2>
          <p className="text-white/60 text-lg mb-8 max-w-2xl mx-auto">
            Contattaci per scoprire le caratteristiche complete del cabinet Earth e ricevere
            un preventivo personalizzato per la tua sala.
          </p>
          <a
            href="mailto:info@spaziogame.net"
            className="inline-flex items-center gap-3 px-8 py-4 bg-neon-cyan text-void-black font-medium text-sm tracking-[0.1em] uppercase rounded-full hover:bg-white transition-colors"
          >
            Richiedi Preventivo
          </a>
        </div>
      </section>
    </PageLayout>
  );
}
