
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">Municipalidad</h3>
            <p className="text-gray-400">Dirección: Av. Principal 123</p>
            <p className="text-gray-400">Teléfono: +56 2 1234 5678</p>
            <p className="text-gray-400">Horario: Lunes a Viernes de 8:30 a 14:00</p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Enlaces de Interés</h3>
            <ul className="space-y-2">
              <li><a href="#transparencia" className="text-gray-400 hover:text-white">Transparencia</a></li>
              <li><a href="#trabaja" className="text-gray-400 hover:text-white">Trabaja con Nosotros</a></li>
              <li><a href="#contacto" className="text-gray-400 hover:text-white">Contacto</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Síguenos</h3>
            <div className="flex space-x-4">
              {/* Placeholder icons */}
              <a href="#" className="text-gray-400 hover:text-white">FB</a>
              <a href="#" className="text-gray-400 hover:text-white">TW</a>
              <a href="#" className="text-gray-400 hover:text-white">IG</a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-4 border-t border-gray-700 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} I. Municipalidad. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
