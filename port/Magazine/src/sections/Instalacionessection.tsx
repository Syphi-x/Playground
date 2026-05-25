export function InstalacionesSection() {
  const instalaciones = [
    {
      nombre: "Salón de actividades físicas",
      descripcion:
        "Amplio espacio con piso laminado y murales artísticos para clases de Zumba, baile, pilates y activación física grupal.",
      imagen: "/instalaciones1.jpg",
    },
    {
      nombre: "Aulas multiusos y talleres",
      descripcion:
        "Salones equipados para manualidades, bisutería, tejido, pintura y carpintería. Espacios diseñados para el aprendizaje y la creatividad.",
      imagen: "/instalaciones2.jpeg",
    },
    {
      nombre: "Aula de computación",
      descripcion:
        "Sala equipada con computadoras e instructores capacitados para enseñar tecnología a los adultos mayores, fomentando su inclusión digital.",
      imagen: "/instalaciones3.jpg",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <div className="section-badge mb-3">JARDÍN DEL ABUELO</div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Instalaciones</h2>
        <p className="text-gray-600 leading-relaxed">
          Las Casas Hogar cuentan con instalaciones modernas y adaptadas para
          las necesidades de los adultos mayores. Conozca cada uno de nuestros
          espacios diseñados para el bienestar y la convivencia.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="overflow-hidden">
          <img
            src="/instalaciones1.jpg"
            alt="Salón de actividades"
            className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="overflow-hidden">
          <img
            src="/instalaciones2.jpeg"
            alt="Actividades grupales"
            className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      </div>

      <div className="overflow-hidden">
        <img
          src="/instalaciones3.jpg"
          alt="Aula de computación"
          className="w-full h-72 object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Details grid */}
      <div className="grid md:grid-cols-3 gap-6 border-t border-gray-200 pt-8">
        {instalaciones.map((inst) => (
          <div key={inst.nombre} className="space-y-3">
            <div className="overflow-hidden">
              <img
                src={inst.imagen}
                alt={inst.nombre}
                className="w-full h-40 object-cover"
              />
            </div>
            <h3 className="font-bold text-gray-900 text-sm">{inst.nombre}</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              {inst.descripcion}
            </p>
          </div>
        ))}
      </div>

      {/* Areas list */}
      <div className="bg-gray-50 border border-gray-200 p-5">
        <h3 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wide">
          Áreas disponibles
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-gray-700">
          {[
            "Módulo de información",
            "Oficina administrativa",
            "Comedor",
            "Aulas de usos múltiples",
            "Aula de computación",
            "Taller de carpintería",
            "8 salones de uso variable",
            "Cancha de basquetbol con domo",
            "Aparatos de ejercicio",
          ].map((area) => (
            <div key={area} className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#14468C] shrink-0" />
              {area}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
