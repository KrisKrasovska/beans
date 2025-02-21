import { useEffect, useRef, useState } from 'react'
import { CombinationType } from '../types/types'
import { ErrorMessage, Section, Title } from './Home.styled'
import axios from 'axios'
import { Loader } from '../components/Loader/Loader'
import CombinationsList from '../components/CombinationsList/CombinationsList'

const Combinations = () => {
  const [combinationsList, setCombinationsList] = useState<CombinationType[]>(
    []
  )
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [pageIndex, setPageIndex] = useState<number>(1)
  const observerTarget = useRef<HTMLDivElement | null>(null)
  const [totalCounts, setTotalCounts] = useState<number>(10)

  useEffect(() => {
    const fetchCombinations = async () => {
      setLoading(true)
      try {
        const results = await axios.get(
          `https://jellybellywikiapi.onrender.com/api/combinations?pageIndex=${pageIndex}&pageSize=10`
        )
        const { data } = results
        setCombinationsList((prevCombinationsList) => {
          const newCombinationsList = data.items.filter(
            (newItem: CombinationType) =>
              !prevCombinationsList.some(
                (prevItem) => prevItem.combinationId === newItem.combinationId
              )
          )
          return [...prevCombinationsList, ...newCombinationsList]
        })
        setTotalCounts(data.totalCount)
        setLoading(false)
      } catch (error) {
        console.log(error)
        setError('Error! Try again or return to home page')
        setLoading(false)
      }
    }
    if (pageIndex <= Math.ceil(totalCounts / 10)) {
      fetchCombinations()
    }
  }, [pageIndex, totalCounts])

  useEffect(() => {
    if (loading) {
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPageIndex((prevPage) => prevPage + 1)
        }
      },
      { threshold: 1 }
    )

    const currentTarget = observerTarget.current
    if (currentTarget) {
      observer.observe(currentTarget)
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget)
      }
    }
  }, [observerTarget, loading])

  return (
    <Section>
      <Title>How can you combine?</Title>
      {combinationsList.length > 0 && !error && (
        <CombinationsList combinationsList={combinationsList} />
      )}

      {!loading && error && (
        <ErrorMessage>
          Something went wrong, please reload the page...
        </ErrorMessage>
      )}
      {loading && combinationsList.length === 0 && <Loader />}
      {combinationsList.length > 0 && <div ref={observerTarget}></div>}
    </Section>
  )
}

export default Combinations
