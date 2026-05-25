const noticias = [
  {
    cat: "JARDÍN DEL ABUELO",
    catColor: "text-[#14468C]",
    titulo: "Convive Maru Campos con adultos mayores en la Casa del Abuelo",
  },
  {
    cat: "EDUCACIÓN",
    catColor: "text-green-700",
    titulo: "Nuevos talleres de computación disponibles",
  },
  {
    cat: "SALUD",
    catColor: "text-red-700",
    titulo: "Programa de salud preventiva para adultos mayores",
  },
  {
    cat: "ACTIVIDADES",
    catColor: "text-orange-700",
    titulo: "Registro abierto para actividades de marzo",
  },
  {
    cat: "EVENTOS",
    catColor: "text-purple-700",
    titulo: "Celebración del Día del Adulto Mayor",
  },
];

export function Sidebar() {
  return (
    <aside className="space-y-5 lg:sticky lg:top-[160px]">
      <div className="sidebar-card">
        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-800 mb-4">
          Noticias Importantes
        </h3>
        <div className="space-y-3">
          {noticias.map((n) => (
            <div
              key={n.titulo}
              className="news-item cursor-pointer hover:scale-105 transition-transform duration-300"
            >
              <p
                className={`text-s font-bold uppercase tracking-wide ${n.catColor}`}
              >
                {n.cat}
              </p>
              <p className="text-sm font-medium text-gray-900 leading-snug mt-0.5">
                {n.titulo}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Información / Requisitos */}
      <div className="sidebar-card">
        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-800 mb-3 flex items-center gap-2">
          Información
        </h3>
        <div className="space-y-3">
          <div>
            <p className="text-xs font-bold text-gray-700 mb-1">
              Requisitos de Inscripción:
            </p>
            <ul className="space-y-1 text-xs text-gray-600">
              {[
                "Tener 60 años o más",
                "Credencial de elector",
                "Comprobante de domicilio",
                "Fotografía tamaño infantil",
              ].map((r) => (
                <li key={r} className="flex items-center gap-1.5">
                  <span className="text-[#14468C]">•</span>
                  {r}
                </li>
              ))}
            </ul>
          </div>
          <div className="border-t border-gray-200 pt-3">
            <p className="text-xs font-bold text-gray-700 mb-1">
              Contacto General:
            </p>
            <p className="text-xs text-gray-600">
              Secretaría de Desarrollo Social
            </p>
            <p className="text-xs text-gray-600">
              Gobierno del Estado de Chihuahua
            </p>
          </div>
        </div>
      </div>

      {/* enlaces rápidos */}
      <div className="sidebar-card">
        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-800 mb-3">
          Enlaces Rápidos
        </h3>
        <ul className="space-y-1.5">
          {[
            "Inscripciones",
            "Calendario de Actividades",
            "Galería de Fotos",
            "Testimonios",
            "Preguntas Frecuentes",
            "Contacto",
          ].map((link) => (
            <li key={link}>
              <a href="#" className="text-xs text-[#14468C] hover:underline">
                » {link}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
