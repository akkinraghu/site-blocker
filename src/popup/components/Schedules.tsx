import React from 'react';
import { Schedule } from '../../types';

interface SchedulesProps {
  schedules: Schedule[];
  onChange: (schedules: Schedule[]) => void;
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const Schedules: React.FC<SchedulesProps> = ({ schedules, onChange }) => {
  const handleAddSchedule = () => {
    const newSchedule: Schedule = {
      enabled: true,
      startTime: '09:00',
      endTime: '17:00',
      days: [1, 2, 3, 4, 5] // Monday to Friday
    };
    onChange([...schedules, newSchedule]);
  };

  const handleRemoveSchedule = (index: number) => {
    const newSchedules = [...schedules];
    newSchedules.splice(index, 1);
    onChange(newSchedules);
  };

  const handleScheduleChange = (index: number, updates: Partial<Schedule>) => {
    const newSchedules = [...schedules];
    newSchedules[index] = { ...newSchedules[index], ...updates };
    onChange(newSchedules);
  };

  const handleDayToggle = (scheduleIndex: number, day: number) => {
    const schedule = schedules[scheduleIndex];
    const newDays = schedule.days.includes(day)
      ? schedule.days.filter((d: number) => d !== day)
      : [...schedule.days, day];
    handleScheduleChange(scheduleIndex, { days: newDays });
  };

  return (
    <div className="tab-pane active">
      <button className="btn btn-primary mb-3" onClick={handleAddSchedule}>
        Add Schedule
      </button>
      <div>
        {schedules.map((schedule, index) => (
          <div key={index} className="schedule-item">
            <div className="form-check form-switch mb-2">
              <input
                className="form-check-input"
                type="checkbox"
                checked={schedule.enabled}
                onChange={(e) => handleScheduleChange(index, { enabled: e.target.checked })}
              />
              <label className="form-check-label">Enable Schedule</label>
            </div>
            
            <div className="row mb-2">
              <div className="col">
                <label className="form-label">Start Time</label>
                <input
                  type="time"
                  className="form-control"
                  value={schedule.startTime}
                  onChange={(e) => handleScheduleChange(index, { startTime: e.target.value })}
                />
              </div>
              <div className="col">
                <label className="form-label">End Time</label>
                <input
                  type="time"
                  className="form-control"
                  value={schedule.endTime}
                  onChange={(e) => handleScheduleChange(index, { endTime: e.target.value })}
                />
              </div>
            </div>

            <div className="mb-2">
              <label className="form-label">Days</label>
              <div className="btn-group" role="group">
                {DAYS.map((day, i) => (
                  <React.Fragment key={i}>
                    <input
                      type="checkbox"
                      className="btn-check"
                      id={`day${index}${i}`}
                      checked={schedule.days.includes(i)}
                      onChange={() => handleDayToggle(index, i)}
                    />
                    <label
                      className="btn btn-outline-primary"
                      htmlFor={`day${index}${i}`}
                    >
                      {day}
                    </label>
                  </React.Fragment>
                ))}
              </div>
            </div>

            <button
              className="btn btn-danger btn-sm"
              onClick={() => handleRemoveSchedule(index)}
            >
              Remove Schedule
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Schedules;
