import { parseISO, format } from 'date-fns'
import styled from 'styled-components'

function printElapsedDate(date: string): string {
  const postDate = new Date(date)
  const nowDate = new Date()
  const dateDiff: number =
    Math.ceil((nowDate.getTime() - postDate.getTime()) / (1000 * 3600 * 24)) - 1

  if (dateDiff === 0) {
    return '오늘'
  } else if (dateDiff < 31) {
    return dateDiff + '일 전'
  } else {
    const ElapsedMonth: any = Math.floor(dateDiff / 31)

    if (Math.floor(ElapsedMonth / 12) != 0) {
      return Math.floor(ElapsedMonth / 12) + '년 전'
    }
    return ElapsedMonth + '달 전'
  }
}

const Time = styled.div`
  font-size: 1rem;
  text-align: left;
  color: #7d7d7d;
  line-height: 0px;
  margin-top: 10px;
  margin-bottom: 20px;
`

type DateProps = {
  date: string
}
const DateView = ({ date }: DateProps) => {
  return (
    <>
      <Time>
        {format(parseISO(date), 'yyyy년 MM월 dd일')} ({printElapsedDate(date)})
      </Time>
    </>
  )
}
export default DateView
