
import React, { useState, useEffect, useCallback } from 'react';
import type { Programa } from '../types';
import { onSnapshot, getDoc } from '../services/firestoreMock';
import { analyzeContentWithThinking } from '../services/geminiService';

const ProgramaDetalle: React.FC<{ programa: Programa; onBack: () => void }> = ({ programa, onBack }) => {
    const [analysis, setAnalysis] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleAnalyze = async () => {
        setIsLoading(true);
        setAnalysis('');
        const prompt = `Analiza el siguiente programa municipal y proporciona un resumen claro para un ciudadano. Destaca los puntos clave, a quién está dirigido, y qué beneficios ofrece. Programa: ${programa.titulo}. Descripción: ${programa.descripcionCompleta}. Requisitos: ${programa.temario.join(', ')}.`;
        const result = await analyzeContentWithThinking(prompt);
        setAnalysis(result);
        setIsLoading(false);
    };

    return (
        <div>
            <button onClick={onBack} className="mb-6 bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-md hover:bg-gray-300 transition-colors">
                &larr; Volver a Programas
            </button>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">{programa.titulo}</h1>
                    <p className="text-lg text-gray-600 mb-6">{programa.descripcionCompleta}</p>
                    <h2 className="text-xl font-bold text-gray-800 mb-3">Temario o Contenidos</h2>
                    <ul className="list-disc list-inside space-y-2 text-gray-600 mb-6">
                        {programa.temario.map((item, index) => <li key={index}>{item}</li>)}
                    </ul>
                    <p><strong>Monitor/Relator:</strong> {programa.monitor}</p>
                    <p><strong>Ubicación:</strong> {programa.ubicacion}</p>
                </div>
                <div className="space-y-6">
                    <div className="bg-blue-50 p-6 rounded-lg shadow-md border-l-4 border-blue-500">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Información Clave</h2>
                        <p><strong>Costo:</strong> {programa.resumen.costo}</p>
                        <p><strong>Cupos disponibles:</strong> {programa.resumen.cupos}</p>
                        <p><strong>Fechas:</strong> {programa.resumen.fechas}</p>
                        <p><strong>Público:</strong> {programa.publico.join(', ')}</p>
                        <p><strong>Modalidad:</strong> {programa.modalidad}</p>
                    </div>
                    <a href="#" className="w-full text-center block bg-green-500 text-white font-bold py-4 px-6 rounded-lg hover:bg-green-600 transition-colors text-xl shadow-lg">¡INSCRÍBETE AQUÍ!</a>
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <button onClick={handleAnalyze} disabled={isLoading} className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors disabled:bg-indigo-300">
                            {isLoading ? 'Analizando con IA...' : 'Analizar con IA (Thinking Mode)'}
                        </button>
                        {analysis && <div className="mt-4 p-3 bg-indigo-50 rounded-md text-sm text-indigo-800 whitespace-pre-wrap">{analysis}</div>}
                    </div>
                </div>
            </div>
        </div>
    );
};

const ProgramaCard: React.FC<{ programa: Programa; onViewDetail: (id: string) => void }> = ({ programa, onViewDetail }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col hover:shadow-xl transition-shadow">
        <div className="p-6 flex-grow">
            <h3 className="text-xl font-bold text-gray-800 mb-2">{programa.titulo}</h3>
            <p className="text-gray-500 mb-4">{programa.publico.join(', ')}</p>
            <div className="flex space-x-2">
                <span className="text-xs font-semibold bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{programa.tipo}</span>
                <span className="text-xs font-semibold bg-green-100 text-green-800 px-2 py-1 rounded-full">{programa.modalidad}</span>
            </div>
        </div>
        <div className="p-4 bg-gray-50">
            <button onClick={() => onViewDetail(programa.id)} className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
                Ver Detalle
            </button>
        </div>
    </div>
);

const Programas: React.FC = () => {
    const [programas, setProgramas] = useState<Programa[]>([]);
    const [selectedPrograma, setSelectedPrograma] = useState<Programa | null>(null);
    const [filters, setFilters] = useState({ publico: '', tipo: '', modalidad: '' });

    useEffect(() => {
        const unsubscribe = onSnapshot<Programa>('programas', setProgramas);
        return () => unsubscribe();
    }, []);
    
    const handleViewDetail = useCallback(async (id: string) => {
        const programa = await getDoc<Programa>('programas', id);
        if (programa) {
            setSelectedPrograma(programa);
            window.scrollTo(0, 0);
        }
    }, []);

    const handleBackToIndex = () => {
        setSelectedPrograma(null);
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const filteredProgramas = programas.filter(p => {
        return (filters.publico === '' || p.publico.includes(filters.publico)) &&
               (filters.tipo === '' || p.tipo === filters.tipo) &&
               (filters.modalidad === '' || p.modalidad === filters.modalidad);
    });

    if (selectedPrograma) {
        return <ProgramaDetalle programa={selectedPrograma} onBack={handleBackToIndex} />;
    }

    const uniquePublicos = [...new Set(programas.flatMap(p => p.publico))];
    const uniqueTipos = [...new Set(programas.map(p => p.tipo))];
    const uniqueModalidades = [...new Set(programas.map(p => p.modalidad))];

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Programas y Red de Apoyo</h1>
            <p className="text-lg text-gray-600 mb-8">Descubre los talleres, cursos y ayudas que tenemos para ti y tu familia.</p>

            <div className="bg-white p-4 rounded-lg shadow-md mb-8 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                <div className="md:col-span-1 font-bold text-gray-700">Filtrar por:</div>
                <select name="publico" onChange={handleFilterChange} className="w-full p-2 border border-gray-300 rounded-md">
                    <option value="">Todo Público</option>
                    {uniquePublicos.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                <select name="tipo" onChange={handleFilterChange} className="w-full p-2 border border-gray-300 rounded-md">
                    <option value="">Todo Tipo</option>
                    {uniqueTipos.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <select name="modalidad" onChange={handleFilterChange} className="w-full p-2 border border-gray-300 rounded-md">
                    <option value="">Toda Modalidad</option>
                    {uniqueModalidades.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProgramas.map(programa => (
                    <ProgramaCard key={programa.id} programa={programa} onViewDetail={handleViewDetail} />
                ))}
            </div>
        </div>
    );
};

export default Programas;
