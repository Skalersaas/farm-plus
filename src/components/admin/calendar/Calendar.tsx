import { useState } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight, Droplets, CheckSquare } from 'lucide-react';
import { usePlantsStore, useUIStore } from '../../../stores';
import styles from './Calendar.module.css';

export function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const { plants } = usePlantsStore();
  const { tasks } = useUIStore();

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  // Get events for a specific day
  const getEventsForDay = (day: Date) => {
    const dayStr = format(day, 'yyyy-MM-dd');

    const waterings = plants.filter(
      (p) => p.nextWateringAt && format(new Date(p.nextWateringAt), 'yyyy-MM-dd') === dayStr
    );

    const dayTasks = tasks.filter(
      (t) => t.dueDate === dayStr && t.status !== 'completed'
    );

    return { waterings, tasks: dayTasks };
  };

  // Generate calendar days
  const generateDays = () => {
    const days = [];
    let day = startDate;

    while (day <= endDate) {
      const events = getEventsForDay(day);
      days.push({
        date: day,
        isCurrentMonth: isSameMonth(day, monthStart),
        isToday: isSameDay(day, new Date()),
        isSelected: selectedDate ? isSameDay(day, selectedDate) : false,
        events,
      });
      day = addDays(day, 1);
    }

    return days;
  };

  const days = generateDays();
  const selectedEvents = selectedDate ? getEventsForDay(selectedDate) : null;

  return (
    <div className={styles.container}>
      <div className={styles.calendarSection}>
        {/* Calendar Header */}
        <div className={styles.calendarHeader}>
          <button className={styles.navBtn} onClick={prevMonth}>
            <ChevronLeft size={20} />
          </button>
          <h2 className={styles.monthTitle}>
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <button className={styles.navBtn} onClick={nextMonth}>
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Week Days */}
        <div className={styles.weekDays}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className={styles.weekDay}>
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className={styles.calendarGrid}>
          {days.map(({ date, isCurrentMonth, isToday, isSelected, events }) => (
            <div
              key={date.toISOString()}
              className={`${styles.dayCell} ${!isCurrentMonth ? styles.otherMonth : ''} ${
                isToday ? styles.today : ''
              } ${isSelected ? styles.selected : ''}`}
              onClick={() => setSelectedDate(date)}
            >
              <span className={styles.dayNumber}>{format(date, 'd')}</span>
              {(events.waterings.length > 0 || events.tasks.length > 0) && (
                <div className={styles.eventDots}>
                  {events.waterings.length > 0 && (
                    <span className={styles.dot} style={{ background: '#3b82f6' }} />
                  )}
                  {events.tasks.length > 0 && (
                    <span className={styles.dot} style={{ background: '#a855f7' }} />
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className={styles.legend}>
          <div className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: '#3b82f6' }} />
            Watering
          </div>
          <div className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: '#a855f7' }} />
            Tasks
          </div>
        </div>
      </div>

      {/* Events Sidebar */}
      <div className={styles.eventsSidebar}>
        <h3 className={styles.sidebarTitle}>
          {selectedDate
            ? format(selectedDate, 'EEEE, MMMM d')
            : 'Select a date'}
        </h3>

        {selectedEvents ? (
          <div className={styles.eventsList}>
            {selectedEvents.waterings.length > 0 && (
              <div className={styles.eventGroup}>
                <h4 className={styles.eventGroupTitle}>
                  <Droplets size={16} />
                  Watering Schedule
                </h4>
                {selectedEvents.waterings.map((plant) => (
                  <div key={plant.id} className={styles.eventItem}>
                    <span className={styles.eventName}>{plant.name}</span>
                    <span className={styles.eventMeta}>
                      {plant.quantity} plants
                    </span>
                  </div>
                ))}
              </div>
            )}

            {selectedEvents.tasks.length > 0 && (
              <div className={styles.eventGroup}>
                <h4 className={styles.eventGroupTitle}>
                  <CheckSquare size={16} />
                  Tasks
                </h4>
                {selectedEvents.tasks.map((task) => (
                  <div key={task.id} className={styles.eventItem}>
                    <span className={styles.eventName}>{task.title}</span>
                    <span
                      className={`${styles.priority} ${styles[task.priority]}`}
                    >
                      {task.priority}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {selectedEvents.waterings.length === 0 &&
              selectedEvents.tasks.length === 0 && (
                <div className={styles.noEvents}>
                  No events scheduled for this day
                </div>
              )}
          </div>
        ) : (
          <div className={styles.noEvents}>
            Click on a day to see scheduled events
          </div>
        )}
      </div>
    </div>
  );
}

export default Calendar;
