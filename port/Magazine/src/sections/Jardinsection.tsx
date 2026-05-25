import { MapPin, Phone, Clock } from "lucide-react";

export function JardinSection() {
  return (
    <div className="space-y-8">
      {/* Featured Article */}
      <article className="border-b-2 border-gray-200 pb-8">
        <div className="grid lg:grid-cols-2 gap-6 items-start">
          <div className="relative overflow-hidden">
            <img
              src="/jardin.png"
              alt="Jardín del Abuelo - Ciudad Deportiva"
              className="w-full object-cover"
            />
          </div>
          <div className="space-y-4">
            <div className="section-badge">JARDÍN DEL ABUELO</div>
            <h2 className="text-3xl font-bold leading-tight text-gray-900">
              Casa del Abuelo: Un Oasis de Bienestar para los Adultos Mayores en
              la Ciudad Deportiva
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Las instalaciones de la Casa del Abuelo de la Ciudad Deportiva
              cuentan con diferentes áreas, entre las que se encuentran un
              módulo de información, oficina, comedor, aulas de usos múltiples,
              computación y carpintería, ocho salones de uso variable, cancha de
              basquetbol con domo y diversos aparatos para ejercicios.
            </p>
            <div className="flex grid-cols-1 gap-3 pt-4 border-t border-gray-200">
              <div className="flex items-start gap-3 text-sm text-gray-600">
                <Clock className="w-4 h-4 mt-0.5 text-[#14468C] shrink-0" />
                <div>
                  <span className="font-semibold text-gray-800">
                    Horario de servicio
                  </span>
                  <p>7am–8pm lunes a viernes</p>
                </div>
              </div>
              <div className="flex items-start gap-3 text-sm text-gray-600">
                <MapPin className="w-4 h-4 mt-0.5 text-[#14468C] shrink-0" />
                <div>
                  <span className="font-semibold text-gray-800">Ubicación</span>
                  <p>Calle 27 S/N, en la Ciudad Deportiva</p>
                </div>
              </div>
              <div className="flex items-start gap-3 text-sm text-gray-600">
                <Phone className="w-4 h-4 mt-0.5 text-[#14468C] shrink-0" />
                <div>
                  <span className="font-semibold text-gray-800">Teléfono</span>
                  <p>(614) 414-83-63</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>

      <div className="space-y-3">
        <div className="section-badge">COMUNIDAD</div>
        <h3 className="text-xl font-bold text-gray-900">
          Convive Maru Campos con adultos mayores en la Casa del Abuelo
        </h3>
        <p className="text-gray-700 leading-relaxed">
          La gobernadora del estado visitó las instalaciones de la Casa del
          Abuelo para convivir con los adultos mayores que participan en las
          diferentes actividades y programas del centro, reafirmando el
          compromiso del gobierno con el bienestar de la tercera edad en
          Chihuahua.
        </p>
        <div className="overflow-hidden mt-4">
          <img
            src="/abuelos.jpeg"
            alt="Adultos mayores en la Casa del Abuelo"
            className="w-full h-full object-cover object-top"
          />
        </div>
      </div>
    </div>
  );
}
