
import React, { useState, useEffect } from 'react';
import type { Tramite } from '../types';
import { onSnapshot } from '../services/firestoreMock';

const AccordionItem: React.FC<{ tramite: Tramite; isOpen: boolean; onClick: () => void }> = ({ tramite, isOpen, onClick }) => (
    <div className="border-b">
        <button
            onClick={onClick}
            className="w-full flex justify-between items-center text-left py-4 px-6 focus:outline-none hover:bg-gray-50"
        >
            <span className="text-lg font-medium text-gray-800">{tramite.titulo}</span>
            <span className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </span>
        </button>
        <div className={`overflow-hidden transition-max-height duration-500 ease-in-out ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
            <div className="p-6 bg-gray-50">
                <h4 className="font-semibold text-gray-700 mb-2">Descripción</h4>
                <p className="text-gray-600 mb-4">{tramite.descripcion}</p>
                <h4 className="font-semibold text-gray-700 mb-2">Requisitos</h4>
                <ul className="list-disc list-inside text-gray-600 mb-6">
                    {tramite.requisitos.map((req, i) => <li key={i}>{req}</li>)}
                </ul>
                <a href={tramite.enlace.url} className="inline-block bg-blue-600 text-white font-bold py-2 px-6 rounded-md hover:bg-blue-700 transition-colors">
                    {tramite.enlace.texto}
                </a>
            </div>
        </div>
    </div>
);

const Tramites: React.FC = () => {
    const [tramites, setTramites] = useState<Tramite[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [openAccordion, setOpenAccordion] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribe = onSnapshot<Tramite>('tramites', setTramites);
        return () => unsubscribe();
    }, []);

    const filteredTramites = tramites.filter(t =>
        t.titulo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleAccordion = (id: string) => {
        setOpenAccordion(openAccordion === id ? null : id);
    };

    return (
        <div className="space-y-12">
            <section>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Pagar en Línea</h1>
                <p className="text-lg text-gray-600 mb-6">Realiza tus pagos más frecuentes de forma rápida y segura.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <a href="#" className="bg-blue-500 text-white text-center p-8 rounded-lg shadow-md hover:bg-blue-600 transition-all transform hover:-translate-y-1">
                        <h3 className="text-2xl font-bold">Permiso de Circulación</h3>
                    </a>
                    <a href="#" className="bg-green-500 text-white text-center p-8 rounded-lg shadow-md hover:bg-green-600 transition-all transform hover:-translate-y-1">
                        <h3 className="text-2xl font-bold">Derechos de Aseo</h3>
                    </a>
                    <a href="#" className="bg-indigo-500 text-white text-center p-8 rounded-lg shadow-md hover:bg-indigo-600 transition-all transform hover:-translate-y-1">
                        <h3 className="text-2xl font-bold">Patentes Comerciales</h3>
                    </a>
                </div>
            </section>
            
            <section>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Guía de Trámites</h2>
                <p className="text-lg text-gray-600 mb-6">Encuentra toda la información que necesitas para realizar tus trámites municipales.</p>
                <div className="mb-6">
                    <input
                        type="text"
                        placeholder="Buscar un trámite..."
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    {filteredTramites.length > 0 ? (
                        filteredTramites.map(tramite => (
                            <AccordionItem
                                key={tramite.id}
                                tramite={tramite}
                                isOpen={openAccordion === tramite.id}
                                onClick={() => toggleAccordion(tramite.id)}
                            />
                        ))
                    ) : (
                        <p className="p-6 text-gray-500">No se encontraron trámites.</p>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Tramites;
