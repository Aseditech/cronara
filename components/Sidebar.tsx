'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { useState } from 'react';
import AddStaffForm from '@/components/AddStaffForm';

dayjs.locale('es');

const STAFF = [
  'María López',
  'Carlos Fernández',
  'Ana Gómez',
  'Luis Ramírez',
  'Sofía Castillo',
  'Javier Torres',
  'Elena Martínez',
];

export function Sidebar() {
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [isModalOpen, setIsModalOpen] = useState(false);

  const daysInMonth = currentMonth.daysInMonth();
  const firstDay = currentMonth.startOf('month').day();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDay }, () => null);

  const handlePrevMonth = () => setCurrentMonth(currentMonth.subtract(1, 'month'));
  const handleNextMonth = () => setCurrentMonth(currentMonth.add(1, 'month'));

  return (
    <aside className="w-64 border-r border-zinc-200 bg-white p-6 overflow-y-auto">
      {/* Mini Calendar */}
      <div className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-zinc-900">
            {currentMonth.format('MMMM YYYY')}
          </h3>
          <div className="flex gap-1">
            <button
              onClick={handlePrevMonth}
              className="rounded p-1 hover:bg-zinc-100"
            >
              <ChevronLeft className="h-4 w-4 text-zinc-600" />
            </button>
            <button
              onClick={handleNextMonth}
              className="rounded p-1 hover:bg-zinc-100"
            >
              <ChevronRight className="h-4 w-4 text-zinc-600" />
            </button>
          </div>
        </div>

        <div className="rounded-lg border border-zinc-200 p-4">
          {/* Day headers */}
          <div className="mb-2 grid grid-cols-7 gap-1 text-center">
            {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((day) => (
              <div key={day} className="text-xs font-semibold text-zinc-600">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {emptyDays.map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}
            {days.map((day) => (
              <button
                key={day}
                className={`aspect-square rounded text-xs font-medium transition-colors ${
                  day === dayjs().date() && currentMonth.isSame(dayjs(), 'month')
                    ? 'bg-blue-500 text-white'
                    : 'text-zinc-700 hover:bg-zinc-100'
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Staff Section */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-zinc-900">Equipo</h3>
          <button
            onClick={() => setIsModalOpen(true)}
            className="rounded-lg border border-zinc-200 px-3 py-1 text-xs font-medium text-zinc-700 transition hover:bg-zinc-100"
          >
            Agregar empleado
          </button>
        </div>
        <div className="space-y-2">
          {STAFF.map((member, i) => (
            <button
              key={i}
              className="w-full rounded-lg px-3 py-2 text-left text-sm text-zinc-700 transition-colors hover:bg-zinc-100"
            >
              {member}
            </button>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <AddStaffForm onClose={() => setIsModalOpen(false)} />
          </div>
        </div>
      )}
    </aside>
  );
}
