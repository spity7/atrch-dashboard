import { useEffect, useState } from 'react'
import { Card, CardBody, Col, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import PageBreadcrumb from '@/components/layout/PageBreadcrumb'
import PageMetaData from '@/components/PageTitle'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { useGlobalContext } from '@/context/useGlobalContext'
import StoriesListTable from './components/StoriesListTable'

const Stories = () => {
  const { getAllStories } = useGlobalContext()
  const [storiesList, setStoriesList] = useState([])

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const data = await getAllStories()
        setStoriesList(data)
      } catch (error) {
        console.error('Error fetching stories:', error)
      }
    }
    fetchStories()
  }, [getAllStories])

  return (
    <>
      <PageMetaData title="Stories List" />
      <PageBreadcrumb title="Stories List" subName="Atrch" />
      <Row>
        <Col>
          <Card>
            <CardBody>
              <div className="d-flex flex-wrap justify-content-between gap-3">
                {/* <div className="search-bar">
                  <span>
                    <IconifyIcon icon="bx:search-alt" className="mb-1" />
                  </span>
                  <input type="search" className="form-control" id="search" placeholder="Search ..." />
                </div> */}
                <div>
                  <Link to="/ecommerce/stories/create" className="btn btn-primary d-flex align-items-center">
                    <IconifyIcon icon="bx:plus" className="me-1" />
                    Create Story
                  </Link>
                </div>
              </div>
            </CardBody>
            <div>{storiesList.length > 0 ? <StoriesListTable stories={storiesList} /> : <div className="text-center p-4">No stories found</div>}</div>
          </Card>
        </Col>
      </Row>
    </>
  )
}
export default Stories
