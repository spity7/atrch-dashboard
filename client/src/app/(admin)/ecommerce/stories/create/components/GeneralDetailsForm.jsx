import { yupResolver } from '@hookform/resolvers/yup'
import { Col, Row, Button } from 'react-bootstrap'
import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import ReactQuill from 'react-quill'
import * as yup from 'yup'
import SelectFormInput from '@/components/form/SelectFormInput'
import TextFormInput from '@/components/form/TextFormInput'
import { renameKeys } from '@/utils/rename-object-keys'
import 'react-quill/dist/quill.snow.css'
import { useGlobalContext } from '@/context/useGlobalContext'
import DropzoneFormInput from '@/components/form/DropzoneFormInput'

const generalFormSchema = yup.object({
  title: yup.string().required('Story title is required'),
  descQuill: yup.string().required('Story description is required'),
})

const normalizeQuillValue = (value) => {
  if (!value || value === '<p><br></p>' || value === '<br/>') return ''
  return value
}

const GeneralDetailsForm = () => {
  const { createStory } = useGlobalContext()
  const [loading, setLoading] = useState(false)
  const [thumbnailFile, setThumbnailFile] = useState(null)
  const [galleryFile, setGalleryFile] = useState(null)
  const [resetDropzones, setResetDropzones] = useState(false)

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(generalFormSchema),
    defaultValues: {
      title: '',
      descQuill: '',
    },
  })

  const onSubmit = async (data) => {
    try {
      setLoading(true)
      if (!thumbnailFile) {
        alert('Thumbnail image is required')
        return
      }
      if (!galleryFile) {
        alert('Gallery image is required')
        return
      }

      const formData = new FormData()
      formData.append('title', data.title)

      formData.append('description', data.descQuill)
      formData.append('thumbnail', thumbnailFile)
      formData.append('gallery', galleryFile)

      console.log([...formData.entries()])

      await createStory(formData)

      alert('Story created successfully!')

      // ✅ Clear all form fields properly
      reset({
        title: '',
        descQuill: '',
      })

      setThumbnailFile(null)
      setGalleryFile(null)
      setResetDropzones(true)
      setTimeout(() => setResetDropzones(false), 0) // reset flag
    } catch (error) {
      alert(error?.response?.data?.message || '❌ Failed to create story')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Row>
        <Col lg={6}>
          <TextFormInput
            control={control}
            label="Story Title"
            placeholder="Enter story title"
            containerClassTitle="mb-3"
            id="story-title"
            name="title"
            // error={errors.title?.message}
          />
        </Col>
      </Row>

      <Row>
        <Col lg={12}>
          <div className="mb-5 mt-3">
            <label className="form-label">Story Description</label>
            <Controller
              name="descQuill"
              control={control}
              render={({ field }) => (
                <ReactQuill
                  theme="snow"
                  value={normalizeQuillValue(field.value)}
                  onChange={(content) => field.onChange(normalizeQuillValue(content))}
                  style={{ height: 195 }}
                  className="pb-sm-3 pb-5 pb-xl-0"
                  modules={{
                    toolbar: [
                      [{ font: [] }, { size: [] }],
                      ['bold', 'italic', 'underline', 'strike'],
                      [{ color: [] }, { background: [] }],
                      [{ script: 'super' }, { script: 'sub' }],
                      [{ header: [false, 1, 2, 3, 4, 5, 6] }, 'blockquote', 'code-block'],
                      [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
                      [{ direction: 'rtl' }, { align: [] }],
                      ['link', 'image', 'video'],
                      ['clean'],
                    ],
                  }}
                />
              )}
            />
            {errors.descQuill && <p className="text-danger mt-1">{errors.descQuill.message}</p>}
          </div>
        </Col>
      </Row>

      <Row>
        <Col lg={6}>
          <DropzoneFormInput
            label="Story Thumbnail"
            labelClassName="fs-14 mb-1 mt-5"
            iconProps={{
              icon: 'bx:cloud-upload',
              height: 36,
              width: 36,
            }}
            text="Upload Thumbnail image"
            showPreview
            resetTrigger={resetDropzones}
            onFileUpload={(files) => {
              if (files.length > 1) {
                alert('Only one thumbnail is allowed')
                // 🧹 Immediately reset the Dropzone
                setThumbnailFile(null)
                setResetDropzones(true)
                setTimeout(() => setResetDropzones(false), 0)
                return
              }

              // ✅ valid single file
              setThumbnailFile(files[0])
            }}
          />
          {errors.thumbnail && <p className="text-danger mt-1">{errors.thumbnail.message}</p>}
        </Col>
        <Col lg={6}>
          <DropzoneFormInput
            label="Story Gallery"
            labelClassName="fs-14 mb-1 mt-5"
            iconProps={{
              icon: 'bx:cloud-upload',
              height: 36,
              width: 36,
            }}
            text="Upload Gallery image"
            showPreview
            resetTrigger={resetDropzones}
            onFileUpload={(files) => {
              if (files.length > 1) {
                alert('Only one gallery is allowed')
                // 🧹 Immediately reset the Dropzone
                setGalleryFile(null)
                setResetDropzones(true)
                setTimeout(() => setResetDropzones(false), 0)
                return
              }

              // ✅ valid single file
              setGalleryFile(files[0])
            }}
          />
          {errors.gallery && <p className="text-danger mt-1">{errors.gallery.message}</p>}
        </Col>
      </Row>

      <Button type="submit" disabled={loading} className="mt-4">
        {loading ? 'Creating...' : 'Create Story'}
      </Button>
    </form>
  )
}
export default GeneralDetailsForm
