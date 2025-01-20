import { useTimer } from "./timer-provider";

const PersistentTimer = () => {
  const { seconds } = useTimer();

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return [hours, minutes, seconds]
      .map((v) => v.toString().padStart(2, "0"))
      .join(":");
  };

  return (
    <div className="space-y-4 p-6">
      <div className="text-center font-mono text-4xl">
        {formatTime(seconds)}
      </div>
    </div>
  );
};

export default PersistentTimer;
