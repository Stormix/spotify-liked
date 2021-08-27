import { intervalToDuration, formatDuration } from 'date-fns'

export const customFormatDuration = ({
  start,
  end,
}: {
  start: number
  end: number
}) => {
  const durations = intervalToDuration({ start, end })
  return formatDuration(durations)
}
