import { LinearProgress, withStyles } from '@material-ui/core'
import { useCallback, useEffect, useState } from 'react'

const MyLinearProgress = withStyles((theme) => ({
  root: {
    height: 10,
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10000,
  },
  colorPrimary: {
    backgroundColor: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
  },
  bar: {
    backgroundColor: '#1a90ff',
  },
}))(LinearProgress)

const ScrollProgressBar = () => {
  const [width, setWidth] = useState<number>(0)

  const handleScroll = useCallback((): void => {
    const {
      scrollTop,
      scrollHeight,
      clientHeight,
    }: { scrollTop: number; scrollHeight: number; clientHeight: number } = document.documentElement

    if (scrollTop === 0) {
      setWidth(0)
      return
    }
    const windowHeight: number = scrollHeight - clientHeight
    const currentPercent: number = scrollTop / windowHeight

    setWidth(currentPercent * 100)
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, true)

    return () => {
      window.removeEventListener('scroll', handleScroll, true)
    }
  }, [handleScroll])

  return <MyLinearProgress variant="determinate" value={width} />
}

export default ScrollProgressBar
