

import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="container mx-auto px-6 py-20 text-center">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl">
            Gestiona tu negocio sin complicaciones
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-blue-100">
            Cronara es la plataforma todo-en-uno para dueños de negocios y clientes que quieren
            agendar citas, controlar inventario y mantenerse conectados en un solo lugar.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/signup"
              className="rounded-lg bg-white px-6 py-3 text-base font-semibold text-blue-600 shadow-md transition hover:bg-blue-50"
            >
              Comenzar gratis
            </Link>
            <Link
              href="/login"
              className="rounded-lg border border-white/30 px-6 py-3 text-base font-semibold text-white transition hover:bg-white/10"
            >
              Iniciar sesión
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-zinc-900">Todo lo que necesitas en un solo lugar</h2>
          <p className="mx-auto mt-4 max-w-xl text-zinc-600">
            Desde la agenda hasta el personal, controla cada aspecto de tu negocio con facilidad.
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-3.75h.008v.008H12v-.008Z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-zinc-900">Agenda inteligente</h3>
            <p className="mt-2 text-sm text-zinc-600">
              Reserva y gestiona citas en segundos, con recordatorios automáticos para ti y tus clientes.
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-zinc-900">Gestión de personal</h3>
            <p className="mt-2 text-sm text-zinc-600">
              Invita a tu equipo, asigna roles y horarios, y mantén la operación siempre en marcha.
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-purple-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-zinc-900">Clientes y recordatorios</h3>
            <p className="mt-2 text-sm text-zinc-600">
              Tus clientes reservan en línea y reciben notificaciones automáticas, mejorando la experiencia.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-zinc-100 py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold text-zinc-900">¿Listo para simplificar tu negocio?</h2>
          <p className="mx-auto mt-3 max-w-md text-zinc-600">
            Únete a miles de dueños que ya confían en Cronara para crecer sin estrés.
          </p>
          <Link
            href="/signup"
            className="mx-auto mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-md transition hover:bg-blue-700"
          >
            Comenzar ahora
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-zinc-900 px-6 py-8 text-center text-zinc-400">
        <p className="text-sm">© 2025 Cronara. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
