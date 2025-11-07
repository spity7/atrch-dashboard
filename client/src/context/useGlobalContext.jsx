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
    const response = await axiosInstance.delete(`/handiz/${id}`)
    return response.data
  }

  const createHandiz = async (data) => {
    const response = await axiosInstance.post('/handiz', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  }

  const getAllHandiz = async () => {
    const response = await axiosInstance.get('/handiz')
    return response.data.handiz
  }

  const getHandizById = async (id) => {
    const response = await axiosInstance.get(`/handiz/${id}`)
    return response.data.handiz
  }

  const updateHandiz = async (id, data) => {
    const response = await axiosInstance.put(`/handiz/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data.handiz
  }

  const deleteHandiz = async (id) => {
    const response = await axiosInstance.delete(`/handiz/${id}`)
    return response.data
  }

  const createProject = async (data) => {
    const response = await axiosInstance.post('/projects', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  }

  const getAllProjects = async () => {
    const response = await axiosInstance.get('/projects')
    return response.data.projects
  }

  const getProjectById = async (id) => {
    const response = await axiosInstance.get(`/projects/${id}`)
    return response.data.project
  }

  const updateProject = async (id, data) => {
    const response = await axiosInstance.put(`/projects/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data.project
  }

  const deleteProject = async (id) => {
    const response = await axiosInstance.delete(`/projects/${id}`)
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
        createHandiz,
        getAllHandiz,
        getHandizById,
        updateHandiz,
        deleteHandiz,
        createProject,
        getAllProjects,
        getProjectById,
        updateProject,
        deleteProject,
      }}>
      {children}
    </GlobalContext.Provider>
  )
}

export const useGlobalContext = () => useContext(GlobalContext)
