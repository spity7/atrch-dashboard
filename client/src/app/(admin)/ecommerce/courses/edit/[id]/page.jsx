import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardBody, Col, Row, Button, Spinner } from 'react-bootstrap'
import PageMetaData from '@/components/PageTitle'
import PageBreadcrumb from '@/components/layout/PageBreadcrumb'
import { useGlobalContext } from '@/context/useGlobalContext'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

const EditCourse = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getCourseById, updateCourse } = useGlobalContext()

  const [course, setCourse] = useState(null)
  const [thumbnail, setThumbnail] = useState(null)
  const [thumbnailPreview, setThumbnailPreview] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const data = await getCourseById(id)
        setCourse(data)
        setThumbnailPreview(data.thumbnailUrl)
      } catch (error) {
        alert('Failed to load course')
      }
    }

    fetchCourse()
  }, [id, getCourseById])

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setThumbnail(file)
      const reader = new FileReader()
      reader.onload = () => setThumbnailPreview(reader.result)
      reader.readAsDataURL(file)
    } else {
      setThumbnail(null)
      setThumbnailPreview(null)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const formData = new FormData()

      if (thumbnail) formData.append('thumbnail', thumbnail)

      await updateCourse(id, formData)
      alert('Course updated successfully!')
      navigate('/ecommerce/stories')
    } catch (error) {
      alert(error?.response?.data?.message || 'Update failed')
    } finally {
      setLoading(false)
    }
  }

  if (!course)
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" /> <p>Loading...</p>
      </div>
    )

  return (
    <>
      <PageMetaData title="Edit Course" />
      <PageBreadcrumb title="Edit Course" subName="Atrch" />
      <Row>
        <Col>
          <Card>
            <CardBody>
              <form onSubmit={handleSubmit}>
                {/* Thumbnail */}
                <div className="mb-3">
                  <label className="form-label">Course Thumbnail</label>
                  <input type="file" className="form-control" onChange={handleThumbnailChange} />
                  {thumbnailPreview && (
                    <div className="mt-3">
                      <p className="fw-bold mb-1">Preview:</p>
                      <img src={thumbnailPreview} alt="Course Thumbnail" style={{ width: 80, height: 80, objectFit: 'contain' }} />
                    </div>
                  )}
                </div>

                <Button type="submit" disabled={loading}>
                  {loading ? 'Updating...' : 'Update Course'}
                </Button>
              </form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default EditCourse
