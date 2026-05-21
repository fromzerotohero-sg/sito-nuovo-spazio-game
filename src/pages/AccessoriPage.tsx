import PageLayout from '../components/PageLayout';
import { Check, Lamp, Armchair, ArrowRightLeft, Columns } from 'lucide-react';

export default function AccessoriPage() {
  const categories = [
    {
      icon: <Columns size={24} />,
      title: 'Divisori',
      desc: 'Divisori professionali per organizzare gli spazi di gioco. Design moderno e robustezza per un uso intensivo.',
      features: [
        'Separazione ottimale tra postazioni',
        'Materiali di alta qualità',
        'Design personalizzabile',
        'Installazione semplice',
      ],
    },
    {
      icon: <Armchair size={24} />,
      title: 'Sgabelli',
      desc: 'Sgabelli ergonomici progettati per il comfort dei giocatori durante le sessioni di gioco.',
      features: [
        'Seduta ergonomica e confortevole',
        'Regolazione in altezza',
        'Base stabile e resistente',
        'Rivestimento in eco-pelle',
      ],
    },
    {
      icon: <ArrowRightLeft size={24} />,
      title: 'Cambia Cambia',
      desc: 'Dispositivo per la gestione dei cambi automatico, indispensabile per le sale giochi professionali.',
      features: [
        'Gestione automatica cambi',
        'Compatibile con tutti i sistemi',
        'Velocità di erogazione rapida',
        'Manutenzione semplificata',
      ],
    },
    {
      icon: <Lamp size={24} />,
      title: 'Separè',
      desc: 'Elementi divisori con illuminazione LED per creare ambienti accoglienti e moderni.',
      features: [
        'Illuminazione LED integrata',
        'Design moderno ed elegante',
        'Vari colori disponibili',
        'Facile da posizionare',
      ],
    },
  ];

  return (
    <PageLayout title="Accessori">
      {/* Intro */}
      <section className="px-6 lg:px-12 pb-16">
        <div className="max-w-6xl mx-auto">
          <p className="text-white/60 text-lg leading-relaxed max-w-3xl">
            Completiamo la tua sala giochi con una gamma completa di accessori: divisori, sgabelli,
            cambia-cambia e separè. Ogni accessorio è selezionato per garantire qualità, durata
            e un design che valorizza il tuo spazio.
          </p>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="px-6 lg:px-12 py-16 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {categories.map((cat) => (
              <div key={cat.title} className="group p-8 bg-white/5 rounded-lg border border-white/10 hover:border-neon-cyan/50 transition-all duration-300">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-neon-cyan/10 rounded-lg text-neon-cyan">
                    {cat.icon}
                  </div>
                  <h3 className="text-2xl font-display text-white uppercase tracking-tight">
                    {cat.title}
                  </h3>
                </div>
                <p className="text-white/60 text-sm leading-relaxed mb-6">{cat.desc}</p>
                <ul className="space-y-2">
                  {cat.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-white/50 text-sm">
                      <Check size={14} className="text-neon-cyan shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Showcase */}
      <section className="px-6 lg:px-12 py-16 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl font-display text-white uppercase tracking-tight mb-12 text-center">
            I Nostri Prodotti
          </h3>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Sgabelli */}
            <div className="rounded-lg overflow-hidden bg-void-dark border border-white/10">
              <div className="aspect-square">
                <img
                  src="/sgabelli.jpg"
                  alt="Sgabelli"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h4 className="text-white font-medium mb-2">Sgabelli Gaming</h4>
                <p className="text-white/50 text-sm">Ergonimici e resistenti, ideali per sessioni di gioco prolungate.</p>
              </div>
            </div>

            {/* Divisori */}
            <div className="rounded-lg overflow-hidden bg-void-dark border border-white/10">
              <div className="aspect-square">
                <img
                  src="/accessori-divisori.jpg"
                  alt="Divisori"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h4 className="text-white font-medium mb-2">Divisori</h4>
                <p className="text-white/50 text-sm">Per organizzare gli spazi e creare zone di gioco separate.</p>
              </div>
            </div>

            {/* Separè */}
            <div className="rounded-lg overflow-hidden bg-void-dark border border-white/10">
              <div className="aspect-square">
                <img
                  src="/separatore.jpg"
                  alt="Separè"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h4 className="text-white font-medium mb-2">Separè LED</h4>
                <p className="text-white/50 text-sm">Divisori illuminati per ambienti moderni ed eleganti.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brands */}
      <section className="px-6 lg:px-12 py-16 border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-2xl font-display text-white uppercase tracking-tight mb-6">
            Marchi Disponibili
          </h3>
          <p className="text-white/60 mb-8">
            Lavoriamo con i migliori marchi del settore per garantire qualità e affidabilità.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {['Alberici', 'Baldazzi', 'Azkoyen'].map((brand) => (
              <span
                key={brand}
                className="px-6 py-3 bg-white/5 border border-white/10 rounded-full text-white/60 text-sm"
              >
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 lg:px-12 py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-display text-white uppercase tracking-tight mb-6">
            Completa la tua sala
          </h2>
          <p className="text-white/60 text-lg mb-8 max-w-2xl mx-auto">
            Scopri tutti gli accessori disponibili e crea la sala giochi perfetta.
            Contattaci per un preventivo personalizzato.
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
