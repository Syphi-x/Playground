import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";

export type Section =
  | "jardin"
  | "instalaciones"
  | "actividades"
  | "ubicaciones";
interface HeaderProps {
  activeSection: Section;
  onSectionChange: (section: Section) => void;
}

const navItems: { id: Section; label: string }[] = [
  { id: "jardin", label: "Jardín del Abuelo" },
  { id: "instalaciones", label: "Instalaciones" },
  { id: "actividades", label: "Actividades" },
  { id: "ubicaciones", label: "Ubicaciones" },
];

const contactItems = [
  {
    label: "Dirección",
    value: "Av. Zarco No. 2437, Col. Zarco, Chihuahua, Chih, 31020",
  },
  { label: "Teléfono", value: "(614) 411-8550" },
  { label: "E-mail", value: "pan@panchihuahua.org.mx" },
  {
    label: "Horarios de atención",
    value: "Lunes a viernes de 09:00 a 17:00 hrs",
  },
];

export function Header({ activeSection, onSectionChange }: HeaderProps) {
  const [officialDate, setOfficialDate] = useState("");
  const [contactMenuOpen, setContactMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const contactMenuRef = useRef<HTMLDivElement | null>(null);

  const formatOfficialDate = (date: Date) =>
    new Intl.DateTimeFormat("es-MX", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(date);

  useEffect(() => {
    setOfficialDate(formatOfficialDate(new Date()));
    const id = setInterval(
      () => setOfficialDate(formatOfficialDate(new Date())),
      60_000,
    );
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        contactMenuRef.current &&
        !contactMenuRef.current.contains(e.target as Node)
      ) {
        setContactMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const copyToClipboard = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(value);
      setTimeout(() => setCopiedField(null), 1600);
    } catch {
      /* ignore */
    }
  };

  const handleSectionChange = (section: Section) => {
    onSectionChange(section);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header className="border-b-4 border-[#14468C] bg-white sticky top-0 z-50 shadow-sm">
      {/* ── Top bar ─────────────────────────────────────── */}
      <div className="bg-[#0D1E40] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between min-h-[72px] py-3">
            {/* Left: logo + date + party */}
            <div className="flex items-center gap-4">
              <img
                src="/pan.png"
                alt="PAN Chihuahua"
                className="h-10 md:h-12 w-auto object-contain shrink-0"
                loading="eager"
              />
              <div className="hidden md:block text-sm">
                <p className="capitalize">{officialDate}</p>
                <p className="text-white/70 text-xs">Partido Acción Nacional</p>
              </div>
            </div>

            {/* Right: contacto */}
            <div className="flex items-center gap-4">
              <div className="relative" ref={contactMenuRef}>
                <button
                  type="button"
                  className="text-sm hover:underline"
                  onClick={() => setContactMenuOpen((o) => !o)}
                >
                  Contacto
                </button>

                {contactMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-80 max-w-[90vw] rounded border border-white/15 bg-[#0D1E40] p-4 shadow-xl z-50">
                    <p className="text-xs tracking-widest uppercase mb-3 text-white/60">
                      Contacto PAN Chihuahua
                    </p>
                    <div className="space-y-1">
                      {contactItems.map((item) => (
                        <button
                          key={item.label}
                          type="button"
                          className="w-full text-left px-2 py-2 rounded hover:bg-white/10 transition-colors"
                          onClick={() => copyToClipboard(item.value)}
                        >
                          <p className="text-[10px] uppercase tracking-wide text-white/60">
                            {item.label}
                          </p>
                          <p className="text-sm">{item.value}</p>
                          {copiedField === item.value && (
                            <p className="text-[10px] text-green-400 mt-0.5">
                              Copiado
                            </p>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile hamburger */}
              <button
                className="md:hidden"
                onClick={() => setMobileMenuOpen((o) => !o)}
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-3">
          <h1 className="text-2xl md:text-3xl font-bold text-[#14468C] tracking-tight">
            Casas hogar adultos mayores
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Partido Acción Nacional — Chihuahua
          </p>
        </div>

        <nav className="border-t border-gray-200 hidden md:block">
          <div className="flex items-center gap-1 py-1 overflow-x-auto">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSectionChange(item.id)}
                className={
                  activeSection === item.id ? "nav-link-active" : "nav-link"
                }
              >
                {item.label}
              </button>
            ))}
          </div>
        </nav>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-2 flex flex-col gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSectionChange(item.id)}
                className={`text-left px-3 py-2.5 text-sm font-medium rounded transition-colors ${
                  activeSection === item.id
                    ? "bg-blue-50 text-[#14468C] font-bold"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
