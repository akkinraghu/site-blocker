import React, { useState, useEffect } from "react";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Schedule, Settings } from "../../types";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const Schedules: React.FC = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);

  useEffect(() => {
    chrome.storage.sync.get(["settings"], (result) => {
      if (result.settings) {
        setSchedules(result.settings.schedules || []);
      }
    });
  }, []);

  const updateSettings = (newSchedules: Schedule[]) => {
    chrome.storage.sync.get(["settings"], (result) => {
      const settings: Settings = result.settings || {};
      chrome.storage.sync.set({
        settings: { ...settings, schedules: newSchedules },
      });
    });
  };

  const handleAddSchedule = () => {
    const newSchedule: Schedule = {
      days: [],
      startTime: "09:00",
      endTime: "17:00",
      enabled: true,
    };
    const newSchedules = [...schedules, newSchedule];
    setSchedules(newSchedules);
    updateSettings(newSchedules);
  };

  const handleRemoveSchedule = (index: number) => {
    const newSchedules = schedules.filter((_, i) => i !== index);
    setSchedules(newSchedules);
    updateSettings(newSchedules);
  };

  const handleScheduleChange = (index: number, changes: Partial<Schedule>) => {
    const newSchedules = schedules.map((schedule, i) =>
      i === index ? { ...schedule, ...changes } : schedule
    );
    setSchedules(newSchedules);
    updateSettings(newSchedules);
  };

  const toggleDay = (scheduleIndex: number, day: number) => {
    const schedule = schedules[scheduleIndex];
    const days = schedule.days.includes(day)
      ? schedule.days.filter((d) => d !== day)
      : [...schedule.days, day];
    handleScheduleChange(scheduleIndex, { days });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">
          Blocking Schedules
        </h3>
        <button
          onClick={handleAddSchedule}
          className="btn btn-primary flex items-center space-x-2"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Add Schedule</span>
        </button>
      </div>

      <div className="space-y-4">
        {schedules.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            No schedules set. Add a schedule to start blocking sites at specific
            times.
          </p>
        ) : (
          schedules.map((schedule, index) => (
            <div key={index} className="card space-y-4">
              <div className="flex items-center justify-between gap-2">
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={schedule.enabled}
                    onChange={(e) =>
                      handleScheduleChange(index, {
                        enabled: e.target.checked,
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="toggle-base bg-toggle-off peer-checked:bg-toggle-on">
                    <div className="toggle-handle peer-checked:translate-x-full"></div>
                  </div>
                </label>
                
                <div className="flex items-center gap-1 min-w-0 flex-1">
                  <input
                    type="time"
                    value={schedule.startTime}
                    onChange={(e) =>
                      handleScheduleChange(index, {
                        startTime: e.target.value,
                      })
                    }
                    className="input !w-24 text-sm"
                  />
                  <span className="text-gray-500 text-sm px-1">to</span>
                  <input
                    type="time"
                    value={schedule.endTime}
                    onChange={(e) =>
                      handleScheduleChange(index, { endTime: e.target.value })
                    }
                    className="input !w-24 text-sm"
                  />
                </div>

                <button
                  onClick={() => handleRemoveSchedule(index)}
                  className="text-gray-400 hover:text-red-500 transition-colors duration-200 shrink-0"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-wrap gap-1">
                {DAYS.map((day, dayIndex) => (
                  <button
                    key={day}
                    onClick={() => toggleDay(index, dayIndex)}
                    className={`px-2 py-1 rounded-full text-xs font-medium transition-colors duration-200 ${
                      schedule.days.includes(dayIndex)
                        ? "bg-primary-100 text-primary-800"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Schedules;
