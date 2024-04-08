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
        <div className="mb-2" key={index}>
          <p className="p-4 bg-gradient-to-r from-zinc-400 to-zinc-300 text-white rounded-lg">
            {weekdays[index]}
          </p>
          <div className="p-4">
            {weekday.map((event) => (
              <div
                className="flex justify-between space-x-14 mb-6"
                key={`${event.courseName}${event.timeSlot}`}
              >
                <div>
                  <p className="pb-1">
                    <span className="font-bold">{event.timeSlot}</span>{" "}
                    <span className="px-1 border-zinc-200 border-2 rounded-lg bg-zinc-50">
                      {event.roomId}
                    </span>
                  </p>
                  <p className="text-sm">{event.courseName}</p>
                  <a target="_blank" href={event.splanLink} className="text-zinc-500">
                    <p className="text-sm">{event.semester}</p>
                  </a>
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
