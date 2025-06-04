import Image from 'next/image'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="text-center p-8">
        <h1 className="text-6xl font-bold text-white mb-6">
          Bienvenido a Rosal Motos
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Tu destino confiable para motos y repuestos de calidad
        </p>
        <div className="space-x-4">
          <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
            Ver Catálogo
          </button>
          <button className="bg-white hover:bg-gray-100 text-gray-900 font-bold py-3 px-6 rounded-lg transition-colors">
            Contactar
          </button>
        </div>
      </div>
    </main>
  )
}