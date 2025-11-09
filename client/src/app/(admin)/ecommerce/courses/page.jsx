import { useEffect, useState } from 'react'
import { Card, CardBody, Col, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import PageBreadcrumb from '@/components/layout/PageBreadcrumb'
import PageMetaData from '@/components/PageTitle'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { useGlobalContext } from '@/context/useGlobalContext'
import CoursesListTable from './components/CoursesListTable'

const Courses = () => {
  const { getAllCourses } = useGlobalContext()
  const [coursesList, setCoursesList] = useState([])

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getAllCourses()
        setCoursesList(data)
      } catch (error) {
        console.error('Error fetching courses:', error)
      }
    }
    fetchCourses()
  }, [getAllCourses])

  return (
    <>
      <PageMetaData title="Courses List" />
      <PageBreadcrumb title="Courses List" subName="Atrch" />
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
                  <Link to="/ecommerce/courses/create" className="btn btn-primary d-flex align-items-center">
                    <IconifyIcon icon="bx:plus" className="me-1" />
                    Create Course
                  </Link>
                </div>
              </div>
            </CardBody>
            <div>{coursesList.length > 0 ? <CoursesListTable courses={coursesList} /> : <div className="text-center p-4">No courses found</div>}</div>
          </Card>
        </Col>
      </Row>
    </>
  )
}
export default Courses
