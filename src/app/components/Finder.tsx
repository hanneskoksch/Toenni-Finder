import { parseStarplanData } from "./finder_logic";

async function Finder() {
  const starPlanData = await parseStarplanData();

  const weekdays = [
    "Montag",
    "Dienstag",
    "Mittwoch",
    "Donnerstag",
    "Freitag",
    "Samstag",
  ];

  return (
    <div>
      {starPlanData.map((weekday, index) => (
        <div className="mb-4" key={index}>
          <p className="p-4 bg-gradient-to-r from-zinc-400 to-zinc-300 text-white rounded-lg">
            {weekdays[index]}
          </p>
          <div className="p-4">
            {weekday.map((event) => (
              <div
                className="flex justify-between space-x-14 mb-3"
                key={`${event.courseName}${event.timeSlot}`}
              >
                <div>
                  <p className="pb-2">
                    <span className="font-bold">{event.timeSlot}</span>{" "}
                    <span className="p-1 border-zinc-200 border-2 rounded-lg">
                      {event.roomId}
                    </span>
                  </p>
                  <p className="text-sm">{event.courseName}</p>
                </div>
                <div className="text-right">
                  <a target="_blank" href={event.horstLink}>
                    📍 Find in Horst
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Finder;
