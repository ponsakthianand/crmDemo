import { useTimeAgo } from 'next-timeago';

export default function LastSeen({ date }) {
  const { TimeAgo } = useTimeAgo();

  return (
    <>
      <TimeAgo date={date} locale={'en'} />
    </>
  );
}