import { Card, CardBody, Col, Row } from 'react-bootstrap'
import PageBreadcrumb from '@/components/layout/PageBreadcrumb'
import CreateStoryForms from './components/CreateStoryForms'
import PageMetaData from '@/components/PageTitle'

const CreateStory = () => {
  return (
    <>
      <PageBreadcrumb title="Create Story" subName="Atrch" />
      <PageMetaData title="Create Story" />

      <Row>
        <Col>
          <Card>
            <CardBody>
              <CreateStoryForms />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  )
}
export default CreateStory
