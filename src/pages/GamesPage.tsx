import PageLayout from '../components/PageLayout';
import { Download, Monitor, CircuitBoard, Joystick } from 'lucide-react';

export default function GamesPage() {
  return (
    <PageLayout title="Games">
      {/* Intro */}
      <section className="px-6 lg:px-12 pb-16">
        <div className="max-w-6xl mx-auto">
          <p className="text-white/60 text-lg leading-relaxed max-w-3xl">
            Spazio Game offre schede di gioco comma 6a con payout al 65%, complete di cabinet e monitor.
            Le nostre schede includono multigame con 7 titoli diversi, hardware affidabile e supporto tecnico dedicato.
          </p>
        </div>
      </section>

      {/* Master 5 */}
      <section className="px-6 lg:px-12 py-16 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Image */}
            <div className="relative aspect-video rounded-lg overflow-hidden bg-void-dark">
              <img
                src="/master5-game.jpg"
                alt="Master 5 - Scheda di gioco"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-void-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4">
                <span className="text-neon-cyan text-xs tracking-[0.2em] uppercase">Scheda Comma 6a</span>
                <h3 className="text-white text-2xl font-display mt-1">Master 5</h3>
              </div>
            </div>

            {/* Details */}
            <div>
              <h2 className="text-4xl md:text-5xl font-display text-white uppercase tracking-tight mb-6">
                Master 5
              </h2>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <CircuitBoard size={18} className="text-neon-cyan" />
                  <span className="text-white/60 text-sm"><strong className="text-white">Hardware:</strong> ASTX-R1</span>
                </div>
                <div className="flex items-center gap-3">
                  <Joystick size={18} className="text-neon-cyan" />
                  <span className="text-white/60 text-sm"><strong className="text-white">Payout:</strong> 65%</span>
                </div>
                <div className="flex items-center gap-3">
                  <Monitor size={18} className="text-neon-cyan" />
                  <span className="text-white/60 text-sm"><strong className="text-white">Schermo:</strong> Monitor 19&quot; compatibile</span>
                </div>
              </div>

              <h4 className="text-white/80 text-xs tracking-[0.2em] uppercase mb-4">Giochi Inclusi (7 titoli)</h4>
              <div className="grid grid-cols-2 gap-2 mb-8">
                {['Clash for the Empire', 'Farms Gold', 'Fruit Bar', 'Jungle Course', 'Pendragon', 'West Cowboy', 'Wild Galleon'].map((game) => (
                  <div key={game} className="flex items-center gap-2 text-white/60 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan" />
                    {game}
                  </div>
                ))}
              </div>

              <button className="flex items-center gap-3 px-6 py-3 bg-neon-cyan text-void-black font-medium text-sm tracking-[0.1em] uppercase rounded-full hover:bg-white transition-colors">
                <Download size={16} />
                Scarica Scheda Esplicativa
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Super 7 */}
      <section className="px-6 lg:px-12 py-16 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Details - reversed order */}
            <div className="order-2 lg:order-1">
              <h2 className="text-4xl md:text-5xl font-display text-white uppercase tracking-tight mb-6">
                Super 7
              </h2>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <CircuitBoard size={18} className="text-neon-cyan" />
                  <span className="text-white/60 text-sm"><strong className="text-white">Hardware:</strong> G_640S</span>
                </div>
                <div className="flex items-center gap-3">
                  <Joystick size={18} className="text-neon-cyan" />
                  <span className="text-white/60 text-sm"><strong className="text-white">Payout:</strong> 65%</span>
                </div>
                <div className="flex items-center gap-3">
                  <Monitor size={18} className="text-neon-cyan" />
                  <span className="text-white/60 text-sm"><strong className="text-white">Schermo:</strong> Monitor 19&quot; compatibile</span>
                </div>
              </div>

              <h4 className="text-white/80 text-xs tracking-[0.2em] uppercase mb-4">Giochi Inclusi (5 titoli)</h4>
              <div className="grid grid-cols-2 gap-2 mb-8">
                {["Pirate's Treasure", 'The Book of Egypt', 'Irish Gardens', 'Diamonds Fever', 'The Chicken'].map((game) => (
                  <div key={game} className="flex items-center gap-2 text-white/60 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan" />
                    {game}
                  </div>
                ))}
              </div>

              <button className="flex items-center gap-3 px-6 py-3 bg-neon-cyan text-void-black font-medium text-sm tracking-[0.1em] uppercase rounded-full hover:bg-white transition-colors">
                <Download size={16} />
                Scarica Scheda Esplicativa
              </button>
            </div>

            {/* Image */}
            <div className="order-1 lg:order-2 relative aspect-video rounded-lg overflow-hidden bg-void-dark">
              <img
                src="/super7-game.jpg"
                alt="Super 7 - Scheda di gioco"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-void-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4">
                <span className="text-neon-cyan text-xs tracking-[0.2em] uppercase">Scheda Comma 6a</span>
                <h3 className="text-white text-2xl font-display mt-1">Super 7</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 lg:px-12 py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-display text-white uppercase tracking-tight mb-6">
            Vuoi saperne di più?
          </h2>
          <p className="text-white/60 text-lg mb-8 max-w-2xl mx-auto">
            Contattaci per ricevere informazioni dettagliate sulle nostre schede di gioco,
            i giochi disponibili e le condizioni commerciali.
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
