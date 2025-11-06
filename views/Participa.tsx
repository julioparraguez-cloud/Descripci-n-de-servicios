
import React, { useState, useEffect } from 'react';
import type { JuntaVecinal, FondoConcursable } from '../types';
import { onSnapshot } from '../services/firestoreMock';

const Participa: React.FC = () => {
    const [juntas, setJuntas] = useState<JuntaVecinal[]>([]);
    const [fondos, setFondos] = useState<FondoConcursable[]>([]);
    const [sectorFilter, setSectorFilter] = useState('');

    useEffect(() => {
        const unsubJuntas = onSnapshot<JuntaVecinal>('juntasDeVecinos', setJuntas);
        const unsubFondos = onSnapshot<FondoConcursable>('fondosConcursables', setFondos);

        return () => {
            unsubJuntas();
            unsubFondos();
        };
    }, []);

    const filteredJuntas = juntas.filter(j => 
        sectorFilter === '' || j.sector.toLowerCase() === sectorFilter.toLowerCase()
    );

    return (
        <div className="space-y-12">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4">Participa en tu Comuna</h1>

            <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Juntas de Vecinos</h2>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="mb-4">
                        <label htmlFor="sector" className="block text-sm font-medium text-gray-700">Filtrar por Sector:</label>
                        <select 
                            id="sector" 
                            className="mt-1 block w-full md:w-1/3 p-2 border border-gray-300 rounded-md"
                            onChange={(e) => setSectorFilter(e.target.value)}
                        >
                            <option value="">Todos</option>
                            <option value="Norte">Norte</option>
                            <option value="Sur">Sur</option>
                            {/* Add other sectors as needed */}
                        </select>
                    </div>
                    <div className="space-y-4">
                        {filteredJuntas.map(junta => (
                            <div key={junta.id} className="p-4 border rounded-md">
                                <h3 className="font-bold text-lg">{junta.nombre}</h3>
                                <p><strong>Sector:</strong> {junta.sector}</p>
                                <p><strong>Directorio:</strong> {junta.directorio}</p>
                                <p><strong>Contacto:</strong> <a href={`mailto:${junta.contacto}`} className="text-blue-600 hover:underline">{junta.contacto}</a></p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Fondos Concursables (Fondeco)</h2>
                <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
                    {fondos.map(fondo => (
                        <div key={fondo.id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border rounded-md">
                            <div>
                                <h3 className="font-bold text-lg">{fondo.nombre}</h3>
                                <span className={`text-sm font-bold px-3 py-1 rounded-full ${fondo.estado === 'Abierto' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {fondo.estado}
                                </span>
                            </div>
                            <a href={fondo.basesUrl} className="mt-4 md:mt-0 bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
                                Descargar Bases
                            </a>
                        </div>
                    ))}
                </div>
            </section>

            <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Consultas Ciudadanas</h2>
                <div className="bg-white p-8 rounded-lg shadow-md text-center">
                    <h3 className="font-bold text-xl mb-2">¡Tu opinión es importante!</h3>
                    <p className="text-gray-600 mb-4">Participa en las encuestas y consultas para construir juntos una mejor comuna.</p>
                    <a href="#" className="bg-green-500 text-white font-bold py-3 px-6 rounded-md hover:bg-green-600 transition-colors">
                        Ver Consultas Activas
                    </a>
                </div>
            </section>
        </div>
    );
};

export default Participa;
