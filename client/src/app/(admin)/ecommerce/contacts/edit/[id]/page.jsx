import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardBody, Col, Row, Button, Spinner } from 'react-bootstrap'
import PageMetaData from '@/components/PageTitle'
import PageBreadcrumb from '@/components/layout/PageBreadcrumb'
import { useGlobalContext } from '@/context/useGlobalContext'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

const EditContact = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getContactById, updateContact } = useGlobalContext()

  const [contact, setContact] = useState(null)
  const [thumbnail, setThumbnail] = useState(null)
  const [thumbnailPreview, setThumbnailPreview] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const data = await getContactById(id)
        setContact(data)
        setThumbnailPreview(data.thumbnailUrl)
      } catch (error) {
        alert('Failed to load contact')
      }
    }

    fetchContact()
  }, [id, getContactById])

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

      await updateContact(id, formData)
      alert('Contact updated successfully!')
      navigate('/ecommerce/stories')
    } catch (error) {
      alert(error?.response?.data?.message || 'Update failed')
    } finally {
      setLoading(false)
    }
  }

  if (!contact)
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" /> <p>Loading...</p>
      </div>
    )

  return (
    <>
      <PageMetaData title="Edit Contact" />
      <PageBreadcrumb title="Edit Contact" subName="Atrch" />
      <Row>
        <Col>
          <Card>
            <CardBody>
              <form onSubmit={handleSubmit}>
                {/* Thumbnail */}
                <div className="mb-3">
                  <label className="form-label">Contact Thumbnail</label>
                  <input type="file" className="form-control" onChange={handleThumbnailChange} />
                  {thumbnailPreview && (
                    <div className="mt-3">
                      <p className="fw-bold mb-1">Preview:</p>
                      <img src={thumbnailPreview} alt="Contact Thumbnail" style={{ width: 80, height: 80, objectFit: 'contain' }} />
                    </div>
                  )}
                </div>

                <Button type="submit" disabled={loading}>
                  {loading ? 'Updating...' : 'Update Contact'}
                </Button>
              </form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default EditContact
