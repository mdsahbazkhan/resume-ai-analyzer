import axios from 'axios'

const API_BASE_URL = 'http://localhost:5000/api'

export const analyzeResume = async (resumeFile, jobDescription) => {
  const formData = new FormData()
  formData.append('resume', resumeFile)
  formData.append('jobDescription', jobDescription)

  const response = await axios.post(`${API_BASE_URL}/analyze`, formData)
  return response.data.data
}
