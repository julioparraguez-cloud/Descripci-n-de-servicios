
import React, { useState, useEffect } from 'react';
import type { ConcursoPublico } from '../types';
import { onSnapshot } from '../services/firestoreMock';

const Municipio: React.FC = () => {
    const [concursos, setConcursos] = useState<ConcursoPublico[]>([]);

    useEffect(() => {
        const unsubscribe = onSnapshot<ConcursoPublico>('concursos', setConcursos);
        return () => unsubscribe();
    }, []);

    return (
        <div className="space-y-12">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4">El Municipio</h1>

            <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Autoridades</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
                        <img src="https://picsum.photos/100/100?random=mayor" alt="Alcalde" className="w-24 h-24 rounded-full object-cover" />
                        <div>
                            <h3 className="text-xl font-bold">Nombre Alcalde/sa</h3>
                            <p className="text-gray-600">Alcalde/sa de la Comuna</p>
                            <a href="#" className="text-blue-600 hover:underline">Ver Biografía y Contacto</a>
                        </div>
                    </div>
                     <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-bold mb-2">Concejo Municipal</h3>
                        <p className="text-gray-600 mb-4">Conoce a los concejales y concejalas que representan a la comunidad.</p>
                        <a href="#" className="text-blue-600 hover:underline font-medium">Ver Miembros del Concejo</a>
                    </div>
                </div>
            </section>

            <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Transparencia</h2>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <p className="text-gray-600 mb-4">Accede a la información pública de la gestión municipal.</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <a href="#" className="text-blue-600 hover:underline">Organigrama</a>
                        <a href="#" className="text-blue-600 hover:underline">Actas Municipales</a>
                        <a href="#" className="text-blue-600 hover:underline">PLADECO</a>
                        <a href="#" className="text-blue-600 hover:underline">Portal de Transparencia Activa</a>
                    </div>
                </div>
            </section>

            <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Trabaja con Nosotros</h2>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="font-bold text-xl mb-4">Concursos Públicos Vigentes</h3>
                    {concursos.length > 0 ? (
                        <div className="space-y-4">
                            {concursos.map(concurso => (
                                <div key={concurso.id} className="p-4 border rounded-md flex flex-col md:flex-row justify-between md:items-center">
                                    <div>
                                        <h4 className="font-bold text-lg">{concurso.titulo}</h4>
                                        <p className="text-sm text-gray-600">{concurso.descripcion}</p>
                                        <p className="text-sm font-medium text-red-600">Plazo de postulación: {concurso.plazo}</p>
                                    </div>
                                    <a href={concurso.basesUrl} className="mt-2 md:mt-0 bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 transition-colors self-start">
                                        Ver Bases
                                    </a>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">No hay concursos públicos vigentes en este momento.</p>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Municipio;
