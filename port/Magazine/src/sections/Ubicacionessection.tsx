import { MapPin, Phone, Clock } from "lucide-react";

const ubicaciones = [
  {
    nombre: "Casa del Abuelo – Ciudad Deportiva",
    direccion: "Calle 27 S/N, en la Ciudad Deportiva",
    telefono: "(614) 414-83-63",
    horario: "7am–8pm lunes a viernes",
    destacada: true,
  },
  {
    nombre: "Casa Suroeste",
    direccion: "Calle Buena Vista No. 8014, colonia Genaro Vázquez",
    telefono: "(614) 452-24-95",
    horario: "7am–8pm lunes a viernes",
    destacada: false,
  },
  {
    nombre: "Casa Norte",
    direccion:
      "Calle Aguilar Sáenz esquina con María Bejarano, colonia Barrio del Norte",
    telefono: "(614) 421-55-47",
    horario: "7am–8pm lunes a viernes",
    destacada: false,
  },
  {
    nombre: "Casa Sur",
    direccion: "Calle 42ª y Jiménez, colonia Pacífico",
    telefono: "(614) 418-96-67",
    horario: "7am–8pm lunes a viernes",
    destacada: false,
  },
];

export function UbicacionesSection() {
  return (
    <div className="space-y-8">
      <div>
        <div className="section-badge mb-3">JARDÍN DEL ABUELO</div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          Ubicaciones en Chihuahua
        </h2>
        <p className="text-gray-600 leading-relaxed">
          El horario de servicio es de 7:00 a.m. a 8:00 p.m. de lunes a viernes.
          Los servicios son totalmente gratuitos y están dirigidos a personas de
          60 años en adelante con el objetivo de mejorar su mejor calidad de
          vida.
        </p>
      </div>

      {/* Locations grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {ubicaciones.map((ub) => (
          <div
            key={ub.nombre}
            className={`location-card ${
              ub.destacada
                ? "border-l-4 border-l-[#14468C] border-[#14468C]/30"
                : ""
            }`}
          >
            {ub.destacada && (
              <span className="text-xs font-bold text-[#14468C] uppercase tracking-wider mb-2 block">
                Sede principal
              </span>
            )}
            <h3 className="font-bold text-gray-900 mb-3 text-sm">
              {ub.nombre}
            </h3>
            <div className="space-y-2">
              <div className="flex items-start gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4 mt-0.5 text-[#14468C] shrink-0" />
                <span>{ub.direccion}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="w-4 h-4 text-[#14468C] shrink-0" />
                <span>{ub.telefono}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4 text-[#14468C] shrink-0" />
                <span>{ub.horario}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Info box */}
      <div className="bg-gray-50 border border-gray-200 p-5 space-y-3">
        <h3 className="font-bold text-gray-900 flex items-center gap-2">
          Requisitos de Inscripción
        </h3>
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
        <div className="pt-2 border-t border-gray-200">
          <p className="text-xs text-gray-500 font-medium">Contacto General:</p>
          <p className="text-sm text-gray-700">
            Secretaría de Desarrollo Social
          </p>
          <p className="text-sm text-gray-700">
            Gobierno del Estado de Chihuahua
          </p>
        </div>
      </div>

      {/* Quick links */}
      <div className="border border-gray-200 p-5">
        <h3 className="font-bold text-gray-800 mb-3 text-sm uppercase tracking-wide">
          Enlaces Rápidos
        </h3>
        <ul className="space-y-2">
          {[
            "» Inscripciones",
            "» Calendario de Actividades",
            "» Galería de Fotos",
            "» Testimonios",
            "» Preguntas Frecuentes",
            "» Contacto",
          ].map((link) => (
            <li key={link}>
              <a href="#" className="text-sm text-[#14468C] hover:underline">
                {link}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
