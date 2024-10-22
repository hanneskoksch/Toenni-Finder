import { getAllEvents } from "./parse-ical";

async function Finder() {
  const starPlanData = await getAllEvents();

  const hasEventOnDay = (day: Date): boolean => {
    return starPlanData.some((event) => {
      return event.dateStart.toDateString() === day.toDateString();
    });
  };

  const weekdays = [
    "Sonntag",
    "Montag",
    "Dienstag",
    "Mittwoch",
    "Donnerstag",
    "Freitag",
    "Samstag",
  ];

  const sameDay = (d1: Date, d2: Date): boolean => {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  const dayArray = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date();
      day.setDate(day.getDate() + i);
      days.push(day);
    }
    return days;
  };

  if (starPlanData.length === 0)
    return <p className="p-8">Toenni could not be found 😢</p>;

  return (
    <>
      {dayArray().map(
        (day, index) =>
          hasEventOnDay(day) && (
            <div key={`day-${index}`}>
              <p className="p-4 bg-gradient-to-r from-zinc-400 to-zinc-300 text-white rounded-lg">
                {weekdays[day.getDay()]}, {day.toLocaleDateString("de-DE")}
              </p>
              <div className="p-4">
                {starPlanData.map((event, i) => (
                  <div key={`event-${i}`}>
                    {sameDay(day, event.dateStart) && (
                      <div
                        className="flex justify-between space-x-14 mb-6"
                        key={`event-${i}1`}
                      >
                        <div>
                          <div className="flex space-x-2 items-center">
                            <p className="font-bold">{`${event.dateStart
                              .toLocaleTimeString("de-DE")
                              .substring(0, 5)} - ${event.dateEnd
                              .toLocaleTimeString("de-DE")
                              .substring(0, 5)}`}</p>
                            <p className="px-1 border-zinc-200 border-2 rounded-lg bg-zinc-50 text-xs">
                              {event.roomId}
                            </p>
                          </div>
                          <p className="text-sm">{event.courseName}</p>
                          <a
                            target="_blank"
                            href={event.splanLink}
                            className="text-zinc-500"
                          >
                            <p className="text-sm">{event.semester}</p>
                          </a>
                        </div>
                        <div className="text-right">
                          <a target="_blank" href={event.horstLink}>
                            📍 Find in Horst
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )
      )}
    </>
  );
}

export default Finder;
