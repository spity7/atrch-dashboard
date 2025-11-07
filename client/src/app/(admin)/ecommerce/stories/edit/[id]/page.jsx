import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardBody, Col, Row, Button, Spinner } from 'react-bootstrap'
import PageMetaData from '@/components/PageTitle'
import PageBreadcrumb from '@/components/layout/PageBreadcrumb'
import { useGlobalContext } from '@/context/useGlobalContext'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

const EditStory = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getStoryById, updateStory } = useGlobalContext()

  const [story, setStory] = useState(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [thumbnail, setThumbnail] = useState(null)
  const [thumbnailPreview, setThumbnailPreview] = useState(null)
  const [gallery, setGallery] = useState(null)
  const [galleryPreview, setGalleryPreview] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const data = await getStoryById(id)
        setStory(data)
        setTitle(data.title)
        setDescription(data.description)
        setThumbnailPreview(data.thumbnailUrl)
        setGalleryPreview(data.galleryUrl)
      } catch (error) {
        alert('Failed to load story')
      }
    }

    fetchStory()
  }, [id, getStoryById])

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

  const handleGalleryChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setGallery(file)
      const reader = new FileReader()
      reader.onload = () => setGalleryPreview(reader.result)
      reader.readAsDataURL(file)
    } else {
      setGallery(null)
      setGalleryPreview(null)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const formData = new FormData()
      formData.append('title', title)
      formData.append('description', description)

      if (thumbnail) formData.append('thumbnail', thumbnail)
      if (gallery) formData.append('gallery', gallery)

      await updateStory(id, formData)
      alert('Story updated successfully!')
      navigate('/ecommerce/stories')
    } catch (error) {
      alert(error?.response?.data?.message || 'Update failed')
    } finally {
      setLoading(false)
    }
  }

  if (!story)
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" /> <p>Loading...</p>
      </div>
    )

  return (
    <>
      <PageMetaData title="Edit Story" />
      <PageBreadcrumb title="Edit Story" subName="Atrch" />
      <Row>
        <Col>
          <Card>
            <CardBody>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Story Title</label>
                  <input type="text" className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>

                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <ReactQuill theme="snow" value={description} onChange={setDescription} />
                </div>

                {/* Thumbnail */}
                <div className="mb-3">
                  <label className="form-label">Story Thumbnail</label>
                  <input type="file" className="form-control" onChange={handleThumbnailChange} />
                  {thumbnailPreview && (
                    <div className="mt-3">
                      <p className="fw-bold mb-1">Preview:</p>
                      <img src={thumbnailPreview} alt="Story Thumbnail" style={{ width: 80, height: 80, objectFit: 'contain' }} />
                    </div>
                  )}
                </div>

                {/* Gallery */}
                <div className="mb-3">
                  <label className="form-label">Story Gallery</label>
                  <input type="file" className="form-control" onChange={handleGalleryChange} accept="image/*" />
                  {galleryPreview && (
                    <div className="mt-3">
                      <p className="fw-bold mb-1">Preview:</p>
                      <img src={galleryPreview} alt="Story Gallery" style={{ width: 80, height: 80, objectFit: 'contain' }} />
                    </div>
                  )}
                </div>

                <Button type="submit" disabled={loading}>
                  {loading ? 'Updating...' : 'Update Story'}
                </Button>
              </form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default EditStory
