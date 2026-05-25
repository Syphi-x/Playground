import { useState } from "react";
import { Header, type Section } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { Footer } from "./components/Footer";
import { JardinSection } from "./sections/Jardinsection";
import { InstalacionesSection } from "./sections/Instalacionessection";
import { ActividadesSection } from "./sections/Actividadessection";
import { UbicacionesSection } from "./sections/Ubicacionessection";

const sectionTitles: Record<Section, string> = {
  jardin: "Jardín del Abuelo",
  instalaciones: "Instalaciones",
  actividades: "Actividades Disponibles",
  ubicaciones: "Ubicaciones en Chihuahua",
};

function renderSection(section: Section) {
  switch (section) {
    case "jardin":
      return <JardinSection />;
    case "instalaciones":
      return <InstalacionesSection />;
    case "actividades":
      return <ActividadesSection />;
    case "ubicaciones":
      return <UbicacionesSection />;
  }
}

export default function App() {
  const [activeSection, setActiveSection] = useState<Section>("jardin");

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="text-xs text-gray-500 mb-6 flex items-center gap-1">
          <button
            type="button"
            onClick={() => setActiveSection("jardin")}
            className="hover:text-[#14468C] hover:underline"
          >
            Inicio
          </button>
          <span>/</span>
          <span className="text-gray-800 font-medium">
            {sectionTitles[activeSection]}
          </span>
        </nav>

        {/* Main grid */}
        <div className="grid lg:grid-cols-[1fr_300px] gap-8">
          {/* Content area — animated on section change */}
          <div
            key={activeSection}
            className="bg-white border border-gray-200 p-6 md:p-8 animate-fade-in"
          >
            {renderSection(activeSection)}
          </div>

          {/* Sidebar */}
          <Sidebar />
        </div>
      </main>

      <Footer />
    </div>
  );
}
