'use client';

import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/es';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

dayjs.locale('es');

interface CalendarEvent {
  id: string;
  title: string;
  start: Dayjs;
  end: Dayjs;
  color: string;
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const DAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

const DEFAULT_EVENTS: CalendarEvent[] = [
  {
    id: '1',
    title: 'Consulta inicial',
    start: dayjs().hour(9).minute(0),
    end: dayjs().hour(10).minute(30),
    color: '#fca5a5',
  },
  {
    id: '2',
    title: 'Seguimiento mensual',
    start: dayjs().add(1, 'day').hour(12).minute(0),
    end: dayjs().add(1, 'day').hour(13).minute(30),
    color: '#fdba74',
  },
  {
    id: '3',
    title: 'Demo interna',
    start: dayjs().add(2, 'day').hour(14).minute(0),
    end: dayjs().add(2, 'day').hour(15).minute(30),
    color: '#fed7aa',
  },
  {
    id: '4',
    title: 'Reunión de equipo',
    start: dayjs().add(3, 'day').hour(10).minute(0),
    end: dayjs().add(3, 'day').hour(11).minute(0),
    color: '#a7f3d0',
  },
];

export function WeekCalendar() {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [nowLine, setNowLine] = useState(0);

  // Calcular el inicio de la semana (lunes)
  const weekStart = currentDate.startOf('week').add(1, 'day');
  const weekDays = Array.from({ length: 7 }, (_, i) => weekStart.add(i, 'day'));

  // Actualizar línea de hora actual
  useEffect(() => {
    const updateNowLine = () => {
      const now = dayjs();
      const minutes = now.hour() * 60 + now.minute();
      setNowLine((minutes / (24 * 60)) * 100);
    };

    updateNowLine();
    const interval = setInterval(updateNowLine, 60000); // Actualizar cada minuto
    return () => clearInterval(interval);
  }, []);

  const handlePrevWeek = () => setCurrentDate(currentDate.subtract(1, 'week'));
  const handleNextWeek = () => setCurrentDate(currentDate.add(1, 'week'));

  const getEventsForDay = (day: Dayjs) => {
    return DEFAULT_EVENTS.filter((event) =>
      event.start.isSame(day, 'day')
    );
  };

  const getEventPosition = (event: CalendarEvent) => {
    const startMinutes = event.start.hour() * 60 + event.start.minute();
    const endMinutes = event.end.hour() * 60 + event.end.minute();
    const duration = endMinutes - startMinutes;

    return {
      top: (startMinutes / (24 * 60)) * 100,
      height: (duration / (24 * 60)) * 100,
    };
  };

  const isToday = (day: Dayjs) => day.isSame(dayjs(), 'day');

  return (
    <div className="flex h-full w-full flex-col bg-white">
      {/* Header */}
      <div className="border-b border-zinc-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-zinc-900">
            {weekStart.format('MMMM YYYY')}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={handlePrevWeek}
              className="rounded-lg p-2 hover:bg-zinc-100 transition-colors"
            >
              <ChevronLeft className="h-5 w-5 text-zinc-600" />
            </button>
            <button
              onClick={handleNextWeek}
              className="rounded-lg p-2 hover:bg-zinc-100 transition-colors"
            >
              <ChevronRight className="h-5 w-5 text-zinc-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="flex flex-1 overflow-hidden">
        {/* Time Column */}
        <div className="w-20 border-r border-zinc-200 bg-zinc-50">
          <div className="h-12 border-b border-zinc-200" />
          <div className="overflow-y-auto">
            {HOURS.map((hour) => (
              <div
                key={hour}
                className="h-24 border-b border-zinc-100 px-2 py-1 text-right text-xs text-zinc-500"
              >
                {String(hour).padStart(2, '0')}:00
              </div>
            ))}
          </div>
        </div>

        {/* Days Grid */}
        <div className="flex flex-1 overflow-y-auto">
          <div className="flex flex-1">
            {weekDays.map((day, dayIndex) => (
              <div
                key={day.format('YYYY-MM-DD')}
                className={`flex-1 border-r border-zinc-200 ${
                  dayIndex === 6 ? 'border-r-0' : ''
                }`}
              >
                {/* Day Header */}
                <div
                  className={`h-12 border-b border-zinc-200 px-4 py-2 text-center ${
                    isToday(day) ? 'bg-blue-50' : 'bg-white'
                  }`}
                >
                  <div className="text-xs font-semibold text-zinc-600">
                    {DAYS[dayIndex]}
                  </div>
                  <div
                    className={`text-sm font-bold ${
                      isToday(day)
                        ? 'bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center mx-auto'
                        : 'text-zinc-900'
                    }`}
                  >
                    {day.format('D')}
                  </div>
                </div>

                {/* Time Slots */}
                <div className="relative">
                  {HOURS.map((hour) => (
                    <div
                      key={`${day.format('YYYY-MM-DD')}-${hour}`}
                      className="h-24 border-b border-zinc-100 relative hover:bg-zinc-50 transition-colors cursor-pointer"
                    />
                  ))}

                  {/* Events */}
                  <div className="absolute inset-0 pointer-events-none">
                    {getEventsForDay(day).map((event) => {
                      const position = getEventPosition(event);
                      return (
                        <div
                          key={event.id}
                          className="absolute left-1 right-1 rounded-lg p-2 text-xs font-medium text-zinc-900 shadow-sm hover:shadow-md transition-shadow pointer-events-auto cursor-pointer hover:z-10"
                          style={{
                            backgroundColor: event.color,
                            top: `${position.top}%`,
                            height: `${position.height}%`,
                            minHeight: '40px',
                          }}
                        >
                          <div className="font-semibold truncate">{event.title}</div>
                          <div className="text-xs text-zinc-700">
                            {event.start.format('HH:mm')} - {event.end.format('HH:mm')}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Now Line */}
                  {isToday(day) && (
                    <div
                      className="absolute left-0 right-0 h-0.5 bg-red-500 z-20 pointer-events-none"
                      style={{ top: `${nowLine}%` }}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
