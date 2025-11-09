import { Card, CardBody, Col, Row } from 'react-bootstrap'
import PageBreadcrumb from '@/components/layout/PageBreadcrumb'
import CreateCourseForms from './components/CreateCourseForms'
import PageMetaData from '@/components/PageTitle'

const CreateCourse = () => {
  return (
    <>
      <PageBreadcrumb title="Create Course" subName="Atrch" />
      <PageMetaData title="Create Course" />

      <Row>
        <Col>
          <Card>
            <CardBody>
              <CreateCourseForms />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  )
}
export default CreateCourse
