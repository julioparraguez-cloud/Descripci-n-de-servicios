
import React from 'react';

const Vive: React.FC = () => {
    return (
        <div className="space-y-12">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4">Vive tu Comuna</h1>

            <section>
                <h2 className="text-2xl font-bold text-blue-700 mb-4">Seguridad Ciudadana</h2>
                <div className="bg-white p-6 rounded-lg shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <p className="text-lg text-gray-600">En caso de emergencia, contacta a nuestro equipo de seguridad.</p>
                        <p className="text-4xl font-extrabold text-blue-800 my-2">1402</p>
                    </div>
                    <a href="#" className="bg-blue-600 text-white font-bold py-3 px-6 rounded-md hover:bg-blue-700 transition-colors">
                        Inscribir Alarma Comunitaria
                    </a>
                </div>
            </section>

            <section>
                <h2 className="text-2xl font-bold text-green-700 mb-4">Salud Municipal (CESFAMs)</h2>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <p className="mb-4 text-gray-600">Encuentra tu centro de salud familiar más cercano.</p>
                    {/* Placeholder for map */}
                    <div className="bg-gray-200 h-64 rounded-md flex items-center justify-center text-gray-500 mb-4">
                        Mapa Interactivo de CESFAMs
                    </div>
                    <ul className="space-y-2">
                        <li><strong>CESFAM Central:</strong> Av. Salud 123, Fono: +56 2 2345 6789</li>
                        <li><strong>CESFAM Norte:</strong> Calle Bienestar 456, Fono: +56 2 3456 7890</li>
                    </ul>
                </div>
            </section>
            
            <section>
                <h2 className="text-2xl font-bold text-teal-700 mb-4">Aseo y Medio Ambiente</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="font-bold text-lg mb-2">Calendario de Recolección</h3>
                        <p className="text-gray-600">Revisa los días y horarios de recolección de basura para tu sector.</p>
                        <button className="mt-4 bg-teal-600 text-white font-bold py-2 px-4 rounded-md hover:bg-teal-700">Ver Calendario</button>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="font-bold text-lg mb-2">Puntos Limpios</h3>
                        <p className="text-gray-600">Encuentra la ubicación de los puntos de reciclaje en la comuna.</p>
                        <button className="mt-4 bg-teal-600 text-white font-bold py-2 px-4 rounded-md hover:bg-teal-700">Ver Mapa</button>
                    </div>
                </div>
            </section>

            <section>
                <h2 className="text-2xl font-bold text-purple-700 mb-4">Educación y Cultura</h2>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="font-bold text-lg mb-2">Eventos del Mes</h3>
                    <p className="text-gray-600 mb-4">No te pierdas las actividades culturales y deportivas.</p>
                    <ul className="list-disc list-inside text-gray-700">
                        <li>Exposición de Arte Local - Centro Cultural</li>
                        <li>Cicletada Familiar - Parque Principal</li>
                        <li>Concierto de Coro Municipal - Teatro Municipal</li>
                    </ul>
                </div>
            </section>
        </div>
    );
};

export default Vive;
