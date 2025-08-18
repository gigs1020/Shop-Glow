import { useCountdown } from "@/hooks/use-countdown";

interface CountdownTimerProps {
  endTime: string | Date;
}

export default function CountdownTimer({ endTime }: CountdownTimerProps) {
  const { hours, minutes, seconds } = useCountdown(endTime);

  return (
    <div className="flex space-x-2 font-mono font-bold" data-testid="countdown-timer">
      <span className="bg-white text-royal-purple px-2 py-1 rounded text-sm" data-testid="countdown-hours">
        {hours.toString().padStart(2, '0')}
      </span>
      <span>:</span>
      <span className="bg-white text-royal-purple px-2 py-1 rounded text-sm" data-testid="countdown-minutes">
        {minutes.toString().padStart(2, '0')}
      </span>
      <span>:</span>
      <span className="bg-white text-royal-purple px-2 py-1 rounded text-sm" data-testid="countdown-seconds">
        {seconds.toString().padStart(2, '0')}
      </span>
    </div>
  );
}
