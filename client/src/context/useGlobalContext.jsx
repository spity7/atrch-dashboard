import { createContext, useContext, useMemo } from 'react'
import axios from 'axios'

axios.defaults.withCredentials = true
const BASE_URL = 'https://api.atrch.com/api/v1/'
// const BASE_URL = 'http://localhost:5006/api/v1/'

const GlobalContext = createContext()

export const GlobalProvider = ({ children }) => {
  // Create a memoized axios instance
  const axiosInstance = useMemo(() => {
    const instance = axios.create({
      baseURL: BASE_URL,
      withCredentials: true,
    })

    instance.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('API Error:', error.response || error.message)
        return Promise.reject(error)
      },
    )

    return instance
  }, [])

  const createStory = async (data) => {
    const response = await axiosInstance.post('/stories', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  }

  const getAllStories = async () => {
    const response = await axiosInstance.get('/stories')
    return response.data.stories
  }

  const getStoryById = async (id) => {
    const response = await axiosInstance.get(`/stories/${id}`)
    return response.data.story
  }

  const updateStory = async (id, data) => {
    const response = await axiosInstance.put(`/stories/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data.story
  }

  const deleteStory = async (id) => {
    const response = await axiosInstance.delete(`/stories/${id}`)
    return response.data
  }

  return (
    <GlobalContext.Provider
      value={{
        createStory,
        getAllStories,
        getStoryById,
        updateStory,
        deleteStory,
      }}>
      {children}
    </GlobalContext.Provider>
  )
}

export const useGlobalContext = () => useContext(GlobalContext)
