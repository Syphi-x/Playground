export function Footer() {
  return (
    <footer className="bg-[#0D1E40] text-white mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest mb-3 text-white/60">
              Acerca de
            </h4>
            <ul className="space-y-2 text-sm text-white/80">
              {["Gobierno del Estado", "Secretarías", "Transparencia"].map(
                (l) => (
                  <li key={l}>
                    <a href="#" className="hover:text-white hover:underline">
                      {l}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest mb-3 text-white/60">
              Servicios
            </h4>
            <ul className="space-y-2 text-sm text-white/80">
              {["Trámites", "Programas Sociales", "Atención Ciudadana"].map(
                (l) => (
                  <li key={l}>
                    <a href="#" className="hover:text-white hover:underline">
                      {l}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest mb-3 text-white/60">
              Contacto
            </h4>
            <ul className="space-y-2 text-sm text-white/80">
              <li>Palacio de Gobierno</li>
              <li>Chihuahua, Chihuahua</li>
              <li>Tel: (614) 429-3300</li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest mb-3 text-white/60">
              Legal
            </h4>
            <ul className="space-y-2 text-sm text-white/80">
              {["Aviso de Privacidad", "Términos de Uso", "Accesibilidad"].map(
                (l) => (
                  <li key={l}>
                    <a href="#" className="hover:text-white hover:underline">
                      {l}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 text-center space-y-1">
          <p className="text-sm text-white/60">
            Gobierno del Estado de Chihuahua • Partido Acción Nacional
          </p>
          <p className="text-xs text-white/40">
            Última actualización: {new Date().toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
      </div>
    </footer>
  );
}
