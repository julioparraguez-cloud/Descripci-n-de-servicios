
import React, { useState, useEffect } from 'react';
import type { Noticia, Programa } from '../types';
import { onSnapshot } from '../services/firestoreMock';
import { ICONS } from '../constants';

const Inicio: React.FC = () => {
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [programas, setProgramas] = useState<Programa[]>([]);

  useEffect(() => {
    const unsubNoticias = onSnapshot<Noticia>('noticias', (data) => {
      setNoticias(data.filter(n => n.esDestacado).slice(0, 3));
    });
    const unsubProgramas = onSnapshot<Programa>('programas', (data) => {
      setProgramas(data.filter(p => p.estado === 'últimos cupos').slice(0, 3));
    });

    return () => {
      unsubNoticias();
      unsubProgramas();
    };
  }, []);

  const quickAccessItems = [
    { label: 'Trámites', href: '#tramites', icon: ICONS.file },
    { label: 'Programas', href: '#programas', icon: ICONS.users },
    { label: 'Vive tu Comuna', href: '#vive', icon: ICONS.map },
    { label: 'Participa', href: '#participa', icon: ICONS.chat },
    { label: 'El Municipio', href: '#municipio', icon: ICONS.building },
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="bg-blue-600 text-white rounded-lg p-8 md:p-12 text-center shadow-lg">
        <h1 className="text-3xl md:text-5xl font-bold mb-4">Bienvenido al Portal Municipal</h1>
        <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-3xl mx-auto">Tu centro de comandos para acceder a todos los servicios y programas que la municipalidad tiene para ti.</p>
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
          <a href="#tramites" className="bg-white text-blue-600 font-bold py-3 px-8 rounded-full text-lg hover:bg-blue-50 transition-transform hover:scale-105 shadow">
            Pagar en Línea
          </a>
          <a href="#programas" className="bg-blue-800 text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-blue-900 transition-transform hover:scale-105 shadow">
            Explorar Programas
          </a>
        </div>
      </section>

      {/* Quick Access Grid */}
      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Accesos Rápidos</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {quickAccessItems.map(item => (
            <a key={item.href} href={item.href} className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all text-center text-gray-700 hover:text-blue-600">
              <div className="flex justify-center items-center text-blue-600 mb-3">{item.icon}</div>
              <span className="font-semibold">{item.label}</span>
            </a>
          ))}
        </div>
      </section>

      {/* Dynamic Highlights */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Noticias Destacadas</h2>
          <div className="space-y-6">
            {noticias.map(noticia => (
              <div key={noticia.id} className="flex bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <img src={noticia.imagenUrl} alt={noticia.titulo} className="w-1/3 object-cover" />
                <div className="p-4 flex flex-col">
                  <h3 className="font-bold text-lg mb-2">{noticia.titulo}</h3>
                  <p className="text-gray-600 text-sm flex-grow">{noticia.resumen}</p>
                  <a href="#" className="text-blue-600 hover:underline mt-2 self-start font-medium">Leer más</a>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Programas por Iniciar</h2>
          <div className="space-y-4">
            {programas.map(programa => (
              <a href="#programas" key={programa.id} className="block bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-lg">{programa.titulo}</h3>
                    <p className="text-sm text-gray-500">{programa.publico.join(', ')}</p>
                  </div>
                  {programa.estado === 'últimos cupos' && (
                    <span className="bg-red-100 text-red-700 text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                      ¡Últimos Cupos!
                    </span>
                  )}
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Inicio;
