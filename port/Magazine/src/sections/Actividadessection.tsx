const actividades = [
  "Manualidades",
  "Activación física",
  "Bisutería",
  "Zumba",
  "Tejido",
  "Baile",
  "Pintura",
  "Pilates",
  "Dominó",
  "Yoga",
  "Café literario",
  "Karaoke",
  "Cocina",
  "Taller de velas",
];

export function ActividadesSection() {
  return (
    <div className="space-y-8">
      <div>
        <div className="section-badge mb-3">JARDÍN DEL ABUELO</div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          Actividades Disponibles
        </h2>
        <p className="text-gray-600 leading-relaxed">
          La Casa del Abuelo ofrece una amplia variedad de actividades diseñadas
          para promover el bienestar físico, mental y social de los adultos
          mayores. Todos los programas son completamente gratuitos.
        </p>
      </div>

      {/* Convocatoria image */}
      <div className="border border-gray-200 overflow-hidden">
        <img
          src="/convocatoria.jpeg"
          alt="Te invita a ser parte de La Casa de los Abuelos"
          className="w-full object-contain"
        />
      </div>

      {/* Activities grid */}
      <div>
        <h3 className="font-bold text-gray-800 mb-4 text-sm uppercase tracking-wide">
          Todas las actividades
        </h3>
        <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
          {actividades.map((act) => (
            <div key={act} className="activity-chip">
              {act}
            </div>
          ))}
        </div>
      </div>

      {/* Gallery with activities */}
      <div className="space-y-4 border-t border-gray-200 pt-8">
        <h3 className="font-bold text-gray-900 text-lg">
          Nuestras actividades en acción
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <img
              src="/instalaciones2.jpeg"
              alt="Clases de baile y activación física"
              className="w-full h-52 object-cover"
            />
            <p className="text-xs text-gray-500 font-medium">
              Activación física y baile grupal
            </p>
          </div>
          <div className="space-y-2">
            <img
              src="/instalaciones3.jpg"
              alt="Taller de computación"
              className="w-full h-52 object-cover"
            />
            <p className="text-xs text-gray-500 font-medium">
              Taller de computación e inclusión digital
            </p>
          </div>
        </div>
        <div className="space-y-2">
          <img
            src="/abuelos.jpeg"
            alt="Convivencia y eventos culturales"
            className="w-full h-full object-cover object-top"
          />
          <p className="text-xs text-gray-500 font-medium">
            Eventos culturales y de convivencia
          </p>
        </div>
      </div>

      {/* Requirements */}
      <div className="bg-blue-50 border border-[#14468C]/20 p-5">
        <h3 className="font-bold text-[#14468C] mb-3 flex items-center gap-2">
          <span>📋</span> ¿Cómo inscribirte?
        </h3>
        <p className="text-sm text-gray-700 mb-3">
          Los servicios son gratuitos para personas de 60 años en adelante.
          Requisitos:
        </p>
        <ul className="space-y-1.5 text-sm text-gray-700">
          {[
            "Tener 60 años o más",
            "Credencial de elector vigente",
            "Comprobante de domicilio reciente",
            "Fotografía tamaño infantil",
          ].map((req) => (
            <li key={req} className="flex items-center gap-2">
              <span className="text-[#14468C]">•</span>
              {req}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
