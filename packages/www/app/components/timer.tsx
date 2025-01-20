import { useTimer } from "./timer-provider";

const PersistentTimer = () => {
  const { seconds } = useTimer();

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return [minutes, seconds]
      .map((v) => v.toString().padStart(2, "0"))
      .join(":");
  };

  return <div className="font-mono">{formatTime(seconds)}</div>;
};

export default PersistentTimer;
